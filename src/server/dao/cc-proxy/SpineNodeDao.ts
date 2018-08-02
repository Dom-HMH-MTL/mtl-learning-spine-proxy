import { BaseDao, ClientErrorException } from '@hmh/nodejs-base-server';
import { SpineNode as Model } from '../../model/cc-proxy/SpineNode';
import { SkillGroup as Source } from '../../model/cc/SkillGroup';
import { SkillRootGroup } from '../../model/cc/SkillRootGroup';
import { SkillRootGroupDao } from '../cc/SkillRootGroupDao';
import { SkillDao } from './SkillDao';

export class SpineNodeDao extends BaseDao<Model> {
    // Factory method
    public static getInstance(): SpineNodeDao {
        if (!SpineNodeDao.instance) {
            SpineNodeDao.instance = new SpineNodeDao();
        }
        return SpineNodeDao.instance;
    }

    private static instance: SpineNodeDao;

    private skillRootGroupDao: SkillRootGroupDao;
    private skillDao: SkillDao;
    private nodesOfASpine: Map<string, Map<string, Model>>;

    private constructor() {
        super(Model.getInstance());
        this.skillRootGroupDao = SkillRootGroupDao.getInstance();
        this.skillDao = SkillDao.getInstance();
        this.nodesOfASpine = new Map();
    }

    public async get(id: string, parameters?: { [key: string]: any }): Promise<Model> {
        let snapshotId: string;
        if (!id.includes('@')) {
            if (!parameters.spineTreeId) {
                throw new ClientErrorException('The parameter `spineTreeId` is required because the given identifier is not fully qualified!');
            }
            snapshotId = parameters.spineTreeId;
            id += '@' + snapshotId;
        } else {
            snapshotId = id.substring(0, id.indexOf('@'));
        }
        return this.getNodes(snapshotId).then((nodes: Map<string, Model>): Model => nodes.get(id));
    }

    public async query(filters: { [key: string]: any }): Promise<Model[]> {
        return Promise.reject('Not implemented!');
    }
    public async create(candidate: Model): Promise<string> {
        return Promise.reject('Not implemented!');
    }
    public async update(id: string, candidate: Model): Promise<string> {
        return Promise.reject('Not implemented!');
    }
    public async delete(id: string): Promise<void> {
        return Promise.reject('Not implemented!');
    }

    private spreadGroups(snapshotId: string, parentNodeId: string, groups: Source[], depth: number): Map<string, Model> {
        const accumulator: Map<string, Model> = new Map();
        for (const group of groups) {
            const model = new Model(snapshotId, group, depth, parentNodeId);
            accumulator.set(model.id, model);
            const dependencies: Map<string, Model> = this.spreadGroups(snapshotId, model.id, group.children, depth + 1);
            for (const dependencyId of dependencies.keys()) {
                if (dependencyId.startsWith(snapshotId + '@' + (depth + 1) + '-')) {
                    model.childrenIds.push(dependencyId);
                }
                accumulator.set(dependencyId, dependencies.get(dependencyId));
            }
        }
        return accumulator;
    }

    private spreadRoot(snapshotId: string, root: Source): Map<string, Model> {
        const model = new Model(snapshotId, root);
        const accumulator: Map<string, Model> = new Map();
        accumulator.set('root@' + snapshotId, model);
        accumulator.set(model.id, model);
        const dependencies: Map<string, Model> = this.spreadGroups(snapshotId, model.id, root.children, 1);
        for (const dependencyId of dependencies.keys()) {
            if (dependencyId.startsWith(snapshotId + '@1-')) {
                model.childrenIds.push(dependencyId);
            }
            accumulator.set(dependencyId, dependencies.get(dependencyId));
        }
        return accumulator;
    }

    private dispatchSkills(snapshotId: string, node: Source, depth: number = 0): void {
        if (node.skills) {
            for (const skill of node.skills) {
                const nodeId: string = snapshotId + '@' + depth + '-' + node.id;
                this.skillDao.registerSkill(snapshotId, skill, nodeId);
                this.nodesOfASpine
                    .get(snapshotId)
                    .get(nodeId)
                    .skillIds.push(snapshotId + '@' + skill.id);
            }
        }
        for (const child of node.children) {
            this.dispatchSkills(snapshotId, child, depth + 1);
        }
    }

    private async getNodes(spineTreeId: string): Promise<Map<string, Model>> {
        if (this.nodesOfASpine.get(spineTreeId)) {
            return this.nodesOfASpine.get(spineTreeId);
        }
        const rootSkillGroup: SkillRootGroup = await this.skillRootGroupDao.get('root', { snapshotId: spineTreeId, depth: 10, skillDetailLevel: 'high' });
        this.nodesOfASpine.set(spineTreeId, this.spreadRoot(spineTreeId, rootSkillGroup.group));
        this.dispatchSkills(spineTreeId, rootSkillGroup.group);
        return this.nodesOfASpine.get(spineTreeId);
    }
}

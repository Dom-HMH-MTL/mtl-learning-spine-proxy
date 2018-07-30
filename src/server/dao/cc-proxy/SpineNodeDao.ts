import { BaseDao } from '@hmh/nodejs-base-server';
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
    private nodes: Map<string, Model>;

    private constructor() {
        super(Model.getInstance());
        this.skillRootGroupDao = SkillRootGroupDao.getInstance();
        this.skillDao = SkillDao.getInstance();
    }

    public async get(id: string, parameters?: { [key: string]: any }): Promise<Model> {
        return this.getNodes().then((nodes: Map<string, Model>): Model => nodes.get(id));
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

    private spreadGroups(parentNodeId: string, groups: Source[], depth: number): Map<string, Model> {
        const accumulator: Map<string, Model> = new Map();
        for (const group of groups) {
            const model = new Model(group, depth, parentNodeId);
            accumulator.set(model.id, model);
            const dependencies: Map<string, Model> = this.spreadGroups(model.id, group.children, depth + 1);
            for (const dependencyId of dependencies.keys()) {
                if (dependencyId.startsWith(depth + 1 + '-')) {
                    model.childrenIds.push(dependencyId);
                }
                accumulator.set(dependencyId, dependencies.get(dependencyId));
            }
        }
        return accumulator;
    }

    private spreadRoot(root: Source): Map<string, Model> {
        const model = new Model(root);
        const accumulator: Map<string, Model> = new Map();
        accumulator.set('root', model);
        accumulator.set(model.id, model);
        const dependencies: Map<string, Model> = this.spreadGroups(model.id, root.children, 1);
        for (const dependencyId of dependencies.keys()) {
            if (dependencyId.startsWith('1-')) {
                model.childrenIds.push(dependencyId);
            }
            accumulator.set(dependencyId, dependencies.get(dependencyId));
        }
        return accumulator;
    }

    private dispatchSkills(node: Source, depth: number = 0): void {
        if (node.skills) {
            for (const skill of node.skills) {
                const nodeId: string = depth + '-' + node.id;
                this.skillDao.registerSkill(skill, nodeId);
                this.nodes.get(nodeId).skillIds.push(skill.id);
            }
        }
        for (const child of node.children) {
            this.dispatchSkills(child, depth + 1);
        }
    }

    private async getNodes(): Promise<Map<string, Model>> {
        if (this.nodes) {
            return this.nodes;
        }
        const rootSkillGroup: SkillRootGroup = await this.skillRootGroupDao.get('root', { depth: 10, skillDetailLevel: 'high' });
        this.nodes = this.spreadRoot(rootSkillGroup.group);
        this.dispatchSkills(rootSkillGroup.group);
        return this.nodes;
    }
}

import { BaseDao, ClientErrorException, NotFoundException } from '@hmh/nodejs-base-server';
import { Skill as Model } from '../../model/cc-proxy/Skill';
import { Skill as Source } from '../../model/cc/Skill';
import { SkillDao as ModelDAO } from '../cc/SkillDao';

export class SkillDao extends BaseDao<Model> {
    // Factory method
    public static getInstance(): SkillDao {
        if (!SkillDao.instance) {
            SkillDao.instance = new SkillDao();
        }
        return SkillDao.instance;
    }

    private static instance: SkillDao;

    private skillDao: ModelDAO;
    private skills: Map<string, Model>;

    private constructor() {
        super(Model.getInstance());
        this.skillDao = ModelDAO.getInstance();
        this.skills = new Map();
    }

    public async get(id: string, parameters?: { [key: string]: any }): Promise<Model> {
        let snapshotId: string;
        if (!id.includes('@')) {
            throw new ClientErrorException('The parameter `spineTreeId` is required because the given identifier is not fully qualified!');
        }
        snapshotId = id.substring(0, id.indexOf('@'));
        id = id.substring(id.indexOf('@') + 1);
        const skill: Model = await this.getSkill(snapshotId, id);
        if (!skill) {
            throw new NotFoundException(`Cannot get Skill of id '${id}'.`);
        }
        return skill;
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

    public registerSkill(snapshotId: string, skill: Source, parentId: string): boolean {
        if (this.skills.has(snapshotId + '@' + skill.id)) {
            return false;
        }
        this.skills.set(snapshotId + '@' + skill.id, new Model(snapshotId, skill, parentId));
        return true;
    }

    private async getSkill(spineTreeId: string, id: string): Promise<Model> {
        if (this.skills.has(spineTreeId + '@' + id)) {
            return this.skills.get(spineTreeId + '@' + id);
        }
        const skill: Source = await this.skillDao.get(id, { snapshotId: spineTreeId });
        skill.id = id; // Temporary normalization of the Spine API which returns an entity without `id`!
        const depth: number = skill.spineContext.length;
        const parentId: string = depth - 1 + '-' + skill.spineContext[depth - 1].groupId;
        this.registerSkill(spineTreeId, skill, parentId);
        return this.skills.get(id);
    }
}

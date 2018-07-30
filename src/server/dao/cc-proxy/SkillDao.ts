import { BaseDao } from '@hmh/nodejs-base-server';
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
        return this.getSkill(id);
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

    public registerSkill(skill: Source, parentId: string): boolean {
        if (this.skills.has(skill.id)) {
            return false;
        }
        this.skills.set(skill.id, new Model(skill, parentId));
        return true;
    }

    private async getSkill(id: string): Promise<Model> {
        if (this.skills.has(id)) {
            return this.skills.get(id);
        }
        const skill: Source = await this.skillDao.get(id);
        skill.id = id; // Temporary normalization of the Spine API which returns an entity without `id`!
        const depth: number = skill.spineContext.length;
        const parentId: string = depth - 1 + '-' + skill.spineContext[depth - 1].groupId;
        this.registerSkill(skill, parentId);
        return this.skills.get(id);
    }
}

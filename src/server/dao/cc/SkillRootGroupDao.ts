import { SkillRootGroup as Model } from '../../model/cc/SkillRootGroup';
import { BaseDao } from './BaseDao';

export class SkillRootGroupDao extends BaseDao<Model> {
    // Factory method
    public static getInstance(): SkillRootGroupDao {
        if (!SkillRootGroupDao.instance) {
            SkillRootGroupDao.instance = new SkillRootGroupDao();
        }
        return SkillRootGroupDao.instance;
    }
    private static instance: SkillRootGroupDao;

    private constructor() {
        super(Model.getInstance());
    }

    public get modelName(): string {
        return 'SkillGroup';
    }

    public async get(id: string, parameters?: { [key: string]: any }): Promise<Model> {
        if (id === 'root') {
            return super.get('', parameters);
        }
        return Promise.reject('Operation not supported!');
    }
}

import { SkillGroup as Model } from '../../model/cc/SkillGroup';
import { SkillRootGroup } from '../../model/cc/SkillRootGroup';
import { BaseDao } from './BaseDao';
import { SkillRootGroupDao } from './SkillRootGroupDao';

export class SkillGroupDao extends BaseDao<Model> {
    // Factory method
    public static getInstance(): SkillGroupDao {
        if (!SkillGroupDao.instance) {
            SkillGroupDao.instance = new SkillGroupDao();
        }
        return SkillGroupDao.instance;
    }
    private static instance: SkillGroupDao;

    private skillRootGroupDao: SkillRootGroupDao;

    private constructor() {
        super(Model.getInstance());
        this.skillRootGroupDao = SkillRootGroupDao.getInstance();
    }

    public async get(id: string, parameters?: { [key: string]: any }): Promise<Model> {
        if (id === 'root') {
            return this.skillRootGroupDao.get(id, parameters).then((root: SkillRootGroup) => root.group);
        }
        return Promise.reject('Operation not supported!');
    }
}

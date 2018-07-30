import { Skill as Model } from '../../model/cc/Skill';
import { BaseDao } from './BaseDao';

export class SkillDao extends BaseDao<Model> {
    // Factory method
    public static getInstance(): SkillDao {
        if (!SkillDao.instance) {
            SkillDao.instance = new SkillDao();
        }
        return SkillDao.instance;
    }

    private static instance: SkillDao;

    private constructor() {
        super(Model.getInstance());
    }
}

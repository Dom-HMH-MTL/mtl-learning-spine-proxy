import { BaseService } from '@hmh/nodejs-base-server';
import { SkillGroupDao as DAO } from '../../dao/cc/SkillGroupDao';

export class SkillGroupService extends BaseService<DAO> {
    public static getInstance(): SkillGroupService {
        if (!SkillGroupService.instance) {
            SkillGroupService.instance = new SkillGroupService();
        }
        return SkillGroupService.instance;
    }

    private static instance: SkillGroupService;

    private constructor() {
        super(DAO.getInstance());
    }
}

import { BaseService } from '@hmh/nodejs-base-server';
import { SkillDao as DAO } from '../../dao/cc-proxy/SkillDao';

export class SkillService extends BaseService<DAO> {
    public static getInstance(): SkillService {
        if (!SkillService.instance) {
            SkillService.instance = new SkillService();
        }
        return SkillService.instance;
    }

    private static instance: SkillService;

    private constructor() {
        super(DAO.getInstance());
    }
}

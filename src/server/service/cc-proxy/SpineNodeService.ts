import { BaseService } from '@hmh/nodejs-base-server';
import { SpineNodeDao as DAO } from '../../dao/cc-proxy/SpineNodeDao';

export class SpineNodeService extends BaseService<DAO> {
    public static getInstance(): SpineNodeService {
        if (!SpineNodeService.instance) {
            SpineNodeService.instance = new SpineNodeService();
        }
        return SpineNodeService.instance;
    }

    private static instance: SpineNodeService;

    private constructor() {
        super(DAO.getInstance());
    }
}

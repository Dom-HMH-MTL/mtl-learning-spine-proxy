import { BaseService } from '@hmh/nodejs-base-server';
import { SpineTreeDao as DAO } from '../../dao/cc-proxy/SpineTreeDao';

export class SpineTreeService extends BaseService<DAO> {
    public static getInstance(): SpineTreeService {
        if (!SpineTreeService.instance) {
            SpineTreeService.instance = new SpineTreeService();
        }
        return SpineTreeService.instance;
    }

    private static instance: SpineTreeService;

    private constructor() {
        super(DAO.getInstance());
    }
}

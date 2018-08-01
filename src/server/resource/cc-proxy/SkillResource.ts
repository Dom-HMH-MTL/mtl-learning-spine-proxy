import { BaseResource } from '@hmh/nodejs-base-server';
import { SkillService as Service } from '../../service/cc-proxy/SkillService';

export class SkillResource extends BaseResource<Service> {
    // Factory method
    public static getInstance(): SkillResource {
        if (!SkillResource.instance) {
            SkillResource.instance = new SkillResource();
        }
        return SkillResource.instance;
    }

    private static instance: SkillResource;

    private constructor() {
        super(Service.getInstance());
    }
    protected getServiceType(): string {
        return 'cc-proxy';
    }
}

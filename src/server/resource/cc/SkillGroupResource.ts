import { BaseResource } from '@hmh/nodejs-base-server';
import { SkillGroupService as Service } from '../../service/cc/SkillGroupService';

export class SkillGroupResource extends BaseResource<Service> {
    // Factory method
    public static getInstance(): SkillGroupResource {
        if (!SkillGroupResource.instance) {
            SkillGroupResource.instance = new SkillGroupResource();
        }
        return SkillGroupResource.instance;
    }

    private static instance: SkillGroupResource;

    private constructor() {
        super(Service.getInstance());
    }

    protected getServiceType(): string {
        return 'cc';
    }
}

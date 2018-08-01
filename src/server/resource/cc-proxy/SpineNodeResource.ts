import { BaseResource } from '@hmh/nodejs-base-server';
import { SpineNodeService as Service } from '../../service/cc-proxy/SpineNodeService';

export class SpineNodeResource extends BaseResource<Service> {
    // Factory method
    public static getInstance(): SpineNodeResource {
        if (!SpineNodeResource.instance) {
            SpineNodeResource.instance = new SpineNodeResource();
        }
        return SpineNodeResource.instance;
    }

    private static instance: SpineNodeResource;

    private constructor() {
        super(Service.getInstance());
    }
    protected getServiceType(): string {
        return 'cc-proxy';
    }
}

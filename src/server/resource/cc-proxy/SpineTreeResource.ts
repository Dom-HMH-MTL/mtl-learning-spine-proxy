import { BaseResource } from '@hmh/nodejs-base-server';
import { SpineTreeService as Service } from '../../service/cc-proxy/SpineTreeService';

export class SpineTreeResource extends BaseResource<Service> {
    // Factory method
    public static getInstance(): SpineTreeResource {
        if (!SpineTreeResource.instance) {
            SpineTreeResource.instance = new SpineTreeResource();
        }
        return SpineTreeResource.instance;
    }

    private static instance: SpineTreeResource;

    private constructor() {
        super(Service.getInstance());
    }
    protected getServiceType(): string {
        return 'cc-proxy';
    }
}

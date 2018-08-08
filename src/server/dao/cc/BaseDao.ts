import { BaseModel as Model } from '@hmh/nodejs-base-server';
import { BaseHttpDao } from '@hmh/nodejs-base-server';
import { NotFoundException } from '@hmh/nodejs-base-server';
import { Response } from 'node-fetch';
import { SpineServiceApiInfo } from './SpineServiceApiInfo';

export class BaseDao<T extends Model> extends BaseHttpDao<T> {
    protected apiInfo: SpineServiceApiInfo = new SpineServiceApiInfo(); // Temporary limitation, until the list of supported `spineId` is exposed

    public async getServiceUrl(snapshotId: string): Promise<string> {
        return this.apiInfo.baseUrl + '/snapshot/' + snapshotId + '/';
    }

    public async get(id: string, parameters?: { [key: string]: any }): Promise<T> {
        const endPoint = (await this.getServiceUrl(parameters.snapshotId)) + this.modelName.toLowerCase() + '/' + id;
        // console.log('Reaching Learning Spine Store at URL:', endPoint);
        const fromHttp: Response = await this.getFromHttp(endPoint, parameters);

        if (fromHttp.ok) {
            const payload: { [key: string]: any } = await fromHttp.json();
            return Object.assign(this.getModelInstance(), payload);
        }
        throw new NotFoundException(`Cannot get ${this.modelName} entity with id: ${id}!`);
    }

    public async query(filters: { [key: string]: any }): Promise<T[]> {
        return Promise.reject('Operation not supported!');
    }

    public async create(candidate: T): Promise<string> {
        return Promise.reject('Operation not supported!');
    }

    public async update(id: string, candidate: T): Promise<string> {
        return Promise.reject('Operation not supported!');
    }

    public async delete(id: string): Promise<void> {
        return Promise.reject('Operation not supported!');
    }
}

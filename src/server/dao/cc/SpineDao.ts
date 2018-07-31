import { NotFoundException } from '@hmh/nodejs-base-server';
import { Response } from 'node-fetch';
import { Spine as Model } from '../../model/cc/Spine';
import { BaseDao } from './BaseDao';

export class SpineDao extends BaseDao<Model> {
    // Factory method
    public static getInstance(): SpineDao {
        if (!SpineDao.instance) {
            SpineDao.instance = new SpineDao();
        }
        return SpineDao.instance;
    }

    private static instance: SpineDao;

    private constructor() {
        super(Model.getInstance());
    }

    public async get(id: string, parameters?: { [key: string]: any }): Promise<Model> {
        return Promise.reject('Operation not supported!');
    }

    public async query(filters: { [key: string]: any }): Promise<Model[]> {
        const serviceUrl = this.apiInfo.baseUrl;
        const fromHttp: Response = await this.getFromHttp(serviceUrl, {});

        if (fromHttp.ok) {
            const payload: Array<{ [key: string]: any }> = await fromHttp.json();
            const spines: Model[] = [];
            for (const spine of payload) {
                spines.push(Object.assign(this.getModelInstance(), spine));
            }
            return spines;
        }
        throw new NotFoundException(`Cannot select ${this.modelName} entities!`);
    }
}

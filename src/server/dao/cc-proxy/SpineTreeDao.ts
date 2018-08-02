import { BaseDao } from '@hmh/nodejs-base-server';
import { SpineTree as Model } from '../../model/cc-proxy/SpineTree';
import { Spine as Source } from '../../model/cc/Spine';
import { SpineDao as ModelDAO } from '../cc/SpineDao';

export class SpineTreeDao extends BaseDao<Model> {
    // Factory method
    public static getInstance(): SpineTreeDao {
        if (!SpineTreeDao.instance) {
            SpineTreeDao.instance = new SpineTreeDao();
        }
        return SpineTreeDao.instance;
    }

    private static instance: SpineTreeDao;
    private spineDao: ModelDAO;
    private spines: Model[] = [];

    private constructor() {
        super(Model.getInstance());
        this.spineDao = ModelDAO.getInstance();
    }

    public async get(id: string, parameters?: { [key: string]: any }): Promise<Model> {
        return Promise.reject('Not implemented!');
    }

    public async query(): Promise<Model[]> {
        return this.getSpines();
    }
    public async create(candidate: Model): Promise<string> {
        return Promise.reject('Not implemented!');
    }
    public async update(id: string, candidate: Model): Promise<string> {
        return Promise.reject('Not implemented!');
    }
    public async delete(id: string): Promise<void> {
        return Promise.reject('Not implemented!');
    }
    private async getSpines(): Promise<Model[]> {
        if (this.spines.length !== 0) {
            return this.spines;
        }
        const spines: Source[] = await this.spineDao.query();
        for (const spine of spines) {
            this.spines.push(new Model(spine));
        }
        return this.spines;
    }
}

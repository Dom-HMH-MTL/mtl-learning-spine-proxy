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
    private spines: Map<string, Model>;

    private constructor() {
        super(Model.getInstance());
        this.spines = new Map();
        this.spineDao = ModelDAO.getInstance();
    }

    public async get(id: string, parameters?: { [key: string]: any }): Promise<Model> {
        return this.getSpine(id);
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
    private async populateSpines() {
        const spines: Source[] = await this.spineDao.query();
        for (const spine of spines) {
            this.spines.set(spine.spineId, new Model(spine));
        }
    }
    private async getSpine(id: string): Promise<Model> {
        if (this.spines.has(id)) {
            return this.spines.get(id);
        }
        await this.populateSpines();
        return this.spines.get(id);
    }
    private async getSpines(): Promise<Model[]> {
        if (this.spines.size !== 0) {
            return Array.from(this.spines.values());
        }
        await this.populateSpines();
        return Array.from(this.spines.values());
    }
}

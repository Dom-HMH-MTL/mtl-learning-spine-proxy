import { NotFoundException } from '@hmh/nodejs-base-server';
import intern from 'intern';
import { SinonStub, stub } from 'sinon';
import { SpineTreeDao as DAO } from '../../../server/dao/cc-proxy/SpineTreeDao';
import { SpineTree as Model } from '../../../server/model/cc-proxy/SpineTree';
import { Spine as Source } from '../../../server/model/cc/Spine';

const { suite, test } = intern.getInterface('tdd');
const { assert } = intern.getPlugin('chai');

suite(
    __filename.substring(__filename.indexOf('/server-unit/') + '/server-unit/'.length),
    (): void => {
        test('getInstance()', (): void => {
            const dao: DAO = DAO.getInstance();
            assert.isTrue(dao instanceof DAO);
            assert.strictEqual(DAO.getInstance(), dao);
            assert.strictEqual(DAO.getInstance(), dao);
        });
        test('constructor', (): void => {
            // @ts-ignore: access to private constructor
            const dao: DAO = new DAO();
            assert.strictEqual(dao.modelName, 'SpineTree');
            // @ts-ignore: access to private attribute
            assert.isNotNull(dao.spineDao);
            // @ts-ignore: access to private attribute
            assert.isNotNull(dao.spines);
        });
        suite(
            'query',
            (): void => {
                test('success', async (): Promise<void> => {
                    // @ts-ignore: access to private constructor
                    const dao: DAO = new DAO();
                    const spineSources: Source[] = [
                        {
                            spineId: 'id',
                            title: 'name',
                            versionId: 'snapshotId'
                        } as Source
                    ];
                    const spineModels: Model[] = [new Model(spineSources[0])];
                    // @ts-ignore: access to private method
                    const daoQueryStub: SinonStub = stub(dao.spineDao, 'query').returns(spineSources);
                    // @ts-ignore: access to private attribute
                    assert.deepEqual(await dao.query(), spineModels);
                    assert.isTrue(daoQueryStub.calledOnce);
                    daoQueryStub.restore();
                });
                test('failure', async (): Promise<void> => {
                    // @ts-ignore: access to private constructor
                    const dao: DAO = new DAO();
                    const spines: Model[] = [
                        {
                            id: 'id',
                            name: 'name'
                        } as Model
                    ];
                    // @ts-ignore: access to private attribute
                    spines.forEach((spine: Model) => dao.spines.push(spine));
                    // @ts-ignore: access to private attribute
                    const daoQueryStub: SinonStub = stub(dao.spineDao, 'query');
                    assert.deepEqual(await dao.query(), spines);
                    assert.isTrue(daoQueryStub.notCalled);
                    daoQueryStub.restore();
                });
            }
        );
        suite(
            'get',
            (): void => {
                test('success', async (): Promise<void> => {
                    // @ts-ignore: access to private constructor
                    const dao: DAO = new DAO();
                    const spines: Model[] = [
                        {
                            id: 'id',
                            name: 'name'
                        } as Model
                    ];
                    // @ts-ignore: access to private method
                    const getSpinesStub: SinonStub = stub(dao, 'getSpines').returns(spines);
                    assert.deepEqual(await dao.get(spines[0].id), spines[0]);
                    assert.isTrue(getSpinesStub.calledOnce);
                    getSpinesStub.restore();
                });
                test('failure', async (): Promise<void> => {
                    // @ts-ignore: access to private constructor
                    const dao: DAO = new DAO();
                    // @ts-ignore: access to private method
                    const getSpinesStub: SinonStub = stub(dao, 'getSpines').returns([]);
                    const id: string = 'id';
                    try {
                        await dao.get(id);
                        assert.fail('Unexpected success!');
                    } catch (error) {
                        assert.isTrue(error instanceof NotFoundException);
                        assert.strictEqual(error.message, `SpineTree with id '${id}' not found`);
                    }
                    getSpinesStub.restore();
                });
            }
        );
        test('create', async (): Promise<void> => {
            // @ts-ignore: access to private constructor
            const dao: DAO = new DAO();
            try {
                await dao.create({} as Model);
                assert.fail('Unexpected success!');
            } catch (error) {
                assert.strictEqual(error, 'Not implemented!');
            }
        });
        test('update', async (): Promise<void> => {
            // @ts-ignore: access to private constructor
            const dao: DAO = new DAO();
            try {
                await dao.update('id', {} as Model);
                assert.fail('Unexpected success!');
            } catch (error) {
                assert.strictEqual(error, 'Not implemented!');
            }
        });
        test('delete', async (): Promise<void> => {
            // @ts-ignore: access to private constructor
            const dao: DAO = new DAO();
            try {
                await dao.delete('id');
                assert.fail('Unexpected success!');
            } catch (error) {
                assert.strictEqual(error, 'Not implemented!');
            }
        });
    }
);

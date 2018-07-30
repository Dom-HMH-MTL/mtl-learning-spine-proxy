import { BaseModel } from '@hmh/nodejs-base-server';
import intern from 'intern';
import { Headers, Response } from 'node-fetch';
import { SinonStub, stub } from 'sinon';
import { BaseDao as DAO } from '../../../server/dao/cc/BaseDao';
import { SpineServiceApiInfo } from '../../../server/dao/cc/SpineServiceApiInfo';

const { suite, test } = intern.getInterface('tdd');
const { assert } = intern.getPlugin('chai');

// tslint:disable: max-classes-per-file
class TestModel extends BaseModel {
    public static getInstance(): BaseModel {
        return new TestModel();
    }
}
// @ts-ignore: abstract methods don't need to be implemented for the tests
class TestDao extends DAO<TestModel> {
    public constructor() {
        super(new TestModel());
    }
}

suite(
    __filename.substring(__filename.indexOf('/server-unit/') + '/server-unit/'.length),
    (): void => {
        test('default getInstance() implementation', (): void => {
            assert.throw(DAO.getInstance, Error, /Must be overriden!/);
        });

        suite(
            'get',
            (): void => {
                test('success', async (): Promise<void> => {
                    const dao: TestDao = new TestDao();
                    // @ts-ignore: access to private method
                    const getServiceUrlStub: SinonStub = stub(dao, 'getServiceUrl');
                    getServiceUrlStub.withArgs().returns(Promise.resolve('//url/'));
                    // @ts-ignore: access to private method
                    const getFromHttpStub: SinonStub = stub(dao, 'getFromHttp');
                    const parameters: { [key: string]: any } = {};
                    getFromHttpStub.withArgs('//url/testmodel/id', parameters).returns({
                        json: async (): Promise<any> => {
                            return Promise.resolve({ id: 'id' });
                        },
                        ok: true
                    } as Response);

                    const loaded: TestModel = await dao.get('id', parameters);
                    assert.strictEqual(loaded.id, 'id');

                    assert.isTrue(getServiceUrlStub.calledOnce);
                    assert.isTrue(getFromHttpStub.calledOnce);
                    getServiceUrlStub.restore();
                    getFromHttpStub.restore();
                });
                test('failure', async (): Promise<void> => {
                    const dao: TestDao = new TestDao();
                    // @ts-ignore: access to private method
                    const getServiceUrlStub: SinonStub = stub(dao, 'getServiceUrl');
                    getServiceUrlStub.withArgs().returns(Promise.resolve('//url/'));
                    // @ts-ignore: access to private method
                    const getFromHttpStub: SinonStub = stub(dao, 'getFromHttp');
                    const parameters: { [key: string]: any } = {};
                    getFromHttpStub.withArgs('//url/testmodel/id', parameters).returns({
                        ok: false
                    } as Response);

                    try {
                        await dao.get('id', parameters);
                        assert.fail('Unexpected success!');
                    } catch (error) {
                        assert.isTrue(-1 < error.message.indexOf('Cannot get TestModel entity'));
                    }

                    assert.isTrue(getServiceUrlStub.calledOnce);
                    assert.isTrue(getFromHttpStub.calledOnce);
                    getServiceUrlStub.restore();
                    getFromHttpStub.restore();
                });
            }
        );
        suite(
            'getServiceUrl',
            (): void => {
                const apiInfo: SpineServiceApiInfo = new SpineServiceApiInfo('Math'); // Temporary limitation, until the list of supported `spineId` is exposed
                const serviceUrl = apiInfo.baseUrl + '/ref/' + apiInfo.defaultSpineId + '/current/';

                test('success', async (): Promise<void> => {
                    const dao: TestDao = new TestDao();
                    // @ts-ignore: access to private method
                    const getFromHttpStub: SinonStub = stub(dao, 'getFromHttp');
                    getFromHttpStub.withArgs(serviceUrl + 'skillgroup?depth=0&skillDetailLevel=none').returns({
                        headers: {
                            get: (key: string): string => {
                                if (key === 'X-Version-Snapshot') {
                                    return '123456789';
                                }
                                throw new Error(`Unexpected call to headers.get() with key: ${key}!`);
                            }
                        } as Headers,
                        ok: true
                    } as Response);

                    const url: string = await dao.getServiceUrl();
                    assert.strictEqual(url, apiInfo.baseUrl + '/snapshot/123456789/');
                    assert.strictEqual(await dao.getServiceUrl(), url);

                    assert.isTrue(getFromHttpStub.calledOnce);
                    getFromHttpStub.restore();
                });
                test('failure', async (): Promise<void> => {
                    const dao: TestDao = new TestDao();
                    // @ts-ignore: access to private method
                    const getFromHttpStub: SinonStub = stub(dao, 'getFromHttp');
                    getFromHttpStub.withArgs(serviceUrl + 'skillgroup?depth=0&skillDetailLevel=none').returns({ ok: false } as Response);

                    const url: string = await dao.getServiceUrl();
                    assert.strictEqual(url, serviceUrl);
                    assert.strictEqual(await dao.getServiceUrl(), url);

                    assert.isTrue(getFromHttpStub.calledOnce);
                    getFromHttpStub.restore();
                });
            }
        );
        test('query', async (): Promise<void> => {
            // @ts-ignore: access to private constructor
            const dao: DAO = new DAO();
            try {
                await dao.query({});
                assert.fail('Unexpected success!');
            } catch (error) {
                assert.strictEqual(error, 'Operation not supported!');
            }
        });
        test('create', async (): Promise<void> => {
            // @ts-ignore: access to private constructor
            const dao: DAO = new DAO();
            try {
                await dao.create({} as BaseModel);
                assert.fail('Unexpected success!');
            } catch (error) {
                assert.strictEqual(error, 'Operation not supported!');
            }
        });
        test('update', async (): Promise<void> => {
            // @ts-ignore: access to private constructor
            const dao: DAO = new DAO();
            try {
                await dao.update('id', {} as BaseModel);
                assert.fail('Unexpected success!');
            } catch (error) {
                assert.strictEqual(error, 'Operation not supported!');
            }
        });
        test('delete', async (): Promise<void> => {
            // @ts-ignore: access to private constructor
            const dao: DAO = new DAO();
            try {
                await dao.delete('id');
                assert.fail('Unexpected success!');
            } catch (error) {
                assert.strictEqual(error, 'Operation not supported!');
            }
        });
    }
);

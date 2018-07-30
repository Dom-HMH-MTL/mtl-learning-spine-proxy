import intern from 'intern';
import { SinonStub, stub } from 'sinon';
import { SkillRootGroupDao as DAO } from '../../../server/dao/cc/SkillRootGroupDao';
import { SkillRootGroup as Model } from '../../../server/model/cc/SkillRootGroup';

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
            // @ts-ignore: access to private attribute
            assert.isNotNull(dao.skillRootGroupDao);
        });
        test('modellName()', (): void => {
            assert.strictEqual(DAO.getInstance().modelName, 'SkillGroup');
        });
        suite(
            'get',
            (): void => {
                test('success', async (): Promise<void> => {
                    // @ts-ignore: access to private constructor
                    const dao: DAO = new DAO(new Model());
                    // @ts-ignore: access to private method
                    const getServiceUrlStub: SinonStub = stub(dao, 'getServiceUrl');
                    getServiceUrlStub.withArgs().returns(Promise.resolve('//url/'));
                    // @ts-ignore: access to private method
                    const getFromHttpStub: SinonStub = stub(dao, 'getFromHttp');
                    const parameters: { [key: string]: any } = {};
                    getFromHttpStub.withArgs('//url/skillgroup/', parameters).returns({
                        json: async (): Promise<any> => {
                            return Promise.resolve({
                                group: {
                                    children: [],
                                    id: 'id1'
                                },
                                id: 'id0'
                            });
                        },
                        ok: true
                    } as Response);

                    const rootGroup: Model = await dao.get('root', parameters);
                    assert.strictEqual(rootGroup.id, 'id0');
                    assert.strictEqual(rootGroup.group.id, 'id1');

                    assert.isTrue(getServiceUrlStub.calledOnce);
                    assert.isTrue(getFromHttpStub.calledOnce);
                    getServiceUrlStub.restore();
                    getFromHttpStub.restore();
                });
                test('failure', async (): Promise<void> => {
                    // @ts-ignore: access to private constructor
                    const dao: DAO = new DAO();
                    try {
                        await dao.get('whatever');
                        assert.fail('Unexpected success!');
                    } catch (error) {
                        assert.strictEqual(error, 'Operation not supported!');
                    }
                });
            }
        );
    }
);

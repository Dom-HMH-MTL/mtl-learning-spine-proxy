import { NotFoundException } from '@hmh/nodejs-base-server';
import intern from 'intern';
import { SinonStub, stub } from 'sinon';
import { SpineDao as DAO } from '../../../server/dao/cc/SpineDao';
import { Spine as Model } from '../../../server/model/cc/Spine';

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

        suite(
            'query',
            (): void => {
                test('success', async (): Promise<void> => {
                    // @ts-ignore: access to private constructor
                    const dao: DAO = new DAO(new Model());
                    const spine: Model[] = [
                        {
                            discipline: 'discipline',
                            spineId: 'id',
                            title: 'name',
                            versionId: 'versionId'
                        } as Model
                    ];
                    const response: any = await {
                        json: () => spine,
                        ok: true
                    };
                    const fromHttpStub: SinonStub = stub(dao, 'getFromHttp');
                    fromHttpStub.returns(Promise.resolve(response));
                    assert.deepEqual(await dao.query(), spine);
                    assert.isTrue(fromHttpStub.calledOnce);
                    fromHttpStub.restore();
                });

                test('failure', async (): Promise<void> => {
                    // @ts-ignore: access to private constructor
                    const dao: DAO = new DAO();
                    try {
                        const response: any = await {
                            json: () => '{}',
                            ok: false
                        };
                        const fromHttpStub: SinonStub = stub(dao, 'getFromHttp');
                        fromHttpStub.returns(Promise.resolve(response));
                        await dao.query();
                        assert.fail('Unexpected success!');
                    } catch (error) {
                        assert.isTrue(error instanceof NotFoundException);
                        assert.strictEqual(error.message, `Cannot select ${dao.modelName} entities!`);
                    }
                });
            }
        );
        test('get', async (): Promise<void> => {
            // @ts-ignore: access to private constructor
            const dao: DAO = new DAO(new Model());
            try {
                await dao.get('whatever');
                assert.fail('Unexpected success!');
            } catch (error) {
                assert.strictEqual(error, 'Operation not supported!');
            }
        });
    }
);

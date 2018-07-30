import intern from 'intern';
import { SinonStub, stub } from 'sinon';
import { SkillGroupDao as DAO } from '../../../server/dao/cc/SkillGroupDao';
import { SkillGroup as Model } from '../../../server/model/cc/SkillGroup';
import { SkillRootGroup } from '../../../server/model/cc/SkillRootGroup';

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
        suite(
            'get',
            (): void => {
                test('success', async (): Promise<void> => {
                    // @ts-ignore: access to private constructor
                    const dao: DAO = new DAO(new Model());
                    // @ts-ignore: access to private attribute
                    const getStub: SinonStub = stub(dao.skillRootGroupDao, 'get');
                    const parameters: { [key: string]: any } = {};
                    const root: SkillRootGroup = { group: {} as Model } as SkillRootGroup;
                    getStub.withArgs('root', parameters).returns(Promise.resolve(root));

                    assert.strictEqual(await dao.get('root', parameters), root.group);

                    assert.isTrue(getStub.calledOnce);
                    getStub.restore();
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

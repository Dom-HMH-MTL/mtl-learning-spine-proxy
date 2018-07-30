import intern from 'intern';
import { SinonStub, stub } from 'sinon';
import { SkillDao as DAO } from '../../../server/dao/cc-proxy/SkillDao';
import { Skill as Model } from '../../../server/model/cc-proxy/Skill';
import { Skill as Source } from '../../../server/model/cc/Skill';

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
            assert.strictEqual(dao.modelName, 'Skill');
            // @ts-ignore: access to private attribute
            assert.isNotNull(dao.skillDao);
            // @ts-ignore: access to private attribute
            assert.isNotNull(dao.skills);
        });
        test('get', async (): Promise<void> => {
            // @ts-ignore: access to private constructor
            const dao: DAO = new DAO();
            // @ts-ignore: access to private method
            const getSkillStub: SinonStub = stub(dao, 'getSkill');
            const data: Model = {} as Model;
            getSkillStub.withArgs('id').returns(data);

            assert.strictEqual(await dao.get('id'), data);

            assert.isTrue(getSkillStub.calledOnce);
            getSkillStub.restore();
        });
        test('query', async (): Promise<void> => {
            // @ts-ignore: access to private constructor
            const dao: DAO = new DAO();
            try {
                await dao.query({});
                assert.fail('Unexpected success!');
            } catch (error) {
                assert.strictEqual(error, 'Not implemented!');
            }
        });
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
        test('getSkill', async (): Promise<void> => {
            // @ts-ignore: access to private constructor
            const dao: DAO = new DAO();
            // @ts-ignore: access to private attribute
            const getStub: SinonStub = stub(dao.skillDao, 'get');
            const source: Source = Object.assign(new Source(), { title: 'addition', description: 'blah-blah', spineContext: [{ groupId: 'parent-name' }] });
            getStub.withArgs('abc').returns(source);
            const expected: Model = Object.assign(new Model(), {
                description: 'blah-blah',
                id: 'abc',
                name: 'addition',
                parentId: '0-parent-name'
            });

            // @ts-ignore: access to private method
            const loaded: Model = await dao.getSkill('abc');
            assert.deepEqual(loaded, expected);
            // @ts-ignore: access to private method
            assert.strictEqual(await dao.getSkill('abc'), loaded);

            assert.isTrue(getStub.calledOnce);
            getStub.restore();
        });
        test('registerSkill', (): void => {
            // @ts-ignore: access to private constructor
            const dao: DAO = new DAO();
            // @ts-ignore: access to private attribute
            const skill: Source = Object.assign(new Source(), { id: 'abc', title: 'addition' });

            assert.isTrue(dao.registerSkill(skill, 'parentId'));
            assert.isFalse(dao.registerSkill(skill, 'parentId'));
        });
    }
);

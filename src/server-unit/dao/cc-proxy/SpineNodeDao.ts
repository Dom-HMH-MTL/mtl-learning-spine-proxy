import intern from 'intern';
import { SinonStub, stub } from 'sinon';
import { SpineNodeDao as DAO } from '../../../server/dao/cc-proxy/SpineNodeDao';
import { Skill as LeafModel } from '../../../server/model/cc-proxy/Skill';
import { SpineNode } from '../../../server/model/cc-proxy/SpineNode';
import { Skill } from '../../../server/model/cc/Skill';
import { SkillGroup } from '../../../server/model/cc/SkillGroup';
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
        });
        test('constructor', (): void => {
            // @ts-ignore: access to private constructor
            const dao: DAO = new DAO();
            assert.strictEqual(dao.modelName, 'SpineNode');
            // @ts-ignore: access to private attribute
            assert.isNotNull(dao.skillRootGroupDao);
            // @ts-ignore: access to private attribute
            assert.isNotNull(dao.skillDao);
        });
        test('get', async (): Promise<void> => {
            // @ts-ignore: access to private constructor
            const dao: DAO = new DAO();
            // @ts-ignore: access to private method
            const getNodesStub: SinonStub = stub(dao, 'getNodes');
            const nodes: Map<string, SpineNode> = new Map();
            const node: SpineNode = {} as SpineNode;
            nodes.set('id', node);
            getNodesStub.withArgs().returns(Promise.resolve(nodes));

            assert.strictEqual(await dao.get('id'), node);

            assert.isTrue(getNodesStub.calledOnce);
            getNodesStub.restore();
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
                await dao.create({} as SpineNode);
                assert.fail('Unexpected success!');
            } catch (error) {
                assert.strictEqual(error, 'Not implemented!');
            }
        });
        test('update', async (): Promise<void> => {
            // @ts-ignore: access to private constructor
            const dao: DAO = new DAO();
            try {
                await dao.update('id', {} as SpineNode);
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
        test('getNodes', async (): Promise<void> => {
            // @ts-ignore: access to private constructor
            const dao: DAO = new DAO();
            // @ts-ignore: access to private attribute
            const getStub: SinonStub = stub(dao.skillRootGroupDao, 'get');
            const root: SkillRootGroup = new SkillRootGroup();
            const group: SkillGroup = new SkillGroup();
            root.group = group;
            getStub.withArgs('root', { depth: 10, skillDetailLevel: 'high' }).returns(root);
            // @ts-ignore: access to private attribute
            const spreadRootStub: SinonStub = stub(dao, 'spreadRoot');
            const nodes: Map<string, SpineNode> = new Map();
            spreadRootStub.withArgs(group).returns(nodes);
            // @ts-ignore: access to private attribute
            const dispatchSkillsStub: SinonStub = stub(dao, 'dispatchSkills');
            dispatchSkillsStub.withArgs(group).returns(nodes);

            // @ts-ignore: access to private method
            const loaded: Map<string, SpineNode> = await dao.getNodes();
            assert.deepEqual(loaded, nodes);
            // @ts-ignore: access to private method
            assert.strictEqual(await dao.getNodes(), loaded);

            assert.isTrue(getStub.calledOnce);
            assert.isTrue(spreadRootStub.calledOnce);
            assert.isTrue(dispatchSkillsStub.calledOnce);
            getStub.restore();
            spreadRootStub.restore();
            dispatchSkillsStub.restore();
        });
        test('spreadRoot', (): void => {
            // @ts-ignore: access to private constructor
            const dao: DAO = new DAO();
            const root: SkillGroup = {
                children: [
                    {
                        children: [
                            {
                                children: [
                                    {
                                        children: [],
                                        id: 'subcluster'
                                    } as SkillGroup
                                ],
                                id: 'cluster'
                            } as SkillGroup
                        ],
                        id: 'domain'
                    } as SkillGroup
                ],
                id: 'top'
            } as SkillGroup;

            // @ts-ignore: access to private method
            const loaded: Map<string, SpineNode> = dao.spreadRoot(root);

            assert.strictEqual(loaded.size, 5);
            assert.deepEqual(loaded.get('0-top'), loaded.get('root'));
            assert.deepEqual(loaded.get('0-top'), Object.assign(new SpineNode(root, 0), { childrenIds: ['1-domain'] }));
            assert.deepEqual(loaded.get('1-domain'), Object.assign(new SpineNode(root.children[0], 1), { parentId: '0-top', childrenIds: ['2-cluster'] }));
            assert.deepEqual(
                loaded.get('2-cluster'),
                Object.assign(new SpineNode(root.children[0].children[0], 2), { parentId: '1-domain', childrenIds: ['3-subcluster'] })
            );
            assert.deepEqual(loaded.get('3-subcluster'), Object.assign(new SpineNode(root.children[0].children[0].children[0], 3), { parentId: '2-cluster' }));
        });
        test('dispatchSkills', (): void => {
            // @ts-ignore: access to private constructor
            const dao: DAO = new DAO();
            const root: SkillGroup = {
                children: [
                    {
                        children: [],
                        id: 'domain-A',
                        skills: [
                            {
                                id: 'd1'
                            } as Skill
                        ]
                    } as SkillGroup,
                    {
                        children: [],
                        id: 'domain-B'
                    } as SkillGroup
                ],
                id: 'top',
                skills: [
                    {
                        id: 'r0'
                    } as Skill
                ]
            } as SkillGroup;

            // @ts-ignore: access to private method
            dao.nodes = dao.spreadRoot(root);
            // @ts-ignore: access to private method
            dao.dispatchSkills(root);

            // @ts-ignore: access to private attributes
            const skills: Map<string, LeafModel> = dao.skillDao.skills;
            assert.strictEqual(skills.size, 2);
            assert.deepEqual(skills.get('r0'), Object.assign(new LeafModel(root.skills[0]), { parentId: '0-top' }));
            assert.deepEqual(skills.get('d1'), Object.assign(new LeafModel(root.children[0].skills[0]), { parentId: '1-domain-A' }));
        });
    }
);

import { ClientErrorException } from '@hmh/nodejs-base-server';
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
        suite(
            'get',
            (): void => {
                test('success', async (): Promise<void> => {
                    // @ts-ignore: access to private constructor
                    const dao: DAO = new DAO();
                    // @ts-ignore: access to private method
                    const getNodesStub: SinonStub = stub(dao, 'getNodes');
                    const nodes: Map<string, SpineNode> = new Map();
                    //  const node: SpineNode = { id: 'snapshot@id', parentId: '0-top', childrenIds: ['2-cluster'] } as SpineNode;
                    const node: SpineNode = {} as SpineNode;
                    nodes.set('snapshot@id', node);
                    getNodesStub.withArgs('snapshot').returns(Promise.resolve(nodes));
                    assert.strictEqual(await dao.get('id', { spineTreeId: 'snapshot' }), node);
                    assert.strictEqual(await dao.get('snapshot@id'), node);

                    assert.isTrue(getNodesStub.calledTwice);
                    getNodesStub.restore();
                });
                test('failure', async (): Promise<void> => {
                    // @ts-ignore: access to private constructor
                    const dao: DAO = new DAO();
                    try {
                        await dao.get('id');
                        assert.fail('Unexpected success!');
                    } catch (error) {
                        assert.isTrue(error instanceof ClientErrorException);
                        assert.strictEqual(error.message, 'The parameter `spineTreeId` is required because the given identifier is not fully qualified!');
                    }
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
            getStub.withArgs('root', { snapshotId: 'snapshot', depth: 10, skillDetailLevel: 'high' }).returns(Promise.resolve(root));
            // @ts-ignore: access to private attribute
            const spreadRootStub: SinonStub = stub(dao, 'spreadRoot');
            const nodes: Map<string, SpineNode> = new Map();
            spreadRootStub.withArgs('snapshot', group).returns(nodes);
            // @ts-ignore: access to private attribute
            const dispatchSkillsStub: SinonStub = stub(dao, 'dispatchSkills');
            dispatchSkillsStub.withArgs(group).returns(nodes);
            // @ts-ignore: access to private method
            const loaded: Map<string, SpineNode> = await dao.getNodes('snapshot');
            assert.deepEqual(loaded, nodes);
            // @ts-ignore: access to private method
            assert.strictEqual(await dao.getNodes('snapshot'), loaded);

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
            const loaded: Map<string, SpineNode> = dao.spreadRoot('snapshot', root);

            assert.strictEqual(loaded.size, 5);
            assert.deepEqual(loaded.get('snapshot@0-top'), loaded.get('snapshot@root'));
            assert.deepEqual(loaded.get('snapshot@0-top'), Object.assign(new SpineNode('snapshot', root, 0), { childrenIds: ['snapshot@1-domain'] }));
            assert.deepEqual(
                loaded.get('snapshot@1-domain'),
                Object.assign(new SpineNode('snapshot', root.children[0], 1), { parentId: 'snapshot@0-top', childrenIds: ['snapshot@2-cluster'] })
            );
            assert.deepEqual(
                loaded.get('snapshot@2-cluster'),
                Object.assign(new SpineNode('snapshot', root.children[0].children[0], 2), {
                    childrenIds: ['snapshot@3-subcluster'],
                    parentId: 'snapshot@1-domain'
                })
            );
            assert.deepEqual(
                loaded.get('snapshot@3-subcluster'),
                Object.assign(new SpineNode('snapshot', root.children[0].children[0].children[0], 3), { parentId: 'snapshot@2-cluster' })
            );
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

            // @ts-ignore: access to private attribute
            dao.nodesOfASpine.set('snapshot', dao.spreadRoot('snapshot', root));
            // @ts-ignore: access to private method
            dao.dispatchSkills('snapshot', root);

            // @ts-ignore: access to private attributes
            const skills: Map<string, LeafModel> = dao.skillDao.skills;
            assert.strictEqual(skills.size, 2);
            assert.deepEqual(skills.get('snapshot@r0'), Object.assign(new LeafModel('snapshot', root.skills[0]), { parentId: 'snapshot@0-top' }));
            assert.deepEqual(
                skills.get('snapshot@d1'),
                Object.assign(new LeafModel('snapshot', root.children[0].skills[0]), { parentId: 'snapshot@1-domain-A' })
            );
        });
    }
);

import intern from 'intern';
import { Skill } from '../../../server/model/cc/Skill';
import { SkillGroup as Entity } from '../../../server/model/cc/SkillGroup';
import { TaxonomyPathElement } from '../../../server/model/cc/TaxonomyPathElement';

const { suite, test } = intern.getInterface('tdd');
const { assert } = intern.getPlugin('chai');

suite(
    __filename.substring(__filename.indexOf('/server-unit/') + '/server-unit/'.length),
    (): void => {
        test('static factory', (): void => {
            assert.deepEqual(Entity.getInstance(), new Entity());
        });

        test('constructor', (): void => {
            const bootstrap: Entity = {
                children: [
                    {
                        children: [],
                        discipline: '',
                        id: 'inner-id',
                        skills: [],
                        spineTitle: 'Math',
                        taxonomyPathElement: null,
                        transitiveSkillCount: 0
                    } as Entity
                ],
                discipline: 'discipline',
                id: 'id',
                skills: [
                    {
                        id: 'skillId'
                    } as Skill
                ],
                spineTitle: 'Math',
                taxonomyPathElement: {
                    denomination: 'domain',
                    title: 'title'
                } as TaxonomyPathElement,
                transitiveSkillCount: 0
            } as Entity;
            const entity: Entity = Object.assign(new Entity(), bootstrap);
            assert.strictEqual(entity.id, 'id');
            assert.strictEqual(entity.children.length, 1);
            assert.strictEqual(entity.children[0].id, 'inner-id');
        });
    }
);

import intern from 'intern';
import { ContainingGroup as Entity } from '../../../server/model/cc/ContainingGroup';
import { TaxonomyPathElement } from '../../../server/model/cc/TaxonomyPathElement';

const { suite, test } = intern.getInterface('tdd');
const { assert } = intern.getPlugin('chai');

suite(
    __filename.substring(__filename.indexOf('/server-unit/') + '/server-unit/'.length),
    (): void => {
        test('constructor', (): void => {
            const bootstrap: Entity = {
                groupId: 'id',
                taxonomyPathElement: {
                    denomination: 'domain',
                    title: 'title'
                } as TaxonomyPathElement
            } as Entity;
            const entity: Entity = Object.assign(new Entity(), bootstrap);
            assert.strictEqual(entity.groupId, 'id');
        });
    }
);

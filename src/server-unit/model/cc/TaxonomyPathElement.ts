import intern from 'intern';
import { TaxonomyPathElement as Entity } from '../../../server/model/cc/TaxonomyPathElement';

const { suite, test } = intern.getInterface('tdd');
const { assert } = intern.getPlugin('chai');

suite(
    __filename.substring(__filename.indexOf('/server-unit/') + '/server-unit/'.length),
    (): void => {
        test('constructor', (): void => {
            const bootstrap: Entity = {
                denomination: 'domain',
                title: 'title'
            } as Entity;
            const entity: Entity = Object.assign(new Entity(), bootstrap);
            assert.strictEqual(entity.denomination, 'domain');
        });
    }
);

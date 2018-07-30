import { readOnly } from '@hmh/nodejs-base-server';
import { TaxonomyPathElement } from './TaxonomyPathElement';

export class ContainingGroup {
    @readOnly() public groupId: string;
    @readOnly() public taxonomyPathElement: TaxonomyPathElement;
}

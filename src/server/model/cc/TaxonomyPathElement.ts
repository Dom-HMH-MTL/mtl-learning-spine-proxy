import { readOnly } from '@hmh/nodejs-base-server';

export class TaxonomyPathElement {
    @readOnly() public denomination?: string;
    @readOnly() public title: string;
}

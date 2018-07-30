import { BaseModel as Parent, readOnly } from '@hmh/nodejs-base-server';
import { Skill } from './Skill';
import { TaxonomyPathElement } from './TaxonomyPathElement';

export class SkillGroup extends Parent {
    // Factory method
    public static getInstance(): SkillGroup {
        return new SkillGroup();
    }

    @readOnly() public children: SkillGroup[];
    @readOnly() public directChildrenCount?: number;
    @readOnly() public directSkillCount?: number;
    @readOnly() public discipline: string;
    @readOnly() public skills?: Skill[];
    @readOnly() public spineTitle: string;
    @readOnly() public taxonomyPathElement: TaxonomyPathElement;
    @readOnly() public transitiveSkillCount: number;
}

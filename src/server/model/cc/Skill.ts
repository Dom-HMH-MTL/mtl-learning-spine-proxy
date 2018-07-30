import { BaseModel as Parent, readOnly } from '@hmh/nodejs-base-server';
import { ContainingGroup } from './ContainingGroup';
import { SkillReference } from './SkillReference';

export enum SkillDetailLevel {
    low,
    medium,
    high
}

export class Skill extends Parent {
    // Factory method
    public static getInstance(): Skill {
        return new Skill();
    }

    // Present if `skillDetailLevel` is `low`
    @readOnly() public description?: string;
    @readOnly() public title?: string;
    // Present if `skillDetailLevel` is `low` or `medium`
    @readOnly() public prerequisites: SkillReference[];
    @readOnly() public postrequisites: SkillReference[];
    // Present if `skillDetailLevel` is `low` or `medium` or 'high'
    @readOnly() public spineContext?: ContainingGroup[];
    @readOnly() public standards?: { [key: string]: string };
}

import { BaseModel as Parent, readOnly } from '@hmh/nodejs-base-server';
import { SkillGroup } from './SkillGroup';

export class SkillRootGroup extends Parent {
    // Factory method
    public static getInstance(): SkillRootGroup {
        return new SkillRootGroup();
    }

    @readOnly() public spineTitle: string;
    @readOnly() public discipline: string;
    @readOnly() public group: SkillGroup;
}

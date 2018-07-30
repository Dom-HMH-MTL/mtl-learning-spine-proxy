import { readOnly } from '@hmh/nodejs-base-server';

export class SkillReference {
    @readOnly() public skillId: string;
    @readOnly() public spineId?: string;
    @readOnly() public strength: number;
}

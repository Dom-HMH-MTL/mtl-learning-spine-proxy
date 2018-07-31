import { Skill } from '../model/cc-proxy/Skill';
import { SpineNode } from '../model/cc-proxy/SpineNode';
import { SpineTree } from '../model/cc-proxy/SpineTree';

export async function loadSpineTrees(): Promise<SpineTree[]> {
    return fetch('/api/v1/cc-proxy/SpineTree', { headers: { accept: 'application/json' }, method: 'GET' })
        .then((response: Response): any => response.json())
        .then(
            (items: any[]): SpineTree[] => {
                const spines: SpineTree[] = [];
                for (const item of items) {
                    spines.push(Object.assign(new SpineTree(), item));
                }
                return spines;
                //                    return Object.assign(new SpineTree(), item);
            }
        );
}

export async function loadSpineNode(id: string = 'root'): Promise<SpineNode> {
    return fetch('/api/v1/pou/SpineNode/' + id, { headers: { accept: 'application/json' }, method: 'GET' })
        .then((response: Response): any => response.json())
        .then(
            (item: any): SpineNode => {
                return Object.assign(new SpineNode(), item);
            }
        );
}

export async function loadSkill(id: string = 'root'): Promise<Skill> {
    return fetch('/api/v1/pou/Skill/' + id, { headers: { accept: 'application/json' }, method: 'GET' })
        .then((response: Response): any => response.json())
        .then(
            (item: any): Skill => {
                return Object.assign(new Skill(), item);
            }
        );
}

export async function displaySpineTrees(treeListId: string): Promise<void> {
    const spineTrees: SpineTree[] = await loadSpineTrees();

    const ul: HTMLElement = document.getElementById(treeListId);
    ul.className = 'spineTreeList';
    for (const tree of spineTrees) {
        const li: HTMLElement = document.createElement('li');
        li.appendChild(document.createTextNode(tree.name));
        li.appendChild(document.createTextNode(' (snapshot id:' + tree.snapshotId + ')'));
        ul.appendChild(li);
    }
}

export async function displaySpineTreeElements(elementListId: string, nodeId = 'root') {
    const spineNode: SpineNode = await loadSpineNode(nodeId);
    const ul: HTMLElement = document.getElementById(elementListId);
    const li: HTMLElement = document.createElement('li');
    li.appendChild(document.createTextNode(spineNode.name));
    ul.appendChild(li);

    for (const childId of spineNode.childrenIds) {
        const innerUl = document.createElement('ul');
        innerUl.id = 'node-' + childId;
        innerUl.className = 'spineNodeList';
        ul.appendChild(innerUl);
        await displaySpineTreeElements('node-' + childId, childId);
    }

    if (0 < spineNode.skillIds.length) {
        const innerUl = document.createElement('ul');
        innerUl.className = 'spineSkillList';
        ul.appendChild(innerUl);
        for (const skillId of spineNode.skillIds) {
            const skill = await loadSkill(skillId);
            const innerLi = document.createElement('li');
            innerLi.appendChild(document.createTextNode(skill.name));
            innerUl.appendChild(innerLi);
        }
    }
}

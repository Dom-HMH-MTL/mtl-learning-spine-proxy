// Valid in Typescript 2+, not supported in ES6
declare module '*.html' {
    const html: string;
    export default html;
}

declare module '*.json' {
    const json: { [key: string]: any };
    export default json;
}

declare module 'node-xlsx';

// For client unit tests
declare var suite: any;
declare var test: any;
declare var setup: any;
declare var teardown: any;
declare var fixture: any;
declare var assert: any;
declare var before: any;

interface Array<T> {
    totalCount: number;
}

interface IFileSystemAccess {
    existsSync(path: string): boolean;
    readFileSync(path: string): Buffer;
    readFileSync(path: string, format): string;
    writeFileSync(path: string, data: any, options?: any): void;
}

interface XmlParser {
    parseString(xml: string | Buffer, callback: (err: any, result: any) => void): void;
}

interface CustomEventInit {
    composed: boolean;
}

declare module '@polymer/polymer/polymer-element.js' {
    export class PolymerElement extends HTMLElement {
        constructor();
        $: { [key: string]: HTMLElement };
        connectedCallback(): void;
        disconnectedCallback(): void;
        ready(): void;
    }
    export const html: (strings: TemplateStringsArray, ...values: Array<any>) => HTMLTemplateElement;
}

interface AppRouteElement extends HTMLElement {
    set(ket: string, value: any): void;
}

interface AppRoute {
    path: string;
    prefix: string;
    __queryParams: { [key: string]: string };
}

interface AppDrawerElement extends HTMLElement {
    persistent: boolean;
    close(): void;
}

interface PaperSpinnerElement extends HTMLElement {
    active: boolean;
}

interface PaperDialogElement extends HTMLElement {
    open(): void;
    close(): void;
}

interface PaperInputElement extends HTMLElement {
    value: string;
}

interface PaperToastElement extends HTMLElement {
    text: string;
    duration: number;
    show(properties?: object | string): void;
    toggle(): void;
}

interface IronFormElement extends HTMLElement {
    submit(): void;
}
interface IronAjaxElement extends HTMLElement {
    url: string;
}

interface IronAjaxEvent extends Event {
    detail: any;
}

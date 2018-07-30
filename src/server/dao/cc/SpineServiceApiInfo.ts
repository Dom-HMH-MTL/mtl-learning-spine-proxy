export class SpineServiceApiInfo {
    public baseUrl: string = 'https://api.dev.br.internal/spine-index/api/v1/learningspine';
    public defaultSpineId: string;
    public serviceUrl?: string;
    public version?: string;

    public constructor(spineId: string) {
        this.defaultSpineId = spineId;
    }
}

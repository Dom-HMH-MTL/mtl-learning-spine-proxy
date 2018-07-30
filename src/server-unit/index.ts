import '../server/index';

const { suite } = intern.getInterface('tdd');

suite(
    __filename.substring(__filename.indexOf('/server-unit/') + '/server-unit/'.length),
    (): void => {
        // Nothing to do because the server is exporting definitions
    }
);

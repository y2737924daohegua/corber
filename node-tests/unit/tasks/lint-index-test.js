const td              = require('testdouble');
const Promise         = require('rsvp').Promise;
const contains        = td.matchers.contains;

const source          = 'www/index.html';

describe('Lint Index Task', () => {
  let fsUtils;
  let logger;
  let lintIndex;

  beforeEach(() => {
    fsUtils = td.replace('../../../lib/utils/fs-utils');
    logger  = td.replace('../../../lib/utils/logger');

    td.when(fsUtils.read(source)).thenReturn(Promise.resolve(''));

    lintIndex = require('../../../lib/tasks/lint-index');
  });

  afterEach(() => {
    td.reset();
  });

  it('logs a starting message to info', () => {
    return lintIndex(source).then(() => {
      td.verify(logger.info(contains(`Linting ${source}...`)));
    });
  });

  it('logs to success when there are no problems', () => {
    return lintIndex(source).then(() => {
      td.verify(logger.success(contains('0 problems')));
    });
  });

  it('logs a warning when is a href property with leading /', () => {
    td.when(fsUtils.read(source), { ignoreExtraArgs: true })
      .thenReturn(Promise.resolve('<a href="/foo">Foo</a>'));

    return lintIndex(source).then(() => {
      td.verify(logger.warn(contains('paths beginning with /')));
    });
  });

  it('logs a warning when is a src property with leading /', () => {
    td.when(fsUtils.read(source), { ignoreExtraArgs: true })
      .thenReturn(Promise.resolve('<script src="/foo"></script>'));

    return lintIndex(source).then(() => {
      td.verify(logger.warn(contains('paths beginning with /')));
    });
  });
});

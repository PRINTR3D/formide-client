var testUtils = require('./test_modules/test-utils'),    accessTokensMgr = testUtils.accessTokensManager,    modelFilesMgr = testUtils.modelFilesManager,    configMgr = testUtils.configManager;try {    accessTokensMgr.restorePreviousFile();    modelFilesMgr.restorePreviousFile();    configMgr.removeFile();    console.log('Post test script is now finished');} catch (e) {    console.error(e);}
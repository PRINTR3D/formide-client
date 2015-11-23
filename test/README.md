FormideOS Testing Project
================

Requirements
----------------
Install **Mocha** with `npm install -g mocha`

Dependencies
-----------------
 - chai
 - chai-http
 - lodash
 - node-uuid
 - touch

Getting Started
------------------
FormideOS-Client should be properly set up and stopped.
Setup `FOS_CLIENT` environment variable with the directory of FormideOS-Client.
*e.g.: /home/you/PRINT3D/formideOS/formideOS-client*
Execute `node pre-test.js` in the FormideOS test directory.
Launch FormideOS-Client.
Execute all tests with `mocha test` in the FormideOS test directory.
You can also use `mocha tests/test-<my-test-suite>.js`
When you finished, execute `node post-test.js` to clean up the test files.

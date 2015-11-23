var _ = require('lodash'),
    fs = require('fs'),
    path = require('path');

var fileContent =
'{"k":"{{ key }}","o":"0000000328","v":"{{ value }}"}\n\
{"_id":{{ id }},"_uid":{{ uid }},"_dt":1441883313313,"_s":"7890bc84a2cd04ae8750f1c51d61e33a"}\n\
{"createdAt":{"$wrap":"$date","v":1441883313312,"h":"{{ currentDate }}"},\
"updatedAt":{"$wrap":"$date","v":1441883313312,"h":"{{ currentDate }}"},\
"prettyname":"{{ filename }}","filename":"{{ filename }}","filesize":{{ filesize }},"hash":"{{ hash }}",\
"_id":{"$wrap":"$oid","v":2},"filetype":"stl","__v":0}\n';

var backupExtension = '.backup';


module.exports = function(storageDir, data) {

    var modelFilesDbPath = path.join(storageDir, 'database/modelfiles');
    var modelFilesPath = path.join(storageDir, 'modelfiles', data.modelfile.hash);

    return {

        backupCurrentFile: function backupCurrentFile() {
            fs.rename(modelFilesDbPath, modelFilesDbPath + backupExtension,
                function (err) {
                    if (err) throw err;
                }
            );
        },

        restorePreviousFile: function restorePreviousFile() {
            fs.unlinkSync(modelFilesDbPath);
            fs.rename(modelFilesDbPath + backupExtension, modelFilesDbPath,
                function (err) {
                    if (err) throw err;
                }
            );
        },

        createNewFile: function createNewFile() {
            // generate the output text with the template and the data
            _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
            var compiled = _.template(fileContent);

            var output = compiled({
                key: data.key,
                value: data.value,
                id: data.modelfile.id,
                uid: data.modelfile.uid,
                filename: data.modelfile.filename,
                filesize: data.modelfile.filesize,
                hash: data.modelfile.hash,
                currentDate: data.currentDate
            });

            // create new file
            fs.writeFile(modelFilesDbPath, output, 'utf8', function (err) {
                if (err) throw err;
            });
            fs.writeFile(modelFilesPath, 'Test STL', 'utf8', function (err) {
                if (err) throw err;
            });
        }

    };

};
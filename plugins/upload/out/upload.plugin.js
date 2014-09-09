var __hasProp = {}.hasOwnProperty;
var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };
var fs = require('fs');

module.exports = function(BasePlugin) {
    var UploadPlugin;
    return UploadPlugin = (function(_super) {

        var docpadConfig = docpad.getConfig();

        __extends(UploadPlugin, _super);

        function UploadPlugin() {
            return UploadPlugin.__super__.constructor.apply(this, arguments);
        }

        UploadPlugin.prototype.name = 'upload';

        UploadPlugin.prototype.config = (function(config) {
            config = config || {};
            return {
                path: config.path || 'upload'
            }
        })(docpadConfig.plugins.backbonecms);

        UploadPlugin.prototype.serverExtend = function(opts) {
            var me = this;

            var app = opts.serverExpress;

            var upload = require('./lib/jquery-file-upload-middleware');

            var tmpDir = __dirname + '/tmp';
            fs.exists(tmpDir, function(exists) {
                if (!exists) {
                    fs.mkdir(tmpDir, function() {});
                }
            });

            var files = '/files';
            var filesDir = __dirname + '/../../../src/files' + files;
            var formfiles = '/formfiles';
            var formfilesDir = __dirname + '/../../../src/files' + formfiles;

            fs.exists(filesDir, function(exists) {
                if (!exists) {
                    fs.mkdir(filesDir, function() {});
                }
            });

            fs.exists(formfilesDir, function(exists) {
                if (!exists) {
                    fs.mkdir(formfilesDir, function() {});
                }
            });

            // configuration
            app.use('/upload' + files, upload.fileHandler({
                tmpDir: tmpDir,
                uploadDir: filesDir,
                uploadUrl: files
            }));

            // configuration for client uploads
            app.use('/upload' + formfiles, upload.fileHandler({
                tmpDir: tmpDir,
                uploadDir: formfilesDir,
                uploadUrl: formfiles
            }));

        };

        return UploadPlugin;

    })(BasePlugin);
};

// Generated by CoffeeScript 1.6.3
var nodemailer,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

var fs = require('fs');
nodemailer = require('nodemailer');

module.exports = function(BasePlugin) {
  var ContactifyPlugin, _ref;
  return ContactifyPlugin = (function(_super) {
    var config, smtp;

    __extends(ContactifyPlugin, _super);

    function ContactifyPlugin() {
      _ref = ContactifyPlugin.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ContactifyPlugin.prototype.name = 'contactify';

    config = docpad.getConfig().plugins.contactify;

    smtp = nodemailer.createTransport('SMTP', config.transport);

    ContactifyPlugin.prototype.serverExtend = function(opts) {
      var server;
      server = opts.server;
      server.use(config.path, function(req, res, next) {
        if (req.method.toLowerCase() == 'post') {
            var enquiry, mailOptions, receivers;
            receivers = [];
            enquiry = req.body;
            receivers.push(enquiry.email, config.to);
            var mailBodyArray = [];
            mailBodyArray.push(enquiry['form-name']);
            var bodyKeyReg = new RegExp('^field-value-.*', 'gi');
            var bodySkipKeyReg = new RegExp('.*-include-other-option$', 'gi');
            var attaches = []
            for (var key in enquiry) {
                var typeKey = key;
                typeKey = typeKey.replace(/value/, 'type');
                if (key.match(bodyKeyReg) && !key.match(bodySkipKeyReg) && enquiry[typeKey] != 'file') {
                    var keyName = key.replace('field-value-', '');
                    var fieldVal = enquiry[key];
                    if (fieldVal == 'include-other-option') {
                        fieldVal = enquiry[key + '-include-other-option'];
                    }
                    if (typeof fieldVal == 'object') {
                        for (var i in fieldVal) {
                            if (fieldVal[i] == 'include-other-option') {
                                fieldVal[i] = enquiry[key + '-include-other-option'];
                            }
                        }
                    }
                    mailBodyArray.push(enquiry['field-name-' + keyName] + ': ' + fieldVal);
                } else if (typeKey != key && enquiry[typeKey] == 'file' && enquiry[key]) {
                    attaches.push({fileName: enquiry[key], filePath: __dirname + '/../../../src/files/formfiles/' + enquiry[key]});
                }
            }
            mailOptions = {
              to: enquiry['form-email'],
              from: config.from,
              subject: enquiry['form-name'],
              text: mailBodyArray.join('\n'),
              html: '<p>' + mailBodyArray.join('<br>') + '</p>'
            };
            if (attaches.length) {
              mailOptions.attachments = attaches;
            }
            smtp.sendMail(mailOptions, function(err, resp) {
                for (var i in attaches) {
                    fs.exists(attaches[i].filePath, function(exists) {
                        if (exists) {
                            fs.unlink(attaches[i].filePath, function(err) {
                                if (err) console.log(err);
                            });
                        }
                    });
                }
              if (err) {
                return console.log(err);
              } else {
                return console.log("Message sent: " + resp.message);
                  // TODO: implements removing of files after sending.
              }
            });
            return res.redirect(enquiry.redirect || config.redirect);
        } else {
            next();
            return;
        }
      });
      return this;
    };

    return ContactifyPlugin;

  })(BasePlugin);
};

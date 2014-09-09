var __hasProp = {}.hasOwnProperty;
var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = function(BasePlugin) {
    var BackbonecmsPlugin;
    return BackbonecmsPlugin = (function(_super) {

        var docpadConfig = docpad.getConfig();

        __extends(BackbonecmsPlugin, _super);

        function BackbonecmsPlugin() {
            return BackbonecmsPlugin.__super__.constructor.apply(this, arguments);
        }

        BackbonecmsPlugin.prototype.name = 'backbonecms';

        BackbonecmsPlugin.prototype.config = (function(config) {
            config = config || {};
            return {
                path: config.path || 'admin'
            }
        })(docpadConfig.plugins.backbonecms);

        BackbonecmsPlugin.prototype.serverExtend = function(opts) {
            var me = this;

            var server = opts.server;

            server.use(docpadConfig.plugins.restapi.channel, function(req, res, next){
                if (req.session.user) {
                    // update session cookie
                    req.session._garbage = Date();
                    req.session.touch();
                    next();
                }
                else {
                    res.status(401).send({status: 401, message: "Not authorized", redirect: '/' + me.config.path + "/login"});
                }
            });

            server.use('/' + me.config.path, function(req, res, next){
                if (req.session.user || req.path.indexOf('/assets/') == 0) {
                    express.static(__dirname + '/public')(req, res, next);
                }
                else
                    if (req.path == '/login')
                        next();
                    else
                        res.redirect(me.config.path + '/login');
            });

            function authenticate(name, pass, fn) {
                if (!module.parent)
                    console.log('authenticating %s:%s', name, pass);

                var filter = {
                    type: 'members',
                    name: name,
                    password: pass
                };
                var user = docpad.getDatabase().findOne(filter);

                if (user) {
                    var sessionUser = user.toJSON().meta;
                    delete sessionUser.password;
                    return fn(null, sessionUser);
                }
                return fn(new Error('invalid username or password'));
            }

            server.get('/' + me.config.path + '/logout', function(req, res) {
                req.session.destroy(function(){
                    res.redirect('/' + me.config.path);
                });
            });

            server.get('/' + me.config.path + '/login', function(req, res) {
                res.sendfile(__dirname + '/public/login.html');
            });

            server.get('/' + me.config.path + '/me', function(req, res) {
                res.json({ user: req.session.user });
            });

            server.post('/' + me.config.path + '/login', function(req, res){
                authenticate(req.body.username, req.body.password, function(err, user){
                    if (user) {
                        // Regenerate session when signing in
                        // to prevent fixation
                        req.session.regenerate(function(){
                            // Store the user's primary key
                            // in the session store to be retrieved,
                            // or in this case the entire user object
                            req.session.user = user;
                            res.send({status: "success", redirect: '/' + me.config.path});
                        });
                    } else {
                        req.session.error = 'Authentication failed, please check your username and password.'
                        res.send({status: "error", message: req.session.error});
                    }
                });
            });
        };

        docpadConfig.templateData.path == BackbonecmsPlugin.prototype.config.path;

        return BackbonecmsPlugin;

    })(BasePlugin);
};

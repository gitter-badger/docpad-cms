(function() {
    window.app = window.app || {};

    app.tmpls = {};
    app.securityToken = 'sej';
    app.slugify = function(str) {
        var res;
        if (str) {
            res = str.replace(/\W/ig, '-');
        }

        return res;
    };

    $.ajax({
        url: '/admin/me',
        success: function(data) {
            app.user = data.user;
        }
    });

    Backbone.View = Backbone.View.extend({
        _render: function(data, tmplPath) {
            var me = this;
            function render(path) {
                me.filesToDelete = [];
                me.$el.html(app.tmpls[path](data));
                if (!data.fnCalled && me.page && me.action && app.fns && app.fns[me.page + '_' + me.action]) {
                    app.fns[me.page + '_' + me.action]();
                }
                $.unblockUI();
            }
            function fetchTmpl(path) {
                if (app.tmpls[path]) {
                    render(path);

                    return;
                }

                $.get('/admin/tmpl/' + path, function(template) {
                    app.tmpls[path] = _.template(template);

                    render(path);
                });
            }

            data.page = me.page;
            data.action = me.action;
            data.path = me.path;

            if (data.collection) {
                for (var i in data.collection) {
                    data.collection[i].meta = data.collection[i].meta || {};
                }
            } else if (data.document) {
                data.document.meta = data.document.meta || {};
                data.document.meta.cms = data.document.meta.cms || {};
            }

            if (me.page && me.action && (!app.fns || !app.fns[me.page + '_' + me.action])) {
                setTimeout(function() {
                    try {
                        $('body').append(
                            $('<script>', {
                                type: 'text/javascript',
                                src: '/admin/js/tmpl/' + me.page + '/' + me.action + '.js'
                            })
                        );

                        data.fnCalled = true;
                    } catch (err) {
                        var fns = app.fns = app.fns || {};

                        fns[me.page + '_' + me.action] = function() {};
                    }
                }, 0);
            }

            if (me.template) {
                me.$el.html(me.template(data));

                return;
            }

            if (tmplPath) {
                fetchTmpl(tmplPath);

                return;
            }

            if (me.templatePath) {
                fetchTmpl(me.templatePath);

                return;
            }
        }
    });

    Backbone.sync = function(method, model, options) {
        var type = methodMap[method];

        // Default options, unless specified.
        _.defaults(options || (options = {}), {
            emulateHTTP: Backbone.emulateHTTP,
            emulateJSON: Backbone.emulateJSON
        });

        // Default JSON-request options.
        var params = {type: type, dataType: 'json'};

        // Ensure that we have a URL.
        if (!options.url) {
            params.url = _.result(model, 'url') || urlError();
        }

        // Ensure that we have the appropriate request data.
        if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
            params.contentType = 'application/json';
            params.data = JSON.stringify(options.attrs || model.toJSON(options));
        }

        // For older servers, emulate JSON by encoding the request into an HTML-form.
        if (options.emulateJSON) {
            params.contentType = 'application/x-www-form-urlencoded';
            params.data = params.data ? {model: params.data} : {};
        }

        // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
        // And an `X-HTTP-Method-Override` header.
        if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
            params.type = 'POST';
            if (options.emulateJSON) params.data._method = type;
            var beforeSend = options.beforeSend;
            options.beforeSend = function(xhr) {
                xhr.setRequestHeader('X-HTTP-Method-Override', type);
                if (beforeSend) return beforeSend.apply(this, arguments);
            };
        }

        // Don't process data on a non-GET request.
        if (params.type !== 'GET' && !options.emulateJSON) {
            params.processData = false;
        }

        // If we're sending a `PATCH` request, and we're in an old Internet Explorer
        // that still has ActiveX enabled by default, override jQuery to use that
        // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
        if (params.type === 'PATCH' && noXhrPatch) {
            params.xhr = function() {
                return new ActiveXObject("Microsoft.XMLHTTP");
            };
        }

        // Make the request, allowing the user to override any Ajax options.
        var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
        model.trigger('request', model, xhr, options);
        return xhr;
    };

    var methodMap = {
        'create': 'PUT',
        'update': 'POST',
        'patch':  'POST',
        'delete': 'DELETE',
        'read':   'GET'
    };

    var noXhrPatch = typeof window !== 'undefined' && !!window.ActiveXObject && !(window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent);

    $(document).ajaxError(function(e, xhr, options) {
        if (xhr.status == 401) {
            window.location.href = xhr.responseJSON.redirect;
        }
    });
})();

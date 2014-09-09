(function() {
    window.app = window.app || {};

    app.ContentView = Backbone.View.extend({
        el: '.page-content',

        events: {
            "click #edit-form-save-button": "saveDocument",
            "click #edit-form-delete-button": "deleteDocument",
            "click .file-upload-delete-btn": "deleteFileByUrlConfirm",
            'click #fileDeleteModal #buttonDelete': 'deleteFile'
        },

        setOpts: function (opts) {
            this.page = opts.page;
            this.action = opts.action;
            this.path = opts.path;
        },

        render: function() {
            $.blockUI();
            var me = this;
            me.$el.html('Wait please...');

            if (me.path) {
                var document = new app.Document();
                document.url = '/restapi/database/' + me.path;
                document.fetch({
                    data: {
                        securityToken: app.securityToken
                    },
                    reset: true,
                    success: function() {
                        me._render({document: document.toJSON()}, 'pages/' + me.page + '/' + me.action + '.html');
                    }});
            } else if (me.action == 'edit') {
                me._render({document: {}}, 'pages/' + me.page + '/' + me.action + '.html');
            } else {
                var collection = new app.Documents();
                collection.fetch({
                    data: {
                        securityToken: app.securityToken,
                        filter: JSON.stringify({
                            type: me.page
                        }),
                        limit: 100
                    },
                    reset: true,
                    success: function() {
                        me._render({collection: collection.toJSON()}, 'pages/' + me.page + '/' + me.action + '.html');
                    }});
            }

            return me;
        },
        saveDocument: function(evt) {
            evt.preventDefault();
            $.blockUI();
            var me = this;

            var document = new app.Document();
            function saveDoc() {
                var meta = document.get('meta') || {};
                meta.cms = meta.cms || {};
                $('.form-value').each(function() {
                    if ($(this).attr('type') == 'radio') {
                        var radioName = $(this).attr('name');
                        meta[$(this).attr('name')] = $('input[name="' + radioName + '"]:checked').val();
                    } else {
                        meta[$(this).attr('name')] = $(this).val();
                    }

                    if ($(this).attr('name') == 'date') {
                        meta['date'] = new Date($(this).val());
                    }
                });

                var preproces = app.fns[me.page + '_' + me.action + '_preproces'];
                if (preproces) {
                    for (var k in meta) {
                        if (preproces[k]) {
                            meta[k] = preproces[k](meta[k], meta);
                        }
                    }
                }

                var postproces = app.fns[me.page + '_' + me.action + '_postproces'];
                if (postproces) {
                    meta = postproces(meta);
                }

                var validationErrors;
                if (app.fns[me.page + '_' + me.action + '_validate']) {
                    validationErrors = app.fns[me.page + '_' + me.action + '_validate'](meta);
                }
                if (validationErrors && validationErrors.length) {
                    var $errMessages = $('.error-messages');
                    $errMessages.html('');
                    _.each(validationErrors, function(errMessage) {
                        $errMessages.append(
                            '<div class="alert alert-danger">' +
                                errMessage +
                            '</div>'
                        );
                    });
                    $.unblockUI();
                    return;
                }

                var isNew = !me.path;
                me.path = me.path || (meta.pagePath ? meta.pagePath : (me.page + '/')) + ((app.slugify(meta.name) || app.slugify(meta.title)) + '.html.eco');
                me.path = me.path.replace(/^\//, '');

                document.url = '/restapi/database/' + me.path + '?securityToken=' + app.securityToken;

                if (me.filesToDelete) {
                    _.each(me.filesToDelete, function(file) {
                        $.ajax( {
                            url: '/restapi/files' + file + '?securityToken=' + app.securityToken,
                            type: 'DELETE'
                        });
                    });
                }

                document.save({meta: meta}, {
                    success: function(document, resp) {
                        alert(resp.message);
                        if (!isNew) {
                            me.render();
                        } else {
                            app.router.navigate(me.page + '/' + me.action + '/path/' + me.path, {trigger: true, replace: true});
                        }
                    },
                    error: function() {
                        alert('Error');
                    }
                });
            }

            if (me.path) {
                document.url = '/restapi/database/' + me.path + '?securityToken=' + app.securityToken;
                document.fetch({
                    success: function() {
                        saveDoc();
                    }
                });
            } else {
                saveDoc();
            }
        },
        deleteDocument:function(evt) {
            evt.preventDefault();
            var me = this;

            var document = new app.Document();
            document.url = '/restapi/database/' + me.path + '?securityToken=' + app.securityToken;
            document.fetch({
                reset: true,
                success: function() {
                    document.destroy({
                        success: function(document, resp) {
                            alert(resp.message);
                            app.router.navigate(me.page, {trigger: true, replace: true});
                        }
                    });
                }});
        },
        deleteFileByUrlConfirm:function(evt) {
            evt.preventDefault();
            var me = this;

            var $target = $(evt.currentTarget);
            var fileUrl = $target.attr('data-delete-url');
            fileUrl = fileUrl.replace(/^http.*files/, '/files');

            me.fileToDelete = fileUrl;
            me.$fileTarget = $target.parent('div');

            var $fileDeleteModal = $('#fileDeleteModal');
            $fileDeleteModal.find('.file-name-to-delete').html(fileUrl);
            $fileDeleteModal.modal('show');
        },
        deleteFile:function(evt) {
            var me = this;

            if (!me.fileToDelete) return;

            me.filesToDelete = me.filesToDelete || [];
            me.filesToDelete.push(me.fileToDelete);

            me.$fileTarget.html('');
            var inputId = me.$fileTarget.attr('id');
            inputId = inputId.replace(/-placeholder$/, '-hidden');
            $('input#' + inputId).val('');
            $('#fileDeleteModal').modal('hide');
        }
    });

})();

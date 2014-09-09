(function() {
    window.app = window.app || {};

    app.FilesView = Backbone.View.extend({
        el: '.page-content',

        events: {
            'click .delete-file': 'deleteFileConfirm',
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

            var files = new app.Documents();
            files.url = '/restapi/files/files/';

            files.fetch({
                data: {
                    securityToken: app.securityToken,
                    limit: 5000
                },
                reset: true,
                success: function() {
                    me._render({collection: files.toJSON()}, 'pages/' + me.page + '/' + me.action + '.html');
                }
            });

            return me;
        },
        saveDocument: function(evt) {
            evt.preventDefault();
            var me = this;
        },
        deleteFileConfirm:function(evt) {
            evt.preventDefault();
            var me = this;

            var $target = $(evt.currentTarget);
            var file = $target.attr('href');
            file = file.replace(/#delete/, '');

            me.fileToDelete = file;

            var $fileDeleteModal = $('#fileDeleteModal');
            $fileDeleteModal.find('.file-name-to-delete').html(file);
            $fileDeleteModal.modal('show');
        },
        deleteFile:function(evt) {
            $.blockUI();
            var me = this;

            var file = me.fileToDelete;
            if (!file) return;

            $.ajax( {
                url: '/restapi/files' + file + '?securityToken=' + app.securityToken,
                type: 'DELETE',
                success: function() {
                    me.render();
                }
            });
        }
    });

})();

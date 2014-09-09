jQuery(document).ready(function() {
    App.init();

    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'setFilter',
            ':page': 'setFilter',
            ':page/': 'setFilter',
            ':page/:action': 'setFilter',
            ':page/:action/': 'setFilter',
            ':page/:action/path/*path': 'setFilter'
        },

        setFilter: function (page, action, path) {
            page = page || 'default';
            action = action || 'default';

            var appMenu = app.appMenu = app.appMenu || new app.AppMenu();
            appMenu.setOpts({page: page});
            appMenu.render();

            if (page == 'files') {
                var filesView = app.filesView = app.filesView || new app.FilesView();
                filesView.setOpts({page: page, action: action, path: path});
                filesView.render();
            } else if (page == 'members' && app.user.role != 'chiefadmin') {
                app.router.navigate('');
            } else {
                var contentView = app.contentView = app.contentView || new app.ContentView();
                contentView.setOpts({page: page, action: action, path: path});
                contentView.render();
            }
        }
    });
    app.router = new AppRouter();
    Backbone.history.start();

    tinyMCE.init({
        theme_advanced_default_background_color : "#FFF",
        theme_advanced_background_colors : "FF00FF,FFFF00,000000"

    });
});

(function() {
    window.app = window.app || {};

    app.AppMenu = Backbone.View.extend({
        el: '.navbar-collapse',
        templatePath: 'menu.html',

        events: {
        },

        setOpts: function (opts) {
            this.page = opts.page
        },

        render: function() {
            this._render({});
            return this;
        }
    });
})();

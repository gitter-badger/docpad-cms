(function() {
    window.app = window.app || {};

    app.Documents = Backbone.Collection.extend({
        model: app.Document,
        url: '/restapi/database/',
        parse: function(response) {
            var result = [];
            if (response.success == true) {
                result = response.data;
            } else {
                alert(response.message);
            }

            return result;
        }
    });
})();

(function() {
    window.app = window.app || {};

    app.Document = Backbone.Model.extend({
        parse: function(response) {
            var result = {};
            if (response.success == true) {
                result = response.data[0];
            } else if (response.meta) {
                result = response;
            } else {
                alert(response.message);
            }

            return result;
        }
    });
})();

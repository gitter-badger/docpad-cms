module.exports = function() {
    var filter = {
        type: 'params'
    };

    var result = docpad.getDatabase().findOne(filter); // Backbone.Model object will be returned if document exists
    if (result)
        result = result.toJSON();

    return result;
};

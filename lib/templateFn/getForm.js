module.exports = function(formName) {
    if (!formName) {
        return null;
    }

    var filter = {
        type: 'forms',
        name: formName,
        visibility: 'Visible',
        standalonePage: 'bottom'
    };

    return docpad.getDatabase().findOne(filter); // Backbone.Model object will be returned if document exists
};

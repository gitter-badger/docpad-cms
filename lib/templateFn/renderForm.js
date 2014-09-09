var getForm = require('./getForm');

module.exports = function(document) {
    var result = '';
    var formModel
    if (document.form) {
        formModel = getForm(document.form);
    }

    if (!formModel && document.type) {
        var filter = {
            type: 'forms',
            pageType: document.type,
            visibility: 'Visible',
            standalonePage: 'bottom'
        };
        formModel = docpad.getDatabase().findOne(filter)
    }

    if (formModel) {
        result = formModel.getOutContent() || '';
    }

    return result;
};

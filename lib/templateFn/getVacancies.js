module.exports = function() {
    var filter = {
        type: 'vacancies',
        visibility: 'Visible'
    };

    return docpad.getDatabase().findAll(filter);
};

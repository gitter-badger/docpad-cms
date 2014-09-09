(function() {
    "use strict";

    window.app = window.app || {};

    var fns = app.fns = app.fns || {};

    fns.vacancies_edit_preproces = {};

    fns.vacancies_edit_postproces = function(meta) {
        meta.type = 'vacancies';
        meta.name = meta.opening;
        meta.layout = 'vacancies';

        return meta;
    };

    fns.vacancies_edit_validate = function(meta) {
        var errMessages = [];

        if (!meta.opening) {
            errMessages.push('Field "Opening" is empty. It is required');
        }

        if (!meta.salary) {
            errMessages.push('Field "Salary" is empty. It is required');
        }

        if (!meta.department) {
            errMessages.push('Field "Department" is empty. It is required');
        }

        return errMessages;
    };

    fns.vacancies_edit = function() {
        // TinyMCE
        if ( !window.tinymce ) {
            setTimeout(initTinymce, 0);
        } else {
            initTinymce();
        }

        function initTinymce() {
            setTimeout(function() {
                initCmsTinyMce({
                    id: 'form-input-edit-description',
                    height: 500
                });
                initCmsTinyMce({
                    id: 'form-input-edit-contactDetails',
                    height: 200,
                    width: 530
                });
            },0);
        }
    };

    fns.vacancies_edit();

})();

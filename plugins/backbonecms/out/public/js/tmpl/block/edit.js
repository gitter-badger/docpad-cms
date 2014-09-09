(function() {
    "use strict";

    window.app = window.app || {};

    var fns = app.fns = app.fns || {};

    fns.block_edit_preproces = {};

    fns.block_edit_postproces = function(meta) {
        meta.type = 'block';
        meta.write = false;
        meta.render = false;

        return meta;
    };

    fns.block_edit_validate = function(meta) {
        var errMessages = [];

        if (!meta.name) {
            errMessages.push('Field "Name" is empty. It is required');
        }

        if (!meta.content) {
            errMessages.push('Field "Content" is empty. It is required');
        }

        return errMessages;
    };

    fns.block_edit = function() {
        // TinyMCE
        if ( !window.tinymce ) {
            setTimeout(initTinymce, 0);
        } else {
            initTinymce();
        }

        function initTinymce() {
            setTimeout(function() {
                initCmsTinyMce({
                    id: 'form-input-edit-content',
                    height: 500
                });
            },0);
        }
    };

    fns.block_edit();

})();

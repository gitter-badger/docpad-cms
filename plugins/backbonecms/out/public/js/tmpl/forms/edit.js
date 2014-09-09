(function() {
    "use strict";

    window.app = window.app || {};

    var fns = app.fns = app.fns || {};

    fns.forms_edit_preproces = {};

    fns.forms_edit_postproces = function(meta) {
        meta.type = 'forms';
        if (meta.standalonePage != 'standalone') {
            meta.write = false;
            meta.layout = 'form';
        } else {
            meta.write = true;
            meta.layout = 'formStandalone';
        }
        meta.cms.email = meta.email;
        meta.cms.formTitle = meta.formTitle;
        meta.cms.formDescription = meta.formDescription;
        meta.cms.formDescriptionAfter = meta.formDescriptionAfter;
        meta.cms.formSubtitle = meta.formSubtitle;
        meta.cms.formButton = meta.formButton;
        meta.cms.formJson = meta.formJson;

        return meta;
    };

    fns.forms_edit = function() {
        setTimeout(function() {
            var value = $.parseJSON($('[name="formJson"]').val());
            if (value && value.fields) {
                value = value.fields;
            } else {
                value = [{"label":"Example field","field_type":"text","required":true,"field_options":{},"cid":"c6"}];
            }

            window.fb = new Formbuilder('#form-input-edit-formJson-place', {
                bootstrapData: value
            });

            window.fb.on('save', function(payload){
                $('[name="formJson"]').val(payload);
            });

            // TinyMCE
            if ( !window.tinymce ) {
                setTimeout(initTinymce, 0);
            } else {
                initTinymce();
            }

            function initTinymce() {
                setTimeout(function() {
                    initCmsTinyMce({
                        id: 'form-input-edit-formDescription',
                        height: 200,
                        width: 970
                    });
                    initCmsTinyMce({
                        id: 'form-input-edit-formDescriptionAfter',
                        height: 200,
                        width: 970
                    });
                },0);
            }
        },0);
    };

    fns.forms_edit();

})();

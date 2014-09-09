(function() {
    "use strict";

    window.app = window.app || {};

    var fns = app.fns = app.fns || {};

    fns.files_default_preproces = {};

    fns.files_default_postproces = function(meta) {
        return meta;
    };

    fns.files_default = function() {
        // FileUpload
        if ( !$.fileupload ) {
            setTimeout(initFileUpload, 0);
        } else {
            initFileUpload();
        }

        function initFileUpload() {
            setTimeout(function() {
            var $fileTmp = $('#form-input-edit-image-tmp');
            $fileTmp.fileupload({
                method: 'POST',
                dataType:'json',
                url:'/upload/files',
                autoUpload: true,
                acceptFileTypes:/.*/i,
                maxNumberOfFiles: 1,
                dropZone: null,
                process:[
                    {
                        action:'load',
                        fileTypes:/^.*$/,
                        maxFileSize: 20000000 // 20MB
                    }
                ],
                progressall:function (e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    $('#cover_progress .bar').css('width', progress + '%');
                }
                ,
                start: function() {
                    $.blockUI();
                }
                ,
                done: function(e, data) {
                    setTimeout(function() {
                        app.filesView.render();
                    }, 3000);
                }
            });
            },0);
        }
    };

    fns.files_default();

})();

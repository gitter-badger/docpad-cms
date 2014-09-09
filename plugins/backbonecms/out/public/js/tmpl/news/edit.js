(function() {
    "use strict";

    window.app = window.app || {};

    var fns = app.fns = app.fns || {};

    fns.news_edit_preproces = {};

    fns.news_edit_postproces = function(meta) {
        meta.type = 'news';
        meta.layout = 'page';

        meta.cms = meta.cms || {};

        if (meta.image) {
            meta.cms.image = {
                standard: {
                    url: meta.image
                }
            };
        } else {
            meta.cms.image = null;
        }

        return meta;
    };

    fns.news_edit_validate = function(meta) {
        var errMessages = [];

        if (!meta.title) {
            errMessages.push('Field "Title" is empty. It is required');
        }

        if (!meta.content) {
            errMessages.push('Field "Content" is empty. It is required');
        }

        return errMessages;
    };

    fns.news_edit = function() {
        // TinyMCE
        if ( !window.tinymce ) {
            setTimeout(initTinymce, 0);
        } else {
            initTinymce();
        }

        function initTinymce() {
            setTimeout( function() {
                initCmsTinyMce({
                    id: 'form-input-edit-content',
                    height: 500
                });
            }, 0);
        }


        // FileUpload
        if ( !$.fileupload ) {
            setTimeout(initFileUpload, 0);
        } else {
            initFileUpload();
        }

        function initFileUpload() {
            setTimeout(function() {
            var $fileTmp = $('#form-input-edit-image');
            $fileTmp.fileupload({
                method: 'POST',
                dataType:'json',
                url:'/upload/files',
                autoUpload: true,
                acceptFileTypes:/(\.|\/)(gif|jpe?g|png)$/i,
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
                    var files = data.result.files;
                    files = files.reverse();
                    var file = files[0];

                    $('#form-input-edit-image-hidden').val(file.url);

                    var $placeholder = $('#form-input-edit-image-placeholder');
                    $placeholder.html($('<a>',
                        {
                            href: file.url,
                            text: file.url
                        }
                    ));

                    $placeholder.append($('<button>', {
                        type: "button",
                        class: "btn red btn-xs file-upload-delete-btn",
                        text: "delete",
                        "data-delete-url": file.url
                    }));

                    var i = 50;
                    function checkUploadedFile(url) {
                        i--;
                        setTimeout(function() {
                            $.ajax({
                                url: url,
                                success: function() {
                                    $placeholder.append($('<br>'));
                                    $placeholder.append($('<img>',
                                        {
                                            src: file.url,
                                            width: 250
                                        }
                                    ));
                                    $.unblockUI();
                                },
                                error: function() {
                                    if (i) {
                                        checkUploadedFile(url);
                                    } else {
                                        $.unblockUI();
                                    }
                                }
                            });
                        }, 250);
                    }
                    checkUploadedFile(file.url);
                }
            });
            },0);
        }

        setTimeout(function() {
        var fileUrl = $('#form-input-edit-image-hidden').val();
        if (fileUrl) {

            var $placeholder = $('#form-input-edit-image-placeholder');
            $placeholder.html($('<a>',
                {
                    href: fileUrl,
                    text: fileUrl
                }
            ));

            $placeholder.append($('<button>', {
                type: "button",
                class: "btn red btn-xs file-upload-delete-btn",
                text: "delete",
                "data-delete-url": fileUrl
            }));

            $placeholder.append($('<br>'));
            $placeholder.append($('<img>',
                {
                    src: fileUrl,
                    width: 250
                }
            ));
        }
        },0);

        setTimeout( function() {
            $('[name="date"]').datepicker({dateFormat: "yy-M-dd"});
        }, 0);

    };

    fns.news_edit();

})();

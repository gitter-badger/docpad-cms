(function() {
    "use strict";

    window.app = window.app || {};

    var fns = app.fns = app.fns || {};

    fns.parameters_edit_preproces = {};

    fns.parameters_edit_postproces = function(meta) {
        meta.type = 'params';
        meta.write = false;
        meta.render = false;

        meta.cms = meta.cms || {};

        if (meta.pageImage) {
            meta.cms.pageImage = {
                standard: {
                    url: meta.pageImage
                }
            };
        } else {
            meta.cms.pageImage = null;
        }

        if (meta.newsImage) {
            meta.cms.newsImage = {
                standard: {
                    url: meta.newsImage
                }
            };
        } else {
            meta.cms.newsImage = null;
        }

        return meta;
    };

    fns.parameters_edit = function() {
        // FileUpload
        if ( !$.fileupload ) {
            setTimeout(initFileUpload, 0);
        } else {
            initFileUpload();
        }

        function initFileUpload() {
            setTimeout(function() {
            var $fileTmp = $('#form-input-edit-pageImage');
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
                    $('#cover_progress_pageImage .bar').css('width', progress + '%');
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

                    $('#form-input-edit-pageImage-hidden').val(file.url);

                    var $placeholder = $('#form-input-edit-pageImage-placeholder');
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
                                        $.blockUI();
                                    }
                                }
                            });
                        }, 250);
                    }
                    checkUploadedFile(file.url);
                }
            });


            $fileTmp = $('#form-input-edit-newsImage');
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
                    $('#cover_progress_newsImage .bar').css('width', progress + '%');
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

                    $('#form-input-edit-newsImage-hidden').val(file.url);

                    var $placeholder = $('#form-input-edit-newsImage-placeholder');
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
            var fileUrl = $('#form-input-edit-pageImage-hidden').val();
            if (fileUrl) {

                var $placeholder = $('#form-input-edit-pageImage-placeholder');
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

            fileUrl = $('#form-input-edit-newsImage-hidden').val();
            if (fileUrl) {

                var $placeholder = $('#form-input-edit-newsImage-placeholder');
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
        }, 0);
    };

    fns.parameters_edit();

})();

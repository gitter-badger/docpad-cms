function initCmsTinyMce(options) {
    var initOptions = {
        selector:'#' + options.id,
        content_css: "/css/reset.css,/css/typography.css,/css/forms.css,/css/layout.css",
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste",
            "docpadfiles"
        ],
        toolbar: "insertfile undo redo | styleselect fontselect fontsizeselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | docpadimages docpadfiles docpadpages docpadnews | code",
        menubar : false,
        setup : function(ed) {
            ed.on('change', function(ed, l) {
                $( '#' + options.id ).val( tinymce.get( options.id ).getContent() );
            });
        }
    };

    if (options.height) {
        initOptions.height = options.height;
    }

    if (options.width) {
        initOptions.width = options.width;
    }

    tinymce.init(initOptions);
}

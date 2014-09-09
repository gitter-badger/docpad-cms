tinymce.PluginManager.add('docpadfiles', function(editor, url) {

    var fileList = [{text: '', value: ''}];
    var imageList = [{text: '', value: ''}];
    var pageList = [
        {text: '', value: ''},
        {text: 'Home', value: '/'},
        {text: 'News', value: '/news'},
        {text: 'Vacancies', value: 'vacancies'},
        {text: 'Application Form', value: '/application-form'}
    ];
    var newsList = [{text: '', value: ''}];

    var files = new app.Documents();
    files.url = '/restapi/files/files/';

    var imgRegexp = new RegExp('\.(gif|jpe?g|png)$');
    files.fetch({
        data: {
            securityToken: app.securityToken,
            limit: 5000
        },
        reset: true,
        success: function() {
            files.each(function(file) {
                var fileUrl = file.get('url');
                fileList.push({text: fileUrl, value: fileUrl});

                if (imgRegexp.test(fileUrl)) {
                    imageList.push({text: fileUrl, value: fileUrl});
                }
            });
        }
    });


    var pageCollection = new app.Documents();
    pageCollection.fetch({
        data: {
            securityToken: app.securityToken,
            filter: JSON.stringify({
                type: 'page',
                visibility: 'Visible'
            }),
            limit: 500
        },
        reset: true,
        success: function() {
            pageCollection.each(function(file) {
                pageList.push({text: file.get('meta').title, value: file.get('url')});
            });
        }});

    var newsCollection = new app.Documents();
    newsCollection.fetch({
        data: {
            securityToken: app.securityToken,
            filter: JSON.stringify({
                type: 'news',
                visibility: 'Visible'
            }),
            limit: 500
        },
        reset: true,
        success: function() {
            newsCollection.each(function(file) {
                newsList.push({text: file.get('meta').title, value: file.get('url')});
            });
        }});



    // Add a button that opens a window
    editor.addButton('docpadfiles', {
        text: 'Insert link on file',
        icon: false,
        onclick: function() {
            // Open window
            editor.windowManager.open({
                title: 'Insert file',
                width: 400,
                height: 150,
                body: [
                    {
                        type: 'textbox',
                        name: 'linkTitle',
                        label: 'Title'
                    },
                    {
                        type: 'container',
                        html: 'Chose file from list to insert link on it in text.'
                    },
                    {
                        name: 'fileLink',
                        type: 'listbox',
                        label: 'List of files',
                        values: fileList
                    }
                ],
                onsubmit: function(e) {
                    // Insert content when the window form is submitted
                    var fileLink = e.data.fileLink != 'false' ? e.data.fileLink : '';
                    editor.insertContent('<a href="' + e.data.fileLink + '">' + (e.data.linkTitle ? e.data.linkTitle : e.data.fileLink) + '</a>');
                }
            });
        }
    });

    // Add a button that opens a window
    editor.addButton('docpadimages', {
        text: 'Insert image',
        icon: false,
        onclick: function() {
            // Open window
            editor.windowManager.open({
                title: 'Insert image',
                width: 400,
                height: 200,
                body: [
                    {
                        type: 'textbox',
                        name: 'imgHeight',
                        label: 'Height'
                    },
                    {
                        type: 'textbox',
                        name: 'imgWidth',
                        label: 'Width'
                    },
                    {
                        type: 'container',
                        html: 'Chose image from list to insert it in text.'
                    },
                    {
                        name: 'fileLink',
                        type: 'listbox',
                        label: 'List of images',
                        values: imageList
                    }
                ],
                onsubmit: function(e) {
                    // Insert content when the window form is submitted
                    var fileLink = e.data.fileLink != 'false' ? e.data.fileLink : '';
                    var width = e.data.imgWidth ? ('width="' + e.data.imgWidth + '"') : '';
                    var height = e.data.imgHeight ? ('height="' + e.data.imgHeight + '"') : '';
                    editor.insertContent('<img src="' + e.data.fileLink + '" ' + width + ' ' + height + '>');
                }
            });
        }
    });

    // Add a button that opens a window
    editor.addButton('docpadpages', {
        text: 'Insert link on page',
        icon: false,
        onclick: function() {
            // Open window
            editor.windowManager.open({
                title: 'Insert link on page',
                width: 400,
                height: 200,
                body: [
                    {
                        type: 'textbox',
                        name: 'linkTitle',
                        label: 'Title'
                    },
                    {
                        type: 'container',
                        html: 'Chose page from list to insert link on it in text.'
                    },
                    {
                        name: 'fileLink',
                        type: 'listbox',
                        label: 'List of pages',
                        values: pageList
                    }
                ],
                onsubmit: function(e) {
                    // Insert content when the window form is submitted
                    var fileLink = e.data.fileLink != 'false' ? e.data.fileLink : '';
                    if (!e.data.linkTitle) {
                        for (var i in pageList) {
                            if (pageList[i].value = e.data.fileLink) {
                                e.data.linkTitle = page.text;
                            }
                        }
                    }
                    editor.insertContent('<a href="' + e.data.fileLink + '">' + (e.data.linkTitle ? e.data.linkTitle : e.data.fileLink) + '</a>');
                }
            });
        }
    });

    // Add a button that opens a window
    editor.addButton('docpadnews', {
        text: 'Insert link on news',
        icon: false,
        onclick: function() {
            // Open window
            editor.windowManager.open({
                title: 'Insert link on news',
                width: 400,
                height: 200,
                body: [{
                        type: 'textbox',
                        name: 'linkTitle',
                        label: 'Title'
                    },
                    {
                        type: 'container',
                        html: 'Chose news from list to insert link on it in text.'
                    },
                    {
                        name: 'fileLink',
                        type: 'listbox',
                        label: 'List of news',
                        values: newsList
                    }
                ],
                onsubmit: function(e) {
                    // Insert content when the window form is submitted
                    var fileLink = e.data.fileLink != 'false' ? e.data.fileLink : '';
                    if (!e.data.linkTitle) {
                        var page = newsCollection.findWhere({url: e.data.fileLink});
                        if (page) {
                            e.data.linkTitle = page.get('meta').title;
                        }
                    }
                    editor.insertContent('<a href="' + e.data.fileLink + '">' + (e.data.linkTitle ? e.data.linkTitle : e.data.fileLink) + '</a>');
                }
            });
        }
    });

});

var getParams = require('./getParams');

module.exports = function(document) {
    if (document.cms && document.cms.image) {
        return document.cms.image.standard.url;
    }

    var params = getParams();

    var defUrl = "/images/default_sub1.jpg";
    if (!params) {
        return defUrl;
    }

    if (params.cms[document.type + 'Image']) {
        return params.cms[document.type + 'Image'].standard.url;
    }
    if (document.type == "newsPage" && params.cms['newsImage']) {
        return params.cms['newsImage'].standard.url;
    }
    if (document.type != "newsPage" && document.type != "news" && params.cms['pageImage']) {
        return params.cms['pageImage'].standard.url;
    }

    return defUrl;
};

(function() {
    "use strict";

    window.app = window.app || {};

    var fns = app.fns = app.fns || {};

    fns.members_edit_preproces = {
        href: function(val, me) {
            var result = val;

            if (me.page != '_') {
                result = me.page;
            }

            return result;
        }
    };

    var confirmpassword;

    fns.members_edit_postproces = function(meta) {
        meta.type = 'members';
        meta.write = false;
        meta.render = false;

        confirmpassword = meta.confirmpassword;
        delete meta.confirmpassword;

        return meta;
    };

    fns.members_edit_validate = function(meta) {
        var errMessages = [];

        if (!meta.name || _.isEmpty(meta.name))
            errMessages.push('Field "Name" is empty. It is required');

        if (!_.isEmpty(meta.password) && meta.password !== confirmpassword)
            errMessages.push('"Password" and "Confirm Password" do not match.');

        return errMessages;
    };

    fns.members_edit = function() {
        var pageCollection = new app.Documents();
        pageCollection.fetch({
            data: {
                securityToken: app.securityToken,
                filter: JSON.stringify({
                    type: 'members'
                }),
                limit: 100
            },
            reset: true,
            success: function() {
            }});

        var membersCollection = new app.Documents();
        membersCollection.fetch({
            data: {
                securityToken: app.securityToken,
                filter: JSON.stringify({
                    type: 'members'
                }),
                limit: 100
            },
            reset: true,
            success: function() {
                setTimeout(function() {
/*
                    var selected = $select.attr('data-selected');
                    $select.find('option[value="' + selected + '"]').prop('selected', true);
*/
                }, 7);
            }});
    };

    fns.members_edit();

})();

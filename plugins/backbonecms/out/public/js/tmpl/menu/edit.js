(function() {
    window.app = window.app || {};

    var fns = app.fns = app.fns || {};

    fns.menu_edit_preproces = {
        href: function(val, me) {
            var result = val;

            if (me.page != '_') {
                result = me.page;
            }

            return result;
        }
    };

    fns.menu_edit_postproces = function(meta) {
        meta.type = 'menu';
        meta.write = false;
        meta.render = false;

        return meta;
    };

    fns.menu_edit = function() {
        var pageCollection = new app.Documents();
        pageCollection.fetch({
            data: {
                securityToken: app.securityToken,
                filter: JSON.stringify({
                    type: 'page'
                }),
                limit: 100
            },
            reset: true,
            success: function() {
                setTimeout(function() {
                    var $select = $('select[name=page]');
                    $select.append(
                        $('<option>', {
                            name: 'page',
                            value: '_',
                            text: ''
                        })
                    );
                    pageCollection.forEach(function(document) {
                        $select.append(
                            $('<option>', {
                                name: 'page',
                                value: document.get('url'),
                                text: document.get('meta').title
                            })
                        );
                    });
                    var selected = $select.attr('data-selected');
                    $select.find('option[value="' + selected + '"]').prop('selected', true);

                    $select.append(
                        $('<option>', {
                            name: 'page',
                            value: '_',
                            text: '* * *',
                            disabled: 'disabled'
                        })
                    );

                    $select.append(
                        $('<option>', {
                            name: 'page',
                            value: '/news',
                            text: 'News'
                        })
                    );
                    $select.append(
                        $('<option>', {
                            name: 'page',
                            value: '/application-form',
                            text: 'Application Form'
                        })
                    );
                    $select.append(
                        $('<option>', {
                            name: 'page',
                            value: '/vacancies',
                            text: 'Vacancies'
                        })
                    );

                    $select.append(
                        $('<option>', {
                            name: 'page',
                            value: '_',
                            text: '* * *',
                            disabled: 'disabled'
                        })
                    );

                    loadFormList();
                }, 7);
            }});

        function loadFormList() {
            var formCollection = new app.Documents();
            formCollection.fetch({
                data: {
                    securityToken: app.securityToken,
                    filter: JSON.stringify({
                        type: 'forms',
                        visibility: 'Visible',
                        standalonePage: 'standalone'
                    }),
                    limit: 100
                },
                reset: true,
                success: function() {
                    setTimeout(function() {
                        var $select = $('select[name=page]');
                        formCollection.forEach(function(document) {
                            $select.append(
                                $('<option>', {
                                    name: 'page',
                                    value: document.get('url'),
                                    text: document.get('meta').name
                                })
                            );
                        });
                        var selected = $select.attr('data-selected');
                        $select.find('option[value="' + selected + '"]').prop('selected', true);
                    }, 7);
                }});
        }

        var menuCollection = new app.Documents();
        menuCollection.fetch({
            data: {
                securityToken: app.securityToken,
                filter: JSON.stringify({
                    type: 'menu'
                }),
                limit: 100
            },
            reset: true,
            success: function() {
                setTimeout(function() {
                    var $select = $('select[name=parent]');
                    $select.append(
                        $('<option>', {
                            name: 'parent',
                            value: 'Top menu',
                            text: 'Top menu',
                            selected: 'selected'
                        })
                    );
                    menuCollection.forEach(function(document) {
                        $select.append(
                            $('<option>', {
                                name: 'parent',
                                value: document.get('meta').title,
                                text: document.get('meta').title
                            })
                        );
                    });
                    var selected = $select.attr('data-selected');
                    $select.find('option[value="' + selected + '"]').prop('selected', true);
                }, 7);
            }});
    };

    fns.menu_edit();

})();

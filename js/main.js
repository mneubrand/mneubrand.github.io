/**
 * Created by markus.neubrand on 4/29/14.
 */

$(function () {

    var firstPage = 'projects-grid';
    var pages = {
        "projects-grid": {
            title: 'projects-grid',
            data: 'projects',
            template: 'projects-grid'
        }
    };

    var templates = {};
    var data = {};

    function load(page) {
        console.log('Loading ' + page.title);

        if (!templates.hasOwnProperty(page.template) || !data.hasOwnProperty(page.data)) {
            console.log('Cache miss for ' + page.title);
            $.when(
                $.get('templates/' + page.template + '.mst', function (template) {
                    templates[page.template] = template;
                }),
                $.getJSON('data/' + page.data + '.json', function (json) {
                    data[page.data] = json;
                })
            ).done(function () {
                render(page);
            }).fail(function() {
                console.log('Load failed!');
            });
        } else {
            render(page);
        }
    }

    function render(page) {
        console.log('Rendering ' + page.title);
        $('#main').html(Mustache.render(templates[page.template], data[page.data]));
    }

    function hashChange() {
        if(!window.location.hash) {
            load(pages[firstPage]);
        } else {
            var newPage = window.location.hash.substr(1);
            if(newPage in pages) {
                load(pages[newPage]);
            } else {
                console.log('No page found for ' + newPage);
            }
        }
    }

    window.onhashchange = hashChange;
    hashChange();
});
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
        },
        "projects-list": {
            title: 'projects-list',
            data: 'projects',
            template: 'projects-list'
        }
    };

    var templates = {};
    var data = {};

    function load(page) {
        console.log('Loading ' + page.title);

            var promises = [];
            if(!templates.hasOwnProperty(page.template)) {
                promises.push($.get('templates/' + page.template + '.mst', function (template) {
                    templates[page.template] = template;
                }));
            }
            if(!data.hasOwnProperty(page.data)) {
                promises.push($.getJSON('data/' + page.data + '.json', function (json) {
                    data[page.data] = json;
                }));
            }
            $.when.apply(
                $, promises
            ).done(function () {
                render(page);
            }).fail(function() {
                console.log('Load failed!');
            });
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
/**
 * Created by markus.neubrand on 4/29/14.
 */

$(function () {

    var templates = {};
    var data = {};

    function load(page) {
        console.log('Loading ' + page);
        if (!templates.hasOwnProperty(page) || !data.hasOwnProperty(page)) {
            console.log('Cache miss for ' + page);
            $.when(
                $.get('templates/' + page + '.mst', function (template) {
                    templates[page] = template;
                }),
                $.getJSON('data/' + page + '.json', function (json) {
                    data[page] = json;
                })
            ).done(function () {
                render(page);
            }).fail(function() {
                console.log('Load failed!');
            });;
        } else {
            render(page);
        }
    }

    function render(page) {
        console.log('Rendering ' + page);
        $('#main').html(Mustache.render(templates[page], data[page]));
    }

    load('projects');
});
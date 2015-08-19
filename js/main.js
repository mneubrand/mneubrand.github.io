(function() {
    var elements = document.querySelectorAll('.preview');
    Array.prototype.forEach.call(elements, function(el, i){
        el.addEventListener('mousemove', function(e) {
            var previewWidth = el.offsetWidth;
            var previewHeight = el.offsetHeight;
            var offset = el.getBoundingClientRect();
            var relX = (e.pageX - offset.left) / previewWidth;
            var relY = (e.pageY - offset.top) / previewHeight;

            var child = el.firstElementChild;
            child.style.left = (-relX * (child.offsetWidth - previewWidth)) + 'px';
            child.style.top = (-relY * (child.offsetHeight - previewHeight)) + 'px';
        });
    });

    if (document.body.clientWidth >= 768) {
        var elements = document.querySelectorAll('img');
        Array.prototype.forEach.call(elements, function (el, i) {
            console.log('adding click');
            el.addEventListener('click', function(e) {
                $('.modal-title').text(el.getAttribute('alt'));
                $('.modal-body').html('<img src="' + el.getAttribute('src') + '" alt="' + el.getAttribute('alt') + '"/>');
                $('.modal').modal();
            });
        });
    }
})();
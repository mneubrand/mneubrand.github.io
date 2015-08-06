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
        var elements = document.querySelectorAll('.preview > img');
        Array.prototype.forEach.call(elements, function (el, i) {
            el.addEventListener('click', function(e) {
                modal.openModal(el.src, el.alt);
            });
        });
    }
})();
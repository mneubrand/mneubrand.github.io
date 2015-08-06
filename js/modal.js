var modal = (function() {
    var backdrop;
    var modal = document.querySelector('.modal');
    var modalTitle = document.querySelector('.modal-title');
    var modalContent = document.querySelector('.modal-body');

    document.querySelector('.modal .close').addEventListener('click', dismissModal);

    function openModal(src, title) {
        modal.style.display = 'block';
        modal.classList.add('fade');

        modalTitle.textContent = title;
        modalContent.innerHTML = '<img src="' + src + '" alt="' + title + '" />'

        modal.offsetWidth // force reflow
        modal.classList.add('in');

        backdrop = document.createElement('div');
        backdrop.classList.add('modal-backdrop');
        backdrop.classList.add('fade');

        document.body.appendChild(backdrop);

        backdrop.offsetWidth // force reflow
        backdrop.classList.add('in');

        modal.addEventListener('click', dismissModal);
    }

    function dismissModal() {
        backdrop.classList.remove('in');
        modal.classList.remove('in');
        var listener = function() {
            modal.style.display = 'none';
            backdrop.parentNode.removeChild(backdrop);
            modal.removeEventListener('transitionend', listener, false);
        };
        modal.addEventListener('transitionend', listener, false);
    }

    return {
        openModal: openModal,
        dismissModal: dismissModal
    }
})();

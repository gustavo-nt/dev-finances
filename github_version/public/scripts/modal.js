Modal = {
    open(title, status) {
        document.querySelector('.modal h2').innerHTML = title;
        document.querySelector('.modal #form').dataset.editable = status;
        document.querySelector('.modal-overlay').classList.add('active');
    },

    close() {
        document.querySelector('.modal-overlay').classList.remove('active');

        if (document.querySelector('.modal #form').dataset.editable == 'true') {
            document.querySelector('input[name="description"]').value = "";
            document.querySelector('input[name="amount"]').value = "";
            document.querySelector('input[name="date"]').value = "";
            document.querySelector('input[name="transactionId"]').value = "";
        } 
    }
}
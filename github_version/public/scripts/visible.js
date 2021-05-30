const visiblePrice = document.querySelector('.visible');
const prices = document.querySelectorAll('.card p');

visiblePrice.addEventListener('click', function(event) {
    if (visiblePrice.getAttribute('id') == 'visible') {
        visiblePrice.setAttribute('id', 'invisible'); 

        prices.forEach(item => {
            item.style.filter = "blur(5px)";
        });
        visiblePrice.setAttribute('src', 'public/assets/eye-hidden.png');
    } else {
        visiblePrice.setAttribute('id', 'visible'); 

        prices.forEach(item => {
            item.style.filter = "blur(0)";
        });
        visiblePrice.setAttribute('src', 'public/assets/eye-visible.png');
    }
});
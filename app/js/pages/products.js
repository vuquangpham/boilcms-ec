import '../vendors/isotope';

document.querySelectorAll('body.products').forEach(wrapper => {

    let category = '*';

    // keep same height
    const keepSameHeight = (elements) => {
        const maxHeight = Array.from(elements).reduce((acc, cur) => {
            const box = cur.getBoundingClientRect();
            if(box.height > acc) return box.height;
            return acc;
        }, 0);

        elements.forEach(e => e.style.height = maxHeight + 'px');
    };
    keepSameHeight(wrapper.querySelectorAll('.product-item'));

    // init isotope filter
    const isotope = new Isotope(wrapper.querySelector('.product-list'), {
        itemSelector: 'a.product-item',
        layoutMode: 'fitRows'
    });
    const filterFns = {
        filterByCategory: function(itemElem){
            if(category === 'all') return true;
            return itemElem.getAttribute('data-product-category') === category;
        }
    };

    // categories click
    const categoryWrapper = wrapper.querySelector('.category');
    categoryWrapper.addEventListener('click', (e) => {
        const target = e.target.closest('.category__item');
        if(!target) return;

        // current active
        if(target.classList.contains('active')) return;

        // get current active
        const activeItem = categoryWrapper.querySelector('.category__item.active');
        activeItem.classList.remove('active');

        // change active class
        target.classList.add('active');

        category = target.getAttribute('data-category');

        isotope.arrange({
            filter: filterFns.filterByCategory
        });
    });
});
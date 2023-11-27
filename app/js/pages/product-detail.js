document.querySelectorAll('body.product-detail-page').forEach(wrapper => {

    // init related products
    wrapper.querySelectorAll('.related-products__products').forEach(slider => {
        new Flickity(slider, {
            // options
            contain: true,
            pageDots: false,
            prevNextButtons: false,
            groupCells: '100%',
            cellAlign: 'left',
            wrapAround: false,
        });
    });

});
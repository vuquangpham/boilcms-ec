import '../vendors/flickity';

document.querySelectorAll('body.product-detail-page .product-detail__inner').forEach(wrapper => {

    // init slider
    const mainSlider = wrapper.querySelector('.product-detail__images');
    new Flickity(mainSlider, {
        // options
        contain: true,
        pageDots: false,
        prevNextButtons: true,
        groupCells: '100%',
        wrapAround: true,
        fade: true
    });

    // nav slider
    const navSlider = wrapper.querySelector('.product-detail__images-nav');
    if(navSlider){
        new Flickity(navSlider, {
            // options
            contain: true,
            pageDots: false,
            asNavFor: mainSlider,
            prevNextButtons: false,
            wrapAround: false,
            cellAlign: 'left'
        });
    }
});
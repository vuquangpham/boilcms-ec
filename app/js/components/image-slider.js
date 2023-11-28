import '../vendors/flickity';

document.querySelectorAll('.image-slider').forEach(wrapper => {
    const slider = wrapper.querySelector('.image-slider__images');
    const flkty = new FlickityResponsive(slider, {
        // options
        contain: true,
        pageDots: false,
        prevNextButtons: false,
        groupCells: 1,
        cellAlign: 'center',
        wrapAround: true,
    });
});
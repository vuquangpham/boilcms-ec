import '../vendors/flickity';
import Flickity from 'flickity';

document.querySelectorAll('.image-slider').forEach(wrapper => {
    console.log(wrapper);
    const slider = wrapper.querySelector('.image-slider__images');
    new Flickity(slider, {
        // options
        contain: true,
        pageDots: false,
        prevNextButtons: false,
        groupCells: 1,
        cellAlign: 'left',
        wrapAround: false,
    });
});
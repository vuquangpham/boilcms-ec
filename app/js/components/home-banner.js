import '../vendors/flickity';

window.addEventListener('load', () => {
    document.querySelectorAll('.home-banner').forEach(wrapper => {
        const slider = wrapper.querySelector('.home-banner__inner');
        const flkty = new Flickity(slider, {
            // options
            contain: true,
            pageDots: false,
            prevNextButtons: true,
            groupCells: '100%',
            cellAlign: 'left',
            wrapAround: true,
            fade: true
        });
    });
});
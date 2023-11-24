import '../vendors/flickity';

document.querySelectorAll('body.product-detail-page .product-detail').forEach(wrapper => {
    // selected attributes
    const selectedAttributes = [];

    // handle on change
    const handleVariationChange = (currentProduct) => {
        const attributesValues = Array.from(currentProduct.querySelectorAll('[data-product-attribute-select]'))
            .map(select => {
                const name = select.getAttribute('name');
                const value = select.value;

                return {
                    name, value
                };
            });

        // compare with the selected attributes
        selectedAttributes.find(selectedAttribute => {
            const active = selectedAttribute.every(s => !!attributesValues.find(a => a.name === s.name && a.value === s.value));
            console.log('active', active);
        });

        console.log(attributesValues);
        console.log(selectedAttributes);
    };

    // inner element
    wrapper.querySelectorAll('.product-detail__inner').forEach(inner => {
        // init slider
        const mainSlider = inner.querySelector('.product-detail__images');
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
        const navSlider = inner.querySelector('.product-detail__images-nav');
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

        // register selected attribute
        const selectedAttribute = JSON.parse(inner.getAttribute('data-selected-attributes'));
        selectedAttributes.push(selectedAttribute);

        // init easy select
        inner.querySelectorAll('[data-product-attribute-select]').forEach(e => {
            EasySelect.init(e, {
                onChange: (self) => {
                    handleVariationChange(inner);
                }
            });
        });
    });
});
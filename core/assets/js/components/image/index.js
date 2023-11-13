export default class Image{
    constructor(imageObject, isRadio = false){
        this.src = imageObject.url.small;
        this.name = imageObject.name;
        this.id = imageObject._id;
        this.isRadio = isRadio;
        this.domElement = this.getDOMElement();
    }

    getDOMElement(){
        const domEl = document.createElement('div');

        domEl.innerHTML = `
<button type="button" data-media><label>
    <input type="${this.isRadio ? 'radio' : 'checkbox'}" value="${this.id}" name="selected-media">
    <div class="single-image img-wrapper-cover t" data-media-item>
        <img src="${this.src}" alt="${this.name}" />
    </div>
</label></button>`;

        return domEl.firstElementChild;
    }
}
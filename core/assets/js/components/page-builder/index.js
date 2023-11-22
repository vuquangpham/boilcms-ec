import ModifyComponent from "./ModifyComponent";
import MediaPopup from "./MediaPopup";

export default class PageBuilder{
    constructor(wrapper){
        // invalid element
        if(!wrapper) return;
        this.wrapper = wrapper;

        // handlers
        this.modifyHandlers = new ModifyComponent(wrapper);
        this.mediaPopup = new MediaPopup(wrapper);

        // register event
        this.wrapper.addEventListener('click', this.handleWrapperClick.bind(this));

        // components list popup
        this.componentsListPopup = Popup.create({
            target: document.createElement('div'),
            popupContent: this.wrapper.querySelector('[data-popup-content="components-list-popup"]'),

            onPopupContentClick: (self) => {
                const eventTarget = self.event.target;

                // not component detail popup
                if(!eventTarget.closest('[data-popup="component-detail-popup"]')) return;

                // open popup
                this.componentDetailPopup.open();

                // close the components list popup
                self.instance.close();
            }
        });

        // component detail popup
        this.componentDetailPopup = Popup.create({
            target: document.createElement('div'),
            popupContent: this.wrapper.querySelector('[data-popup-content="component-detail-popup"]'),

            onPopupContentClick: (self) => {
                this.handleWrapperClick(self.event);
            }
        });
    }

    handleWrapperClick(e){
        // open popup
        if(e.target.closest('[data-popup="components-list-popup"]')) this.componentsListPopup.toggle();

        // component detail popup
        if(e.target.closest('[data-popup="component-detail-popup"]')) this.componentDetailPopup.toggle();

        // get the target
        let functionForHandling = () => {
        }, target = null;

        // modify handler
        const modifyHandlers = this.modifyHandlers.isModifyHandler(e);
        if(modifyHandlers !== null){
            functionForHandling = modifyHandlers.functionForHandling;
            target = modifyHandlers.target;
        }

        // media popup
        const mediaPopup = this.mediaPopup.isMediaPopup(e);
        if(mediaPopup !== null){
            functionForHandling = mediaPopup.functionForHandling;
            target = mediaPopup.target;
        }

        // invoked the function
        functionForHandling(target);
    }
}
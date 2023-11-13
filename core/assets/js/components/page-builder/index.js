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
    }

    handleWrapperClick(e){
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
import fetch from "@global/js/fetch";

export default class EditUser{
    constructor(wrapper){
        this.wrapper = wrapper;

        this.elements = {

            // popup
            popupForm: wrapper.querySelector('[data-user-form]'),

            // input fields
            userNameInput: wrapper.querySelector('[data-user-name]'),
            userEmailInput: wrapper.querySelector('[data-user-email]'),
            userRegisterInput: wrapper.querySelector('[data-user-register]'),

            // select fields
            selectRoleInput: wrapper.querySelector('[data-select-role-value]'),
            optionRoleInput: wrapper.querySelectorAll('[data-select-role-value] option'),
            selectStateInput: wrapper.querySelector('[data-select-state-value]'),
            optionStateInput: wrapper.querySelectorAll('[data-select-state-value] option'),

        };

        // vars
        const urlObject = new URL(location.href);
        this.FETCH_URL = urlObject.origin + urlObject.pathname;

        // handle click action
        this.wrapper.addEventListener('click', this.handleWrapperClick.bind(this));

        // init Popup
        this.editUserPopup = Popup.create({
            target: document.createElement('div'),
            popupContent: this.wrapper.querySelector('[data-popup-content="edit-user-page"]'),

            onPopupContentClick: (self) => {
                const eventTarget = self.event.target;

                let functionHandling = () => {
                };
                let target = null;

                const saveUserBtnEl = eventTarget.closest('button[data-user-save-btn]');
                const deleteUserBtnEl = eventTarget.closest('button[data-user-delete-btn]');

                if(saveUserBtnEl){
                    functionHandling = this.handleSaveUser.bind(this);
                    target = saveUserBtnEl;

                }else if(deleteUserBtnEl){
                    functionHandling = this.handleDeleteUser.bind(this);
                    target = deleteUserBtnEl;
                }

                // call the function
                functionHandling(target);
            }
        });
    }

    // modify date publish
    modifyDate = (publishTime) => {
        const year = publishTime.getFullYear();
        const month = (publishTime.getMonth() + 1).toString().padStart(2, '0');
        const date = publishTime.getDate().toString().padStart(2, '0');
        const hour = publishTime.getHours().toString().padStart(2, '0');
        const minute = publishTime.getMinutes().toString().padStart(2, '0');
        return `${date}/${month}/${year} at ${hour}:${minute}`;
    };

    /**
     * Replace user item in popup
     * */
    replaceUser(data){
        // set the id for the form
        this.elements.popupForm.dataset.id = data._id;

        // change the input of the form
        this.elements.userNameInput.value = data.name;
        this.elements.userEmailInput.value = data.email;
        this.elements.userRegisterInput.textContent = this.modifyDate(new Date(data.registerAt));
        this.elements.selectRoleInput.value = data.role;

        this.elements.optionRoleInput.forEach(o => {
            if(o.getAttribute('value') === data.role){
                o.setAttribute('selected', '');
            }else o.removeAttribute('selected');
        });

        this.elements.optionStateInput.forEach(o => {
            if(o.getAttribute('value') === data.state){
                o.setAttribute('selected', '');
            }else o.removeAttribute('selected');
        });

    };

    /**
     * Show single user item
     * */
    showSingleUser(target){
        // open popup
        this.editUserPopup.open();

        const formEl = target.closest('[data-user-item]');
        const id = formEl.getAttribute('data-id');

        // get detail media
        // method: get, action on page edit to get detail page
        fetch(this.FETCH_URL, {
            method: 'get',
            action: 'edit',
            getJSON: true,
            id: id
        })
            .then(res => res.json())
            .then(result => {
                this.replaceUser(result.data);
            })

            // catch the error
            .catch(err => console.error(err));
    };

    /**
     * Handle save user
     * */
    handleSaveUser(target){
        const formEl = target.closest('[data-user-form]');
        const id = formEl.getAttribute('data-id');

        const formData = new FormData();
        formData.append('name', this.elements.userNameInput.value);
        formData.append('email', this.elements.userEmailInput.value);
        formData.append('role', this.elements.selectRoleInput.value);
        formData.append('state', this.elements.selectStateInput.value);

        fetch(this.FETCH_URL, {
            method: 'post',
            action: 'edit',
            getJSON: true,
            id: id
        }, {
            method: 'post',
            body: formData
        })
            .then(res => res.json())
            .then((result) => {

                const userItemEl = this.wrapper.querySelector(`[data-user-item][data-id="${id}"]`);
                if(!userItemEl){
                    console.error('Can not find an image with id', id);
                    return;
                }

                // update the new user
                userItemEl.querySelector('[data-user-item-name]').innerHTML = result.name;
                userItemEl.querySelector('[data-user-item-email]').innerHTML = result.email;
                userItemEl.querySelector('[data-user-item-role]').innerHTML = result.role;
                userItemEl.querySelector('[data-user-item-state] span').innerHTML = result.state;

                // add class for any state
                result.state === 'active' ? userItemEl.querySelector('[data-user-item-state] span').className = 'badge badge--green' :
                    userItemEl.querySelector('[data-user-item-state] span').className = 'badge badge--red';

                // close the popup
                this.editUserPopup.close();
            })
            .catch(err => console.error(err));
    }

    /**
     * Handle delete user
     * */
    handleDeleteUser(target){
        const formEl = target.closest('[data-user-form]');
        const id = formEl.getAttribute('data-id');

        fetch(this.FETCH_URL, {
            action: 'delete',
            method: 'post',
            getJSON: true,
            id: id
        })
            .then(() => {
                // get deleted user item and remove the dom
                const deletedUserItem = this.wrapper.querySelector(`[data-user-item][data-id="${id}"]`);
                if(deletedUserItem){
                    deletedUserItem.remove();
                }

                // close the popup
                this.editUserPopup.close();
            });
    }


    handleWrapperClick(e){
        let functionHandling = () => {
        };
        let target = null;

        const singleUserItemEl = e.target.closest('button[data-user-edit]');

        if(singleUserItemEl){
            functionHandling = this.showSingleUser.bind(this);
            target = singleUserItemEl;
        }

        // call the function
        functionHandling(target);
    }
}

// handle edit user
document.querySelectorAll('[data-user-wrapper]').forEach(wrapper => {

    // init edit user
    new EditUser(wrapper.querySelector('[data-edit-user-wrapper]'));

    // create popup for add new user
    Popup.create({
        target: wrapper.querySelector('[data-user-add-new]')
    });
});
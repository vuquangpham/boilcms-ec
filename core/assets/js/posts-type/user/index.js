import AddUser from "./AddUser"
import EditUser from "./EditUser"

// handle add user
document.querySelectorAll('[data-register-user-wrapper]').forEach(wrapper => new AddUser(wrapper))

// handle edit user
document.querySelectorAll('[data-edit-user-wrapper]').forEach(wrapper => new EditUser(wrapper))

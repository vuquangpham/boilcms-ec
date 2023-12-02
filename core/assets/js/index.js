import '../styles/index.scss';

// vendors
import '@global/vendors/theme/theme.min.js';
import '@global/vendors/accordion/Accordion.min.js';
import '@global/vendors/easy-select/easy-select.min.js';
import '@global/vendors/agree/Agree.min.js';
import '@global/vendors/agree/Agree.min.css';

import '@global/vendors/popup/Popup.min.js';
import '@global/vendors/popup/Popup.min.css';

// posts-type
import './posts-type/posts';
import './posts-type/media';
import './posts-type/user';
import './posts-type/account';
import './posts-type/product';
import './posts-type/order';

// init easy select
EasySelect.init();
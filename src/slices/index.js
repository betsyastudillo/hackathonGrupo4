import { combineReducers } from 'redux';

// Front
import LayoutReducer from './layouts/reducer';

// Authentication
import LoginReducer from './auth/login/reducer';

// Sales
import SalesReducer from './sales/reducer';

// Payments
// import PayPINReducer from './payments/payPIN/reducer'; Por ahora no se utiliza
import PayQRReducer from './payments/payQR/reducer';
import GiftCardsReducer from './payments/giftCards/reducer';

// Companies
import Companies from './companies/reducer';

// Menus
import Menus from './menus/reducer';

// Profiles
import Profiles from './profiles/reducer';

// Notifications
import NotificationsReducer from './notifications/reducer';

// Advertising
import AdvertisingReducer from './advertising/reducer';

const rootReducer = combineReducers({
  Layout: LayoutReducer,
  Login: LoginReducer,
  Sales: SalesReducer,
  // PayPIN: PayPINReducer, Por ahora no se utiliza
  PayQR: PayQRReducer,
  GiftCards: GiftCardsReducer,
  Companies: Companies,
  Menus: Menus,
  Profiles: Profiles,
  Notifications: NotificationsReducer,
  Advertising: AdvertisingReducer,
});

export default rootReducer;

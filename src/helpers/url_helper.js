// <-----------------------------------  KUPI  ------------------------>
// const baseURL = 'https://8001.dev.kupi.com.co';
const baseURL = import.meta.env.VITE_BASE_URL_WS;
// const baseURL = 'http://127.0.0.1:8000';

// Auth
export const LOGIN = '/v1/auth/login-web';
export const FORGOT = '/v1/auth/forgot_pass';
export const VALIDATE = '/v1/auth/validate_otp';
export const RECOVER = '/v1/auth/recover_pass';
// Sales
export const SALES_USER = '/v1/payments/transactions-history-cashier';
// PayPIN
export const REGPAYPIN = '/v1/regPayPinAppVue';
export const DOPAYPIN = '/v1/doPayPinAppVue';
export const RESENDPIN = '/v1/resendPinVue';
export const RESENDPINVOZ = '/v1/resendPinVozVue';
// PayQR
export const REGPAYQR = '/v1/regPayQrAppVue';
export const INFOQR = '/v1/getInfoQrVue';
export const ANUREGPAYQR = '/v1/anularTrVue';

// APIKUPI
export const KUPIAPI = {
  // Invioces
  GET_INVOICES_COMERCIO: baseURL + '/v1/reports/invoices-comercio',
  GET_FINANCIERS: baseURL + '/v1/accounting/financiadoras',
  // Log-In
  LOGIN_USER: baseURL + '/v1/auth/login-web',
  // Bonds
  GET_CLASSES_BONDS: baseURL + '/v1/assignment/classes-bonds',
  GET_LATEST_BONDS: baseURL + '/v1/assignment/latest-bonds-sent',
  GET_INFO_USER_FOR_ASSIGN_BOND: baseURL + '/v1/users/get-user-by-document',
  GET_CLASSES_BONDS_FOR_CODEMPRESA: baseURL + '/v1/assignment/classes-bonds',
  // Companies
  GET_ASSOCIATED_PROFILES: baseURL + '/v1/users/user-associated-profiles',
  GET_COMPANIES: baseURL + '/v1/companies',
  GET_COMPANIES_GET_USERS: baseURL + '/v1/companies/get-users',
  POST_ACCEPT_CONTRACT: baseURL + '/v1/companies/accept-contract',
  GET_CONTRACT: baseURL + '/v1/companies/contract',
  GET_DETAILS_COMMERCE: baseURL + '/v1/commerce',
  UPDATE_COMMERCE: baseURL + '/v1/commerce',
  GET_TOKENS_BY_CODEMPRESA: baseURL + '/v1/tokens',
  CREATE_TOKENS: baseURL + '/v1/tokens',
  GET_TYPE_TOKENS: baseURL + '/v1/tokens',

  // Payments
  GET_GIFTCARDS_KUPI: baseURL + '/v1/payments/mobile/gift-cards-kupi-admin',
  CREATE_GIFTCARDS_KUPI: baseURL + '/v1/payments/mobile/gift-cards-kupi-create',
  UPDATE_GIFTCARDS_KUPI: baseURL + '/v1/payments/mobile/gift-cards-kupi-update',
  GET_GIFTCARDS: baseURL + '/v1/payments/mobile/gift-cards',
  CREATE_GIFTCARDS: baseURL + '/v1/payments/mobile/gift-cards-kupi-create',
  UPDATE_GIFTCARDS: baseURL + '/v1/payments/mobile/gift-cards-update',
  GET_LIST_PRICES_GIFTCARDS: baseURL + '/v1/payments/mobile/gift-cards-det',
  GET_LOGS_TRANSACTIONS: baseURL + '/v1/payments/logs-transactions',
  GET_LIST_PRICES_KUPIKARDS: baseURL + '/v1/payments/mobile/gift-cards-kupi',
  CREATE_PRICES_KUPIKARDS:
  baseURL + '/v1/payments/mobile/kupi-kards-price-create',
  UPDATE_PRICES_KUPIKARDS:
  baseURL + '/v1/payments/mobile/kupi-kards-price-update',
  GET_PAYMENTS_MEANS_EXT: baseURL + '/v1/payments/get-ext-medios-pago',
  GET_PAYMENT_MEAN_DET: baseURL + '/v1/payments/get-ext-medio-pago',
  CREATE_PAYMENT_MEAN: baseURL + '/v1/payments/create-ext-medio-pago',
  UPDATE_PAYMENT_MEAN: baseURL + '/v1/payments/update-ext-medio-pago',
  DELETE_PAYMENT_MEAN: baseURL + '/v1/payments/delete-ext-medio-pago',

  // Notifications
  SEND_SMS: baseURL + '/v1/sms',
  POST_RESENT_PIN: baseURL + '/v1/payments/resend-pin',
  POST_RESENT_PIN_VOZ: baseURL + '/v1/payments/resend-pin-voz',
  GET_PAY_QR: baseURL + '/v1/payments/reg-pay-qr',
  GET_PROVIDERS_SMS: baseURL + '/v1/configSMS',
  CREATE_PROVIDERS_SMS: baseURL + '/v1/configSMS',
  UPDATE_PROVIDERS_SMS: baseURL + '/v1/configSMS',
  GET_ALL_PUSH: baseURL + '/v1/push',
  GET_PUSH_DET: baseURL + '/v1/push',
  UPDATE_PUSH: baseURL + '/v1/push',
  SEND_PUSH: baseURL + '/v1/push/send-push',
  GET_PUSH_UPLOAD: baseURL + '/v1/push/get-push-upload',
  COUNT_PUSH_UPLOAD_DET: baseURL + '/v1/push/count-push-upload',
  GET_PUSH_UPLOAD_DET: baseURL + '/v1/push/get-push-upload-det',

  // Advertising
  GET_ADVERTISING: baseURL + '/v1/promos/get-all',
  CREATE_ADVERTISING: baseURL + '/v1/promos',
  UPDATE_ADVERTISING: baseURL + '/v1/promos',

  POST_REG_PAY_PIN: baseURL + '/v1/payments/reg-pay-pin',
  POST_REG_PAY_QR: baseURL + '/v1/payments/reg-pay-qr',
  CANCEL_PAY_PENDING: baseURL + '/v1/payments/cancel-pay-pending',
  DO_PAY_PIN: baseURL + '/v1/payments/do-pay-pin',
  VALIDATE_PAY_QR: baseURL + '/v1/payments/validate-pay-qr',
  CANCEL_PAY_QR: baseURL + '/v1/payments/cancel-pay-pending',

  // Menus
  GET_MENUS: baseURL + '/v1/profiles/menus-profile',
  GET_RESET_JWT_WEB: baseURL + '/v1/auth/reset-jwt-web',

  GET_MENUS_PPAL: baseURL + '/v1/menu-ppal',
  UPDATE_MENU_PPAL: baseURL + '/v1/menu-ppal',
  CREATE_MENU_PPAL: baseURL + '/v1/menu-ppal',

  // SUBMENÚS
  GET_SUBMENUS: baseURL + '/v1/submenus',
  UPDATE_SUBMENUS: baseURL + '/v1/submenus',
  CREATE_SUBMENUS: baseURL + '/v1/submenus',

  // usuarios
  GET_USER_FIND_BY_ID: baseURL + '/v1/users/find-by-id',
  GET_USERS_FIND_BY_DOCUMENT: baseURL + '/v1/users/find-by-document',
  GET_USER_BY_DOCUMENT: baseURL + '/v1/users/get-user-by-document',
  GET_FCM_BY_DOCUMENT: baseURL + '/v1/users/get-fcm-by-document',
  CREATE_ADMIN_USER: baseURL + '/v1/users/create-admin-user',
  UPDATE_PROFILE_USER: baseURL + '/v1/users/edit-my-profile',
  CHAGE_PASSWORD: baseURL + '/v1/users/change-password',
  GET_USER_DOCUMENTS_TYPE: baseURL + '/v1/users/user-document-type',
  NOTIFICATE_BALANCES_USER: baseURL + '/v1/assignment/user/notificate-balances',
  GET_USERS_BY_FINANCER: baseURL + '/v1/users/get-user-financier',
  CREATE_USER_BY_FINANCIER: baseURL + '/v1/users/create-user-by-financier',

  // PROFILES
  GET_ALL_PROFILES: baseURL + '/v1/profiles',
  CREATE_PROFILES: baseURL + '/v1/profiles',
  UPDATE_PROFILES: baseURL + '/v1/profiles',
  REMOVE_PROFILE: baseURL + '/v1/profiles/remove-profile',
  ASSIGN_PROFILE: baseURL + '/v1/profiles/assign-profile-user',

  // Perfiles
  GET_PROFILES_ASSIGN: baseURL + '/v1/profiles/assign',
  GET_PROFILES_ASSIGNED_BY_USER: baseURL + '/v1/profiles/assigned-profiles',

  // MENUS ASSOCIATED PROFILES
  GET_MENUS_ASSOCIATED: baseURL + '/v1/submenus/menus-by-perfil',
  ALL_SUBMENUS: baseURL + '/v1/submenus',
  ADD_SUBMENUS: baseURL + '/v1/submenus/add-submenus',
  DELETE_SUBMENUS: baseURL + '/v1/submenus',

  // Sales
  TRANSACTIONS_HISTORY_SALES:
    baseURL + '/v1/payments/transactions-history-cashier',
  TRANSACTION_HISTORY_DETAIL_CASHIER:
    baseURL + '/v1/payments/transaction-det-history-cashier',
  TRANSACTIONS_HISTORY_SALES_REPORTS:
    baseURL + '/v1/reports/transactions-history-cashier',
  TRANSACTIONS_GROUP_BY_CASHIER:
    baseURL + '/v1/reports/transactions-group-by-cashier',
  GET_CXP_COMERCIO: baseURL + '/v1/reports/cxp-comercio',

  // PARAMETRIZACIÓN APP KUPI
  GET_APP_KUPI: baseURL + '/v1/apps/kupi',
  UPDATE_APP_KUPI: baseURL + '/v1/apps/kupi',

  // PARAMETRIZACIÓN APPS MARCA COMPARTIDA (EXTERNAS)
  GET_APPS_MARCA_COMPARTIDA: baseURL + '/v1/apps',
  GET_APP_DET_MARCA_COMPARTIDA: baseURL + '/v1/apps',
  UPDATE_APP_MARCA_COMPARTIDA: baseURL + '/v1/apps',
  CREATE_APP_MARCA_COMPARTIDA: baseURL + '/v1/apps',
  GET_CITIES_WITH_DEPARTMENTS: baseURL + '/v1/locations/cities-with-dept',

  // categories
  GET_CATEGORIES: baseURL + '/v1/categories',
  GET_CATEGORIES_ACTIVE: baseURL + '/v1/categories/categories-active',
  UPDATE_CATEGORIES: baseURL + '/v1/categories',
  CREATE_CATEGORIES: baseURL + '/v1/categories',
  // REPORTES
  GET_REPORTS_BY_CODPERFIL: baseURL + '/v1/users/get-reports-by-codPerfil',
  // ACCOUNTING
  GET_ACCOUNTSPAYABLE: baseURL + '/v1/accounting/cxp-kupi',
};

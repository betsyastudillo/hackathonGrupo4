// Antes de la version 6 de react-router-dom
import { Navigate } from 'react-router-dom';
import DashboardKupiComercios from '@/pages/DashboardKupiComercios';
// import { PaymentLinks, WithdrawalCash, CheckingUserBalance } from '@/pages/DashboardKupiComercios';
import {} from '@/pages/DashboardKupiComercios';

import { Login } from '@/pages/Authentication/Login';
import { Forgot } from '@/pages/Authentication/ForgetPassword';
import { Recover } from '@/pages/Authentication/RecoverPassword';
import { PagoPIN, PagoQR, WithdrawalCash, PaymentLinks, CheckingUserBalance } from '@/pages/Payments';
import { PaymentMeans } from '@/pages/Payments/PaymentMeans';
import { MyReportsView } from '../pages/ReportCenter';
import { EditarComercio } from '@/pages/Admin';
import { GiftCardsKupi } from '@/pages/GiftCardsKupi';
import { ListPricesKupiKards } from '@/pages/GiftCardsKupi/ListPricesKupiKards';
import { GiftCards } from '@/pages/GiftCards';
import { IntegrationKeysView } from '@/pages/IntegrationKeys';
import { ListPricesGiftCards } from '@/pages/GiftCards/ListPricesGiftCards';

// Usuarios
import { UsersView } from '@/pages/Users/List';
import { UserView } from '@/pages/Users/User';
import { ListUserFinancier } from '@/pages/Users/ListFinancier';
import { UserProfileView } from '@/pages/Users/UserProfile';
import { ProfilesView } from '@/pages/Users/Profiles';
import { SearchUsersView } from '@/pages/Users/SearchUsers';
import { Menus, SubMenusView, MenusAssociatedProfileView } from '@/pages/Menus';
import { Profiles } from '../pages/Profiles';
import { AdminsSystemView } from '../pages/Users/Admins';
import {
  AppKupi,
  ListAppsMarcasCompartidas,
  DetailsAppsMarcasCompartidas,
} from '../pages/Aplications';
import { UserProfileSimpleView } from '../pages/Users/UserProfileSimple';
import { LogsTransactions } from '../pages/Reports/LogTransactions';
import { Contract } from '../pages/Reports/Contract';
import { Voucher } from '../pages/Reports/Voucher';
import { VoucherFactCom } from '../pages/Reports/VoucherFactCom';

// Categorias
import { CategoriesView } from '@/pages/Categories';

// Notifications
import { SendSMS } from '@/pages/Notifications/SendSMS';
import { PushNotificationsView, SendMassivePushView, DetailsMassivePushView } from '@/pages/Notifications/Push';
import { ListProvidersSMS } from '@/pages/Notifications/ListProvidersSMS';
import { SendPush } from '@/pages/Notifications/SendPush';
// Bonos
import { BonosView } from '../pages/Bonds';
import { GiveBonusView, AssignBonusViews, CreateUserViews } from '@/pages/Bonds/GiveBonuses';
// Mis ventas
import { MySalesView } from '../pages/MySales';

// Advertising
import { Advertising } from '@/pages/Advertising';
import { MyfactComDetailView } from '../pages/Reports/factComDetail';

// Contabilidad
import { AccountsPayable } from '../pages/Accounting/CxP';
import { CreateFinInvoicerView } from '../pages/Accounting/CreateFinInvoicer';

const authProtectedRoutes = [
  { path: '/dashboard', component: <DashboardKupiComercios /> },
  // Bonos
  { path: '/lista-de-bonos', component: <BonosView /> },
  { path: '/obsequiar-bono', component: <GiveBonusView /> },
  { path: '/asignar-bono/:numDocumento', component: <AssignBonusViews /> },
  { path: '/crear-usuario-financier', component: <CreateUserViews /> },
  // Payments
  { path: '/pago-con-pin', component: <PagoPIN /> },
  { path: '/pago-con-qr', component: <PagoQR /> },
  { path: '/retiro-efectivo', component: <WithdrawalCash /> },
  { path: '/link-pago', component: <PaymentLinks /> },
  { path: '/consulta-saldo-usr', component: <CheckingUserBalance /> },
  { path: '/medios-pago', component: <PaymentMeans /> },

  // Mis ventas
  { path: '/mis-ventas', component: <MySalesView /> },

  { path: '/mis-informes', component: <MyReportsView /> },
  { path: '/lista-usuarios', component: <UsersView /> },
  { path: '/lista-usuarios-financiadora', component: <ListUserFinancier /> },
  { path: '/usuario', component: <UserView /> },
  { path: '/perfil-usuario/:id', component: <UserProfileView /> },
  { path: '/perfilesUsuario/:id', component: <ProfilesView /> },
  { path: '/lista-administradores-sistema', component: <AdminsSystemView /> },

  { path: '/editar-comercio', component: <EditarComercio /> },
  { path: '/search-users/:id', component: <SearchUsersView /> },

  { path: '/menus', component: <Menus /> },
  { path: '/submenu/:codMenuPrincipal', component: <SubMenusView /> },
  {
    path: '/menus-associated-profiles/:codPerfil',
    component: <MenusAssociatedProfileView />,
  },
  { path: '/profile', component: <UserProfileSimpleView /> },
  { path: '/profiles', component: <Profiles /> },
  { path: '/app-kupi', component: <AppKupi /> },
  {
    path: '/apps-marcas-compartidas',
    component: <ListAppsMarcasCompartidas />,
  },
  {
    path: '/details-marca-compartida/:codApp',
    component: <DetailsAppsMarcasCompartidas />,
  },
  { path: '/gift-cards', component: <GiftCards /> },
  { path: '/llaves-integracion', component: <IntegrationKeysView /> },
  {
    path: '/lista-precios-kupi-kards/:idCard',
    component: <ListPricesKupiKards />,
  },
  { path: '/gift-cards-kupi', component: <GiftCardsKupi /> },
  {
    path: '/lista-precios-gift-cards/:codGrupo',
    component: <ListPricesGiftCards />,
  },

  // Categorias
  { path: '/categorias', component: <CategoriesView /> },

  { path: '/logs_transactions', component: <LogsTransactions /> },
  { path: '/contrato', component: <Contract /> },
  { path: '/voucher/:numTransaccion', component: <Voucher /> },
  { path: '/mi-fact-com/:numTransaccion', component: <VoucherFactCom /> },
  {
    path: '/mi-fact-com-detail/:numTransaccion',
    component: <MyfactComDetailView />,
  },

  // Notifications
  { path: '/send-sms', component: <SendSMS /> },
  { path: '/push-notifications', component: <PushNotificationsView /> },
  { path: '/proveedores-sms', component: <ListProvidersSMS /> },
  { path: '/send-push', component: <SendPush /> },
  { path: '/send-massive-push', component: <SendMassivePushView /> },
  { path: '/detail-massive-push/:codUpload/:codEstadoUpload', component: <DetailsMassivePushView /> },

  // Advertising
  { path: '/publicidad', component: <Advertising /> },

  // Contabilidad
  { path: '/cuentas-por-pagar-comercios', component: <AccountsPayable /> },
  { path: '/crear-fact-fin', component: <CreateFinInvoicerView /> },

  { path: '*', component: <Navigate to="/dashboard" /> }, // Wildcard para rutas no encontradas
  { path: '/', exact: true, component: <Navigate to="/dashboard" /> }, // Redirección desde la raíz
];

const publicRoutes = [
  { path: '/login', component: <Login /> },
  { path: '/forgot-password', component: <Forgot /> },
  { path: '/recover-password', component: <Recover /> },
];

export { authProtectedRoutes, publicRoutes };

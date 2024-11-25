import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './slices';

// Configuración del store con Redux Toolkit
const store = configureStore({ reducer: rootReducer, devTools: true });

const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderización de la app
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

// version anterior de la 6
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App.jsx';
// // import reportWebVitals from './reportWebVitals';
// import { BrowserRouter } from 'react-router-dom';
// import { Provider } from 'react-redux';
// // Plantilla
// import { configureStore } from '@reduxjs/toolkit';
// import rootReducer from './slices';
// const store = configureStore({ reducer: rootReducer, devTools: true });

// const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(
//   <Provider store={store}>
//     <React.Fragment>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </React.Fragment>
//   </Provider>
// );

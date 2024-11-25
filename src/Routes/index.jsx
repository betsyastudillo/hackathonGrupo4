import { Routes, Route } from 'react-router-dom';

// Layouts
import NonAuthLayout from '../Layouts/NonAuthLayout.jsx';
import VerticalLayout from '../Layouts/index.jsx';

// Routes
import { authProtectedRoutes, publicRoutes } from './allRoutes.jsx';
import { AuthProtected } from './AuthProtected';

const Index = () => {
  return (
    <Routes>
      {/* Public Routes */}
      {publicRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={<NonAuthLayout>{route.component}</NonAuthLayout>}
        />
      ))}

      {/* Auth Protected Routes */}
      {authProtectedRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={
            <AuthProtected>
              <VerticalLayout>{route.component}</VerticalLayout>
            </AuthProtected>
          }
        />
      ))}
    </Routes>
  );
};

export default Index;

// iversion  anterior
// import { Routes, Route } from 'react-router-dom';

// //Layouts
// import NonAuthLayout from '../Layouts/NonAuthLayout.jsx';
// import VerticalLayout from '../Layouts/index.jsx';

// //routes
// import { authProtectedRoutes, publicRoutes } from './allRoutes.jsx';
// import { AuthProtected } from './AuthProtected';

// const Index = () => {
//   return (
//     <>
//       <Routes>
//         <Route>
//           {publicRoutes.map((route, idx) => (
//             <Route
//               path={route.path}
//               element={<NonAuthLayout>{route.component}</NonAuthLayout>}
//               key={idx}
//               exact={true}
//             />
//           ))}
//         </Route>

//         <Route>
//           {authProtectedRoutes.map((route, idx) => (
//             <Route
//               path={route.path}
//               element={
//                 <AuthProtected>
//                   <VerticalLayout>{route.component}</VerticalLayout>
//                 </AuthProtected>
//               }
//               key={idx}
//               exact={true}
//             />
//           ))}
//         </Route>
//       </Routes>
//     </>
//   );
// };

// export default Index;

import { useEffect } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// import { setAuthorization } from '../helpers/api_helper_kupi';
import { logoutUser } from '../slices/auth/login/thunk';
import { useProfile } from '../Components/Hooks/UserHooks';

const AuthProtected = props => {
  const dispatch = useDispatch();
  const { userProfile, loading, token } = useProfile();
  useEffect(() => {
    if (userProfile && !loading && token) {
      // console.log('on-line');
    } else if (!userProfile && loading && !token) {
      dispatch(logoutUser());
    }
  }, [token, userProfile, loading, dispatch]);

  /* Navigate is un-auth access protected routes via url */
  if (!userProfile && loading && !token) {
    return (
      <Navigate to={{ pathname: '/login', state: { from: props.location } }} />
    );
  }

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return (
          <>
            {' '}
            <Component {...props} />{' '}
          </>
        );
      }}
    />
  );
};

export { AuthProtected, AccessRoute };

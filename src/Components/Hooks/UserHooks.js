import { useEffect, useState } from 'react';
// import { getLoggedinUser } from '../../helpers/api_helper';
import { getLoggedinUser } from '../../helpers/api_helper_kupi';

const useProfile = () => {
  const userProfileSession = getLoggedinUser();
  var token = userProfileSession && userProfileSession['token'];
  const [loading, setLoading] = useState(userProfileSession ? false : true);
  const [userProfile, setUserProfile] = useState(
    userProfileSession ? userProfileSession : null
  );

  useEffect(() => {
    const userProfileSession = getLoggedinUser();
    //console.log('lo que llega en getLoggedinuser', userProfileSession);
    var token = userProfileSession && userProfileSession['token'];
    setUserProfile(userProfileSession ? userProfileSession : null);
    setLoading(token ? false : true);
  }, []);

  return { userProfile, loading, token };
};

export { useProfile };

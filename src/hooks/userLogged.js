import { useEffect, useState } from 'react';
import { getLoggedinUser } from '../helpers/api_helper_kupi';

const useProfile = () => {
  const userProfileSession = getLoggedinUser();
  const [userProfile, setUserProfile] = useState(
    userProfileSession ? userProfileSession : null
  );

  useEffect(() => {
    const userProfileSession = getLoggedinUser();
    setUserProfile(userProfileSession ? userProfileSession : null);
  }, []);
  return { userProfile };
};

export { useProfile };

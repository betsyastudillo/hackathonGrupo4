import axios from 'axios';
import api from '../config';

// default
axios.defaults.baseURL = api.api.API_KUPI;

// content type para post
// content type para todos
axios.defaults.headers.common['Content-Type'] = 'application/json';

// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    return response.data ? response.data : response;
  },
  function (error) {
    let message;
    switch (error.status) {
      case 500:
        message = 'Internal Server Error';
        break;
      case 401:
        message = 'Invalid credentials';
        break;
      case 404:
        message = 'Sorry! the data you are looking for could not be found';
        break;
      default:
        message = error.message || error;
    }
    return Promise.reject(message);
  }
);
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = token => {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
};

class APIClientPython {
  get = (url, params) => {
    let response;

    let paramKeys = [];

    if (params) {
      Object.keys(params).map(key => {
        paramKeys.push(key + '=' + params[key]);
        return paramKeys;
      });

      const queryString =
        paramKeys && paramKeys.length ? paramKeys.join('&') : '';
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }

    return response;
  };
  /**
   * post given data to url
   */
  // create = (url, data) => {
  //   return axios.post(url, data);
  // };
  create = (url, data) => {
    const headers = { 'Content-Type': 'application/json', };

    console.log(url);

    return axios.post(url, data, { headers });
  };
  /**
   * Updates data
   */
  update = (url, data) => {
    return axios.patch(url, data);
  };

  put = (url, data) => {
    return axios.put(url, data);
  };
  /**
   * Delete
   */
  delete = (url, config) => {
    return axios.delete(url, { ...config });
  };
}

const getLoggedinUser = () => {
  const user = localStorage.getItem('user');
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

export { APIClientPython, setAuthorization, getLoggedinUser };
// export { APIClientPython, getLoggedinUser };

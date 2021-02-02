import {MODULE_ACTIONS as LOADER_ACTIONS} from '../loader';
import {MODULE_ACTIONS as ERRORS_ACTIONS} from '../errors';

// Request
const requestResolve = store => {
  return config => {
    store.dispatch(
      LOADER_ACTIONS.START_LOADING,
      {
        apiActionName: config.apiActionName,
        global: config.loaderGlobal !== false,
      },
      {root: true}
    );

    config.headers.common['Cache-Control'] = 'no-cache';
    config.headers.common['Pragma'] = 'no-cache';

    return config;
  };
};

const requestReject = store => {
  return error => {
    return Promise.reject(error);
  };
};

// Response
const responseResolve = store => {
  return response => {
    store.dispatch(
      LOADER_ACTIONS.FINISH_LOADING,
      {
        apiActionName: response.config.apiActionName,
      },
      {root: true}
    );

    let data = response.data;

    if (data.error) {
      data.error.endpoint = response.config.endpoint;
      store.dispatch(ERRORS_ACTIONS.ADD_ERROR, data.error, {root: true});

      return Promise.reject(data);
    } else {
      return Promise.resolve(data);
    }
  };
};

const responseReject = store => {
  return error => {
    store.dispatch(
      LOADER_ACTIONS.FINISH_LOADING,
      {
        apiActionName: error.config.apiActionName,
      },
      {root: true}
    );
    if (!error.response?.data?.error.Authorization && !/4??/.test(`${error.response.status}`)) {
      if (error.response?.data?.error) {
        store.dispatch(ERRORS_ACTIONS.ADD_ERROR, error.response.data.error, {root: true});
      } else {
        store.dispatch(ERRORS_ACTIONS.ADD_ERROR, error, {root: true});
      }
    }

    return Promise.reject(error);
  };
};

export {requestResolve, requestReject, responseResolve, responseReject};
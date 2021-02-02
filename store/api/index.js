import axios from 'axios';
import {MODULE_NAME, ACTIONS, MODULE_ACTIONS, MUTATIONS, MODULE_GETTERS} from './consts';
import {requestResolve, requestReject, responseResolve, responseReject} from './interceptors';
import {traverseObject} from '@/services/utils';
import LocalStorageService from '../../services/local-storage';
import router from '../../router';

function transformDates(data) {
  traverseObject(data, (obj, key) => {
    if (obj[key] instanceof Date) {
      obj[key] = obj[key].toISOString();
    }
  });
}

const MODULE = {
  namespaced: true,
  state: {
    axios: null,
    environment: null,
  },
  mutations: {
    [MUTATIONS.SET_AXIOS](state) {
      state.axios = axios.create({withCredentials: false});

      state.axios.interceptors.request.use(requestResolve(this), requestReject(this));
      state.axios.interceptors.response.use(responseResolve(this), responseReject(this));
    },
    [MUTATIONS.SET_ENVIRONMENT](state, environment) {
      state.environment = environment;
    },
  },
  actions: {
    //common
    [ACTIONS.INIT]({commit, state}, environment, router) {
      commit(MUTATIONS.SET_AXIOS, environment);
      commit(MUTATIONS.SET_ENVIRONMENT, environment);
      state.router = router;
    },
    async [ACTIONS.SEND]({dispatch, state}, request) {
      let {method, endpoint, data, headers = {}} = request;
      transformDates(data);
      return await state.axios({
        method,
        url: `${state.environment['VUE_APP_API']}${endpoint}`,
        data,
        headers,
      });
    },
    async [ACTIONS.SEND_AUTHORIZED]({dispatch, state}, request) {
      let retries = 2;
      while (retries) {
        try {
          retries--;
          let authorization = LocalStorageService.get('token');
          return await dispatch(ACTIONS.SEND, {
            ...request,
            headers: {
              ...request.headers,
              authorization,
            },
          });
        } catch (error) {
          if (error.response.status !== 401 && error.response.status !== 500) {
            throw error;
          }
          if (error.response.status === 500) {
            return;
          }
          await dispatch(ACTIONS.REFRESH_TOKEN);
        }
      }
      router.push('/login');
    },
    // admin
    [ACTIONS.LOAD_STUDY_POLICIES_ADMIN]({dispatch}, data) {
      let query;
      if (Object.keys(data).length) {
        query = '?';
        Object.entries(data).forEach(request => (query = query.concat(`${request[0]}=${request[1]}&`)));
        query = query.slice(0, -1);
      }
      return dispatch(ACTIONS.SEND_AUTHORIZED, {
        method: 'get',
        endpoint: `admin/study-policies${query || ''}`,
        config: {apiActionName: MODULE_ACTIONS.LOAD_STUDY_POLICIES_ADMIN, loaderGlobal: false},
      });
    },
    [ACTIONS.CREATE_STUDY_POLICY_ADMIN]({dispatch}, data) {
      return dispatch(ACTIONS.SEND_AUTHORIZED, {
        method: 'post',
        endpoint: 'admin/study-policies',
        data,
        config: {apiActionName: MODULE_ACTIONS.CREATE_STUDY_POLICY_ADMIN, loaderGlobal: false},
      });
    },
    [ACTIONS.CHANGE_STUDY_POLICY_STATUS_ADMIN]({dispatch}, {id, data}) {
      return dispatch(ACTIONS.SEND_AUTHORIZED, {
        method: 'put',
        endpoint: `admin/study-policies/${id}`,
        data,
        config: {apiActionName: MODULE_ACTIONS.CHANGE_STUDY_POLICY_STATUS_ADMIN, loaderGlobal: false},
      });
    },
    [ACTIONS.DELETE_STUDY_POLICIES_ADMIN]({dispatch}, data) {
      return dispatch(ACTIONS.SEND_AUTHORIZED, {
        method: 'delete',
        endpoint: 'admin/study-policies',
        data,
        config: {apiActionName: MODULE_ACTIONS.DELETE_STUDY_POLICIES_ADMIN, loaderGlobal: false},
      });
    },
  },
};

export {MODULE_NAME, MODULE, MODULE_ACTIONS, MODULE_GETTERS};
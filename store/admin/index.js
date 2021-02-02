import {MODULE_NAME} from './consts';
import STORE_STATE from './state';
import {STORE_GETTERS, MODULE_GETTERS} from './getters';
import {STORE_ACTIONS, MODULE_ACTIONS} from './actions';
import {STORE_MUTATIONS} from './mutations';

const MODULE = {
  namespaced: true,
  state: STORE_STATE,
  getters: STORE_GETTERS,
  mutations: STORE_MUTATIONS,
  actions: STORE_ACTIONS,
};

export {MODULE_NAME, MODULE, MODULE_ACTIONS, MODULE_GETTERS};
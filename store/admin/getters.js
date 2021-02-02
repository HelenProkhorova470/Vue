import {MODULE_GETTERS, GETTERS} from './consts';

const STORE_GETTERS = {
  [GETTERS.GET_STUDY_POLICIES](state) {
    return state.studyPolicies;
  },
};

export {STORE_GETTERS, MODULE_GETTERS, GETTERS};
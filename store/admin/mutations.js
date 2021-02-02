import {MUTATIONS} from './consts';

const STORE_MUTATIONS = {
  [MUTATIONS.SET_STUDY_POLICIES](state, studyPolicies) {
    state.studyPolicies = studyPolicies;
  },
};

export {STORE_MUTATIONS, MUTATIONS};
import {MODULE_ACTIONS, ACTIONS, MUTATIONS} from './consts';
import {MODULE_ACTIONS as API_ACTIONS} from '../api';

const STORE_ACTIONS = {
  // common studyPolicies
  async [ACTIONS.LOAD_STUDY_POLICIES]({state, commit, dispatch}, value) {
    let isLoadMore = value.isLoadMore;
    delete value.isLoadMore;
    const studyPoliciesObj = await dispatch(API_ACTIONS.LOAD_STUDY_POLICIES_ADMIN, value, {root: true});
    const studyPolicies = studyPoliciesObj.studyPolicies;
    let allStudyPolicies;
    if (isLoadMore) {
      allStudyPolicies = state.studyPolicies.concat(studyPolicies);
    } else {
      allStudyPolicies = studyPolicies;
    }
    commit(MUTATIONS.SET_STUDY_POLICIES, allStudyPolicies);
    return studyPoliciesObj;
  },
  async [ACTIONS.CREATE_STUDY_POLICY]({commit, dispatch}, value) {
    return await dispatch(API_ACTIONS.CREATE_STUDY_POLICY_ADMIN, value, {root: true});
  },
  async [ACTIONS.CHANGE_STUDY_POLICY_STATUS]({commit, dispatch}, value) {
    return await dispatch(API_ACTIONS.CHANGE_STUDY_POLICY_STATUS_ADMIN, value, {root: true});
  },
  async [ACTIONS.DELETE_STUDY_POLICIES]({commit, dispatch}, value) {
    return await dispatch(API_ACTIONS.DELETE_STUDY_POLICIES_ADMIN, value, {root: true});
  },
};

export {STORE_ACTIONS, MODULE_ACTIONS, ACTIONS};
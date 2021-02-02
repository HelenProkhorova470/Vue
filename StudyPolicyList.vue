<template>
    <div class="relative" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="-150">
        <div v-if="statusChange">
            <modal title="" :info="`admin.regulations.action.${statusChange}`" withLayout @hide-modal="clearAll">
                <div class="control-text"> Введите в поле проверочный текст: {{ genText }} </div>
                <div class="input-wrapper">
                    <input v-model="$v.checkField.$model" />
                </div>
                <div class="d-flex justify-content-between btn-wrap">
                    <button class="btn" @click="confirmChange" :class="{disabled: $v.$invalid}">
                        {{ $t('common.confirm') }}
                    </button>
                    <button class="btn" @click="clearAll">{{ $t('common.cancel') }}</button>
                </div>
            </modal>
        </div>
        <div v-if="error">
            <modal title="" :info="error" withLayout @hide-modal="clearAll" />
        </div>
        <div v-if="addNewPolicy">
            <modal :title="`admin.studyPolicies.modal-title`" :info="`Заполните поля:`" withLayout @hide-modal="clearAll">
                <template>
                    <input class="modal-input" v-model="requisites" :placeholder="$t(`admin.regulations.requisites-title`)" />
                    <p>{{ $t(`admin.studyPolicies.rules-title`) }}</p>
                    <div class="editor">
                        <ckeditor v-model="textData" :config="editorConfig"></ckeditor>
                    </div>
                    <div class="check-block modal-check">
                        <div class="settings">
                            <input class="check" type="checkbox" v-model="isNewRuleCheck" :class="{checked: isNewRuleCheck}" />
                            <label @click.prevent="checkRule()" />
                        </div>
                        <div>
                            {{ $t(`admin.regulations.check-label`) }}
                        </div>
                    </div>
                    <div class="d-flex justify-content-between btn-wrap button-block">
                        <button class="btn" @click="addNewPolicyClose">
                            {{ $t('common.cancel') }}
                        </button>
                        <button class="btn" :class="{disabled: $v.$invalid}" @click="saveNewPolicy">{{
                            $t('common.saveBtn')
                            }}</button>
                    </div>
                </template>
            </modal>
        </div>
        <div v-if="showAbout">
            <modal title="" :info="showAbout" withLayout admin @hide-modal="closeInfo" />
        </div>
        <template>
            <div class="subtitle">{{ $t('admin.studyPolicies.title') }}</div>
        </template>
        <template>
            <div class="d-flex helpers">
                <div class="selector-wrapper">
                    <div class="placeholder" :class="{disabled: !studyPolicies.length}" @click="openSelector">{{
                        $t('contentStructure.selector')
                        }}</div>
                    <div class="selector" v-if="selectorOpened" v-click-outside="hideSelector">
                        <div @click.prevent="deletePolicy(null)"> {{ $t('common.remove') }}</div>
                    </div>
                </div>
                <div class="search">
                    <input class="search-input" v-model="search" @keyup.enter="searchRules" />
                    <i class="fas fa-search" @click="searchRules"></i>
                </div>
                <div class="selector-wrapper search-by">
                    <div class="placeholder" @click="searchSelector = true">всем полям</div>
                    <div class="selector" v-if="searchSelector" v-click-outside="hideSelector">
                        <div @click.prevent="setField('all')">всем полям</div>
                        <div @click.prevent="setField('name')">реквизитам</div>
                        <div @click.prevent="setField('createdAt')">дате сохранения</div>
                        <div @click.prevent="setField('statusRus')">статусу</div>
                    </div>
                </div>
            </div>
            <div class="addUserBlock">
                <button class="btn add-user-button" @click="addNewPolicyOpen">
                    {{ $t('admin.studyPolicies.button-text') }}
                </button>
            </div>
            <div class="table-view" v-if="studyPolicies.length">
                <div class="table-head table-row admin-row">
                    <div class="check-block" />
                    <div class="number">№</div>
                    <div class="policy-name"
                    >Реквизиты редакции правил
                        <i :class="['fas', getCaretDirection('name')]" @click.prevent="setSort('name')"></i
                        ></div>
                    <div class="date-loading"
                    >Дата сохранения
                        <i :class="['fas', getCaretDirection('createdAt')]" @click.prevent="setSort('createdAt')"></i
                        ></div>
                    <div class="policy-status"
                    >Активно/не активно <i :class="['fas', getCaretDirection('status')]" @click.prevent="setSort('status')"></i
                    ></div>
                </div>
                <template>
                    <div class="table-row admin-row relative" v-for="(policy, index) in studyPolicies" :key="policy.id">
                        <div class="check-block">
                            <template v-if="policy.status === 'deactivated'">
                                <div class="settings relative">
                                    <input
                                            class="check"
                                            type="checkbox"
                                            :class="{checked: checkedPolicies.some(el => el === policy.id)}"
                                            :value="policy.id"
                                    />
                                    <label @click.prevent="checkPolicy(policy.id)"></label>
                                </div>
                                <div class="more" @click="showMoreToggle(policy)">
                                    <i class="fas fa-ellipsis-v" />
                                </div>
                            </template>
                        </div>
                        <template v-if="showMore.id === policy.id && policy.status === 'deactivated'">
                            <div class="dropdown" v-click-outside="hideMoreToggle">
                                <button class="dropdown-btn" @click="changePolicyStatus(policy.id, 'activated')">
                                    {{ $t('admin.templates.action.activate') }}
                                </button>
                                <button class="dropdown-btn" @click="deletePolicy(policy.id)">
                                    {{ $t('common.remove') }}
                                </button>
                            </div>
                        </template>
                        <div class="number">{{ index + 1 }}</div>
                        <div class="policy-name modal-open" @click="openInfo(policy.about)">{{ policy.name }}</div>
                        <div class="date-loading">{{ toDate(policy.createdAt) }}</div>
                        <div class="policy-status">{{ policy.status === 'activated' ? 'активно' : 'не активно' }}</div>
                    </div>
                </template>
            </div>
        </template>
        <template v-if="busy">
            <spinner local />
        </template>
        <div v-if="!studyPolicies.length && !busy">Пока не создано ни одного правила</div>
    </div>
</template>

<script>
  import {mapActions, mapGetters} from 'store';
  import {MODULE_ACTIONS as ADMIN_ACTIONS, MODULE_GETTERS as ADMIN_GETTERS} from '@/store/admin';
  import Spinner from '@/components/Common/Spinner';
  import Modal from '@/components/Modal/Modal';
  import {required, sameAs} from 'vuelidate/lib/validators';
  import {toDateFormat} from '@/services/utils';
  import {editorConfig} from '@/services/values';
  import moment from 'moment';

  export default {
    name: 'StudyPolicyList',
    components: {Spinner, Modal},
    async mounted() {
      let studyPolicies = await this.getStudyPolicies({offset: 0});
      this.allStudyPoliciesCount = studyPolicies.count;
      this.busy = false;
    },
    validations() {
      let validations = {
        textData: {},
        requisites: {},
        checkField: {},
      };
      if (this.statusChange) {
        validations.checkField = {
          required,
          same: sameAs('genText'),
        };
      }
      if (this.addNewPolicy) {
        validations.textData = {
          required,
        };
        validations.requisites = {
          required,
        };
      }
      return validations;
    },
    computed: {
      ...mapGetters({
        studyPolicies: ADMIN_GETTERS.GET_STUDY_POLICIES,
      }),
      getQuery() {
        let query = {
          search: this.search,
          offset: 0,
          orderBy: this.orderBy,
          trend: this.trend,
        };
        if (this.searchBy !== 'all') {
          query.searchBy = this.searchBy;
          if (this.searchBy === 'createdAt') {
            query.search = moment(this.search, 'DD.MM.YYYY').format('YYYY-MM-DD');
          }
        }
        return query;
      },
    },
    data() {
      return {
        editorConfig,
        checkedPolicies: [],
        showMore: false,
        busy: true,
        allStudyPoliciesCount: 0,
        orderBy: 'status',
        trend: 'ASC',
        searchBy: '',
        selectorOpened: false,
        showAbout: false,
        search: '',
        statusChange: '',
        genText: '',
        checkField: '',
        addNewPolicy: false,
        isRoleSelectorOpen: false,
        textData: '',
        requisites: '',
        isNewRuleCheck: false,
        searchSelector: false,
        error: false,
      };
    },
    methods: {
      ...mapActions({
        getStudyPolicies: ADMIN_ACTIONS.LOAD_STUDY_POLICIES,
        createPolicy: ADMIN_ACTIONS.CREATE_STUDY_POLICY,
        changeStatus: ADMIN_ACTIONS.CHANGE_STUDY_POLICY_STATUS,
        deletePolicies: ADMIN_ACTIONS.DELETE_STUDY_POLICIES,
      }),
      async loadMore() {
        if (this.busy || this.studyPolicies.length === this.allStudyPoliciesCount) return;
        this.busy = true;
        let studyPolicies = await this.getStudyPolicies({
          ...this.getQuery,
          offset: this.studyPolicies.length,
          isLoadMore: true,
        });
        this.allStudyPoliciesCount = studyPolicies.count;
        this.busy = false;
      },
      checkPolicy(id) {
        if (this.checkedPolicies.some(el => el === id)) {
          this.checkedPolicies = this.checkedPolicies.filter(elem => elem !== id);
        } else {
          this.checkedPolicies.push(id);
        }
      },
      checkRule() {
        this.isNewRuleCheck = !this.isNewRuleCheck;
      },
      toDate(date) {
        return toDateFormat(date);
      },
      hideMoreToggle() {
        this.showMore = false;
      },
      showMoreToggle(policy) {
        this.showMore = policy;
      },
      async setField(type) {
        this.searchBy = type;
        await this.getStudyPolicies(this.getQuery);
        this.hideSelector();
      },
      clearAll() {
        this.requisites = '';
        this.textData = '';
        this.statusChange = '';
        this.onePolicy = null;
        this.genText = '';
        this.checkField = '';
        this.search = '';
        this.error = '';
      },
      async confirmChange() {
        let result;
        if (this.statusChange === 'delete') {
          this.deletePolicies({
            ids: this.checkedPolicies.length ? this.checkedPolicies : [this.onePolicy],
          }).catch(err => {
            result = err;
          });
        } else {
          this.changeStatus({
            id: this.onePolicy,
            data: {status: this.statusChange},
          }).catch(err => (result = err));
        }
        if (result?.response?.data?.error?.errorCode === 602) {
          this.error = 'error.somethingWrong';
        }
        let studyPolicies = await this.getStudyPolicies({
          offset: 0,
          orderBy: this.orderBy,
          trend: this.trend,
        });
        this.allStudyPoliciesCount = studyPolicies.count;
        this.clearAll();
      },
      changePolicyStatus(id, status) {
        this.hideMoreToggle();
        this.hideSelector();
        this.onePolicy = id;
        this.statusChange = status;
        this.genText = `${Math.round(Math.random() * 10000)}`;
      },
      openInfo(about) {
        this.showAbout = about;
      },
      closeInfo() {
        this.showAbout = false;
      },
      deletePolicy(id) {
        this.hideMoreToggle();
        this.hideSelector();
        this.onePolicy = id;
        this.statusChange = 'delete';
        this.genText = `${Math.round(Math.random() * 10000)}`;
      },
      async setSort(field) {
        const order = this.getSortOrder(field) === 'ASC' ? 'DESC' : 'ASC';
        let studyPolicies = await this.getStudyPolicies({...this.getQuery, orderBy: field, trend: order});
        this.allStudyPoliciesCount = studyPolicies.count;
        this.orderBy = field;
        this.orderBy = order;
      },
      getSortOrder(field) {
        if (this.orderBy === field) {
          return this.orderBy;
        } else {
          return 'DESC';
        }
      },
      getCaretDirection(column) {
        return this.getSortOrder(column) === 'ASC' ? 'fa-caret-up' : 'fa-caret-down';
      },
      openSelector() {
        if (!this.studyPolicies.length) return;
        this.selectorOpened = true;
      },
      hideSelector() {
        this.selectorOpened = false;
        this.searchSelector = false;
      },
      addNewPolicyOpen() {
        this.addNewPolicy = true;
      },
      addNewPolicyClose() {
        this.addNewPolicy = false;
        this.requisites = '';
        this.textData = '';
        this.onePolicy = null;
        this.isNewRuleCheck = false;
      },
      async saveNewPolicy() {
        await this.createPolicy({
          name: this.requisites,
          about: this.textData,
          status: this.isNewRuleCheck ? 'activated' : 'deactivated',
        });
        let studyPolicies = await this.getStudyPolicies({
          offset: 0,
          orderBy: this.orderBy,
          trend: this.trend,
        });
        this.allStudyPoliciesCount = studyPolicies.count;
        this.addNewPolicyClose();
      },
      openRoleSelector() {
        this.isRoleSelectorOpen = true;
      },
      closeRoleSelector() {
        this.isRoleSelectorOpen = false;
      },
      setRole(value) {
        this.role = value;
      },
      async searchRules() {
        let studyPolicies = await this.getStudyPolicies(this.getQuery);
        this.allStudyPoliciesCount = studyPolicies.count;
      },
    },
  };
</script>

<style scoped lang="scss">
    @import '../../assets/styles/content-users';
    @import '../../assets/styles/admin';
    .number {
        width: 35px;
        margin-left: 25px;
    }
    .table-view {
        padding-bottom: 80px;
        margin-bottom: 0;
    }
    .policy-name {
        flex-grow: 1;
        &.modal-open {
            cursor: pointer;
            text-decoration: underline;
            color: $azure;
            &:hover {
                text-decoration: none;
            }
        }
    }
    .policy-status,
    .date-loading {
        width: 150px;
    }
    .check-block {
        width: 35px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .modal-check {
        width: 280px;
        margin: -50px 0 0 25px;
    }
    .modal-check .check + label:before {
        left: 25px;
    }
    .addUserBlock {
        text-align: left;
    }
    .search {
        margin-right: 20px;
    }
    .add-user-button {
        width: 315px;
        height: 35px;
        padding: 0;
        margin-bottom: 20px;
    }
    .button-block {
        margin-top: 25px;
    }
    input.modal-input {
        margin: 0 25px 16px;
        width: calc(100% - 62px);
    }
    .selector-block {
        width: 85%;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .editor {
        margin: 0 25px 65px;
    }
</style>
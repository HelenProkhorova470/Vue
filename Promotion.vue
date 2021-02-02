<template>
    <div class="promotion">
        <div class="sorting">
            <sorting-block
                    :numberOfStatistics="numberOfPreviews"
                    :sortValues="sortValues"
                    :sortOpen="sortOpen"
                    @sort-by="sortItemsBy"
                    @search="search"
                    @show="show"
                    @toggle-sort="toggleSorting"
            />
        </div>
        <div class="table-view">
            <div class="table-head">
                <div
                        class="table-title d-flex"
                        :class="`${item.type}`"
                        v-for="item in sortValues"
                        :key="`statistics_${item.type}`"
                        v-tooltip="`${$t(`statistic.${item.type}`)}`"
                >
                    <div>
                        {{ item.ru }}
                    </div>
                    <i class="fas fa-caret-down"></i>
                </div>
            </div>
            <div class="table-body" :class="`show-${numberOfPreviews}`">
                <div class="table-row">
                    <div class="name bold" :class="{hovered: showPreviews.length}" @click="togglePreviews">Анонсы</div>
                    <div
                            :class="`${item.type} bold`"
                            v-for="item in sortValues.filter(val => val.type !== 'name')"
                            :key="`previews_${item.type}`"
                    >
                        {{ promotionStatistics.previewsStatistics.sum[item.type] || 0 }}
                    </div>
                </div>
                <template v-if="showPreviews.length && isShowPreviews">
                    <div class="table-row" v-for="preview in showPreviews" :key="preview.previewId">
                        <div class="name">{{ preview.previewName }}</div>
                        <div
                                :class="`${item.type}`"
                                v-for="item in sortValues.filter(val => val.type !== 'name')"
                                :key="`library_${item.type}`"
                        >
                            {{ preview.actions[item.type] || 0 }}
                        </div>
                    </div>
                </template>
                <div class="table-row library">
                    <div class="name bold">Карточка библиотеки</div>
                    <div
                            :class="`${item.type} bold`"
                            v-for="item in sortValues.filter(val => val.type !== 'name')"
                            :key="`library_${item.type}`"
                    >
                        {{
                        (promotionStatistics.libraryStatistics.actions &&
                        promotionStatistics.libraryStatistics.actions[item.type]) ||
                        0
                        }}
                    </div>
                </div>
                <div class="table-row">
                    <div class="name bold hovered" @click="togglePage">Страница контента</div>
                    <div
                            :class="`${item.type} bold`"
                            v-for="item in sortValues.filter(val => val.type !== 'name')"
                            :key="`page_${item.type}`"
                    >
                        {{ /transition/.test(item.type) ? '-' : promotionStatistics.contentActionsSum[item.type] || 0 }}
                    </div>
                </div>
                <template v-if="pageExtended">
                    <div v-for="stat in sortedPageStatistics" :key="stat.type" class="table-row">
                        <div class="name">{{ $t(`statistic.${stat.type}`) }}</div>
                        <div
                                :class="`${item.type}`"
                                v-for="item in sortValues.filter(val => val.type !== 'name')"
                                :key="`${stat.type}_${item.type}`"
                        >
                            {{ stat[item.type] || 0 }}
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
  import SortingBlock from '@/components/Content/SortingBlock';
  import {sortBy} from 'lodash';
  export default {
    name: 'Promotion',
    components: {SortingBlock},
    props: {
      promotionStatistics: {
        required: true,
      },
    },
    mounted() {
      this.showPreviews = [...this.promotionStatistics.previewsStatistics.previews].splice(0, this.numberOfPreviews);
      this.sortedPageStatistics = [
        {
          type: 'library-card',
          actionsCTR: 0,
          interest: 0,
          interestsCTR: 0,
          payment: 0,
          paymentsCTR: 0,
          registration: 0,
          transition: 0,
          transitionsCTR: 0,
          unpayment: 0,
          view: 0,
        },
        {
          type: 'previews-card',
          actionsCTR: 0,
          interest: 0,
          interestsCTR: 0,
          payment: 0,
          paymentsCTR: 0,
          registration: 0,
          transition: 0,
          transitionsCTR: 0,
          unpayment: 0,
          view: 0,
        },
        {type: 'searchEngineStatistics', ...this.promotionStatistics.searchEngineStatistics},
        {type: 'externalTransitionsStatistics', ...this.promotionStatistics.externalTransitionsStatistics},
      ];
    },
    data() {
      return {
        sortOpen: false,
        isShowPreviews: false,
        pageExtended: false,
        numberOfPreviews: 20,
        showPreviews: [],
        sortValues: [
          {type: 'name', ru: 'Источник'},
          {type: 'view', ru: 'Показы'},
          {type: 'transition', ru: 'Переходы'},
          {type: 'interest', ru: 'Закладки'},
          {type: 'registration', ru: 'Подписки'},
          {type: 'payment', ru: 'Оплаты'},
          {type: 'unpayment', ru: 'Неоплаты'},
          {type: 'transitionsCTR', ru: 'CTR перехода'},
          {type: 'interestsCTR', ru: 'CTR интереса'},
          {type: 'actionsCTR', ru: 'CTR цель'},
          {type: 'paymentsCTR', ru: 'CTR оплат'},
        ],
        sortedPageStatistics: [],
      };
    },
    methods: {
      togglePreviews() {
        this.isShowPreviews = !this.isShowPreviews;
      },
      togglePage() {
        this.pageExtended = !this.pageExtended;
      },
      toggleSorting(value) {
        this.sortOpen = value;
      },
      show(num) {
        if (num === 'all') {
          this.numberOfPreviews = 'all';
          this.showPreviews = [...this.promotionStatistics.previewsStatistics.previews];
          return;
        }
        this.numberOfPreviews = num;
        this.showPreviews = [...this.promotionStatistics.previewsStatistics.previews].splice(0, num);
      },
      search(value) {
        this.isShowPreviews = true;
        this.showPreviews = [
          ...this.promotionStatistics.previewsStatistics.previews.filter(el => el.previewName.includes(value)),
        ].splice(0, this.numberOfPreviews);
      },
      sortItemsBy(value) {
        this.sortOpen = false;
        this.showPreviews = sortBy(this.showPreviews, `actions[${value}]`);
        this.sortedPageStatistics = sortBy(this.sortedPageStatistics, `${value}`);
      },
    },
  };
</script>

<style scoped lang="scss">
    @import '../../assets/styles/table-scrollbar';
    .table-view {
        display: flex;
        flex-direction: column;
        font-size: $font-size-m;
        margin-bottom: 74px;
        line-height: 1;
        .table-body.show-20 {
            & > .table-row:nth-child(n + 20) {
                display: none;
            }
        }
        .table-body.show-50 {
            & > .table-row:nth-child(n + 50) {
                display: none;
            }
        }
        .table-body.show-100 {
            & > .table-row:nth-child(n + 100) {
                display: none;
            }
        }
        .table-row > div,
        .table-head > div {
            flex-shrink: 0;
        }
        .table-row > div {
            word-break: break-word;
        }
        .hovered {
            cursor: pointer;
            position: relative;
            &:after {
                font: 14px/14px FontAwesome;
                content: '\f103';
                position: absolute;
                color: #bfbfbf;
                margin-left: 8px;
                top: 50%;
                transform: translate(0px, -50%);
            }
        }
        .fa-caret-down {
            margin-left: 6px;
        }
        .interestsCTR {
            width: 70px;
            margin-right: 4px;
        }
        .transitionsCTR {
            width: 73px;
            margin-right: 4px;
        }
        .actionsCTR {
            width: 43px;
            margin-right: 4px;
        }
        .paymentsCTR {
            width: 49px;
        }
        .transition {
            width: 77px;
            margin-right: 13px;
        }
        .interest {
            width: 72px;
            margin-right: 10px;
        }
        .registration {
            width: 75px;
            margin-right: 10px;
        }
        .view {
            width: 60px;
            margin-right: 13px;
        }
        .payment {
            width: 65px;
            margin-right: 10px;
        }
        .unpayment {
            width: 84px;
            margin-right: 4px;
        }
        .name {
            width: 114px;
            text-align: left;
        }
        .bold {
            font-weight: bold;
        }
        .table-head {
            margin-top: 48px;
            margin-bottom: 23px;
            display: flex;
            color: $azure;
            width: fit-content;
            &:hover {
                cursor: pointer;
            }
        }
        .table-row {
            display: flex;
            margin: 0 -15px;
            min-height: 35px;
            align-items: center;
            padding: 0 15px;
            width: fit-content;
            &:nth-child(even) {
                background-color: #f5f5f5;
            }
            &:hover {
                cursor: pointer;
                background-color: #e6e6e6;
            }
        }
    }
    @media #{$screen-and-down} {
        .table-view {
            width: 739px;
            overflow: auto;
            margin: 0 -10px 38px;
            > div {
                padding: 0 10px;
            }
        }
    }
    @media #{$small-screen-and-down} {
        .table-view {
            width: 562px;
            overflow: auto;
        }
    }
    @media #{$tablet-and-down} {
        .table-view {
            width: calc(100% + 20px);
            overflow: auto;
        }
    }
    @media #{$small-tablet-and-down} {
        .table-view {
            margin-bottom: 53px;
            .table-head {
                margin-top: 22px;
            }
        }
    }
    @media #{$big-mobile-and-down} {
        .table-view {
            margin-bottom: 34px;
        }
    }
</style>
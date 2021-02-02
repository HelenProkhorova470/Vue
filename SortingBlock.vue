<template>
    <div class="sorting">
        <div class="search">
            <input class="search-field" v-model="search" @keyup.enter="searchValue" />
            <i class="fas fa-search" @click="searchValue" />
        </div>
        <div class="sorting relative">
            <div @click="toggleSorting" class="selector"> Сортировать по... <i class="fas fa-sort-down"></i> </div>
            <div class="sort-list" v-if="sortOpen" v-click-outside="toggleSorting">
                <div class="sort-type" v-for="item in sortValues" :key="item.type" @click="sortBy(item.type)">{{
                    item.ru
                    }}</div>
            </div>
        </div>
        <pagination @show="show" :number="numberOfStatistics" className="statistics pagination" />
    </div>
</template>

<script>
  import Pagination from '@/components/Common/Pagination';
  export default {
    name: 'SortingBlock',
    components: {Pagination},
    props: {
      numberOfStatistics: {
        required: true,
      },
      sortValues: {
        required: true,
      },
      sortOpen: {
        required: true,
      },
    },
    data() {
      return {
        search: '',
      };
    },
    methods: {
      searchValue() {
        this.$emit('search', this.search);
      },
      sortBy(type) {
        this.$emit('sort-by', type);
      },
      show(value) {
        this.$emit('show', value);
      },
      toggleSorting() {
        this.$emit('toggle-sort', !this.sortOpen);
      },
    },
  };
</script>

<style scoped lang="scss">
    .selector {
        cursor: pointer;
        color: $azure;
        margin-top: -5px;
        .fa-sort-down {
            color: #737373;
            margin-left: 16px;
        }
    }
    .sort-list {
        text-align: left;
        position: absolute;
        bottom: 28px;
        background-color: white;
        z-index: 1;
        cursor: pointer;
        right: 0;
        left: 0;
        border: 1px solid $grey;
        border-radius: 5px;
        .sort-type {
            padding: 2px 7px;
            &:hover {
                color: $bright-sky-blue;
            }
        }
    }
    .sorting {
        display: flex;
        align-items: center;
    }
    .search {
        margin-right: auto;
        width: 262px;
        border: solid 1px #898989;
        border-radius: 5px;
        position: relative;
        height: 32px;
        padding-right: 25px;
        padding-left: 7px;
        .search-field {
            outline: none;
            width: 100%;
            height: 100%;
        }
        .fa-search {
            position: absolute;
            right: 5px;
            top: 7px;
            color: #737373;
            cursor: pointer;
        }
    }
    @media #{$screen-and-down} {
        .search {
            width: 212px;
        }
        .selector {
            font-size: $font-size-m;
        }
    }
    @media #{$small-screen-and-down} {
        .search {
            width: 186px;
            margin-right: 25px;
        }
        .selector .fa-sort-down {
            margin-left: 2px;
        }
    }
    @media #{$tablet-and-down} {
        .search {
            width: 252px;
            margin-right: auto;
        }
        .selector .fa-sort-down {
            margin-left: 5px;
        }
    }
    @media #{$small-tablet-and-down} {
        .sorting {
            flex-wrap: wrap;
        }
        .search {
            width: 292px;
            margin-right: calc(100% - 292px);
            margin-bottom: 26px;
        }
    }
    @media #{$big-mobile-and-down} {
        .search {
            width: 100%;
            margin-right: 0;
        }
    }
</style>
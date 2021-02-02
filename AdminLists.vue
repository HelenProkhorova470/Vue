<template>
    <div class="d-flex flex-column flex-grow-1">
        <router-link :to="{name: 'user-accounts'}" class="nav progress">Учетные записи пользователей</router-link>
        <router-link :to="{name: 'projects-admin'}" class="nav progress">Проекты</router-link>
        <router-link :to="{name: 'contents-admin'}" class="nav progress">Контенты</router-link>
        <router-link :to="{name: 'moderator-contents-admin'}" class="nav progress">Контенты для модератора</router-link>
        <router-link :to="{name: 'contracts-admin'}" class="nav progress">Договоры и проценты</router-link>
        <router-link :to="{name: 'acts-admin'}" class="nav">Акты</router-link>
        <router-link :to="{name: 'finances-admin'}" class="nav progress">Финансы проектов - общее</router-link>
        <router-link :to="{name: 'write-offs-admin'}" class="nav progress">Списания средств проектов</router-link>
        <router-link :to="{name: 'withdrawal-requests-admin'}" class="nav progress">Запросы на вывод средств</router-link>
        <router-link :to="{name: 'return-requests-admin'}" class="nav progress">Запросы на возврат средств</router-link>
        <router-link :to="{name: 'transactions-admin'}" class="nav ready">История транзакций в системе</router-link>
        <router-link :to="{name: 'templates-admin'}" class="nav">Шаблон договора работы с сервисом</router-link>
        <router-link :to="{name: 'return-policy-admin'}" class="nav ready">Правила возврата Соционома</router-link>
        <router-link :to="{name: 'study-policy-admin'}" class="nav ready">
            Правила изучения контента на Социономе
        </router-link>
        <router-link :to="{name: 'regulations-admin'}" class="nav ready">
            Правила пользования сервисом «Соционом»
        </router-link>
        <router-link :to="{name: 'interests-admin'}" class="nav">Справочник интересов</router-link>
        <router-link :to="{name: 'email-list-admin'}" class="nav progress">Электронные письма сервиса</router-link>
        <router-link :to="{name: 'email-templates-admin'}" class="nav progress"
        >Шаблоны Электронные письма сервиса</router-link
        >
        <!--<router-link :to="{name: 'requests-admin'}" class="nav">Логи</router-link>-->
    </div>
</template>

<script>
  export default {
    name: 'AdminLists',
  };
</script>

<style scoped lang="scss">
    .nav {
        font-size: $font-size-l;
        text-align: left;
        margin-bottom: 4px;
        &.ready {
            text-decoration: underline;
            color: $azure;
            &:hover {
                text-decoration: none;
            }
        }
        &.progress {
            text-decoration: underline;
            color: $light-orange;
            &:hover {
                text-decoration: none;
            }
        }
    }
</style>
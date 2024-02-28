<template>
  <q-layout view="hHh lpR fFf" class="overflow-hidden-y">
    <page-header></page-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay bordered>
      <left-drawer></left-drawer>
    </q-drawer>

    <!-- <q-drawer v-model="rightDrawerOpen" side="right" overlay bordered>
      <right-drawer></right-drawer>
    </q-drawer> -->

    <q-page-container class="col">
      <router-view />
    </q-page-container>

    <page-footer></page-footer>
  </q-layout>
</template>

<script setup>
import { storeToRefs } from "pinia";

import { useQuasar } from "quasar";

import { useUserStore } from "../stores/user"

import PageHeader from "../components/layout/PageHeader.vue";
import PageFooter from "../components/layout/PageFooter.vue";
import LeftDrawer from "../components/layout/LeftDrawer.vue";

const $q = useQuasar();

const user = useUserStore();
const { leftDrawerOpen } = storeToRefs(user);

</script>

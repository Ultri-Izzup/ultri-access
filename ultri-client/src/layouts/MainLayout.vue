<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title v-if="currSpace">
          {{currSpace.name}}
        </q-toolbar-title>
        <q-toolbar-title v-else>
          Ultri
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      overlay
      behavior="mobile"
      bordered
    >
      <workspace-drawer></workspace-drawer>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-grey-8 text-white">
      <q-toolbar> </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import WorkspaceDrawer from "../components/drawers/WorkspaceDrawer.vue";

import { useUltriStore } from "../stores/ultri";
const $u = useUltriStore();

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const route = useRoute();

const spaceId = ref(null);
const currSpace = ref(null);

watch(() => route.params.spaceId, async (newVal, oldVal) => {
  spaceId.value = newVal;
  currSpace.value = await $u.getSpace(newVal);
}, {immediate: true})

</script>

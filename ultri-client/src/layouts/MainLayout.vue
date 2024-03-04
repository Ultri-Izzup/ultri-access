<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <!-- <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar> -->
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
      <!-- drawer content -->
      <u-left-drawer></u-left-drawer>
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
import { ref } from "vue";

import ULeftDrawer from "../components/drawers/ULeftDrawer.vue"

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

if(window.Worker) {
    const uWorker = new Worker('./modules/ultri-worker.js');

    uWorker.onmessage = (event) => {
        console.log('DEDICATED WORKER EVENT RETURNED', event)
    }

    uWorker.postMessage({load_spaces: 'test'})
}


</script>

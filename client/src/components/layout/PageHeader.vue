<template>
  <q-header reveal bordered class="bg-primary text-white">
    <q-toolbar>
      <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

      <q-toolbar-title>
        <span class="text-h4 text-italic text-weight-bold">Ultri</span>
      </q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useUserStore } from "../../stores/user";

import HeaderLinks from "./header/HeaderLinks.vue";

const user = useUserStore();
const { rightDrawerOpen } = storeToRefs(user);

</script>

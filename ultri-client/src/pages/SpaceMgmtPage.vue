<template>
  <q-page class="flex">
    <div v-if="currSpace">
      {{ currSpace.name }}
      <!-- <div v-for="space in spaces"
            :key="space.id">
        Manage Space {{ space.name}}
      </div> -->
    </div>
    <div v-else>Loading</div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

import { liveQuery } from "dexie";
import { db } from "../dexie/db.js";
import { useObservable } from "@vueuse/rxjs";

import { useQuasar } from "quasar";

import WorkspaceMetaDialog from "../components/dialog/WorkspaceMetaDialog.vue";

import { useUltriStore } from "../stores/ultri";
const $u = useUltriStore();

const metaDialogVisible = ref(false);

const $q = useQuasar();
const route = useRoute();

const spaceId = ref(null);

const currSpace = ref(null);

// onMounted(async () => {
//   currSpace.value = $u.getSpaceObserver(spaceId);
// });

console.log(currSpace.value);

watch(() => route.params.spaceId, async (newVal, oldVal) => {
  console.log('NEW SPACE VIEW', newVal)
  // currSpace.value = $u.getSpaceObserver(spaceId);
  spaceId.value = newVal;

  currSpace.value = await $u.getSpace(newVal);

}, {immediate: true})
</script>

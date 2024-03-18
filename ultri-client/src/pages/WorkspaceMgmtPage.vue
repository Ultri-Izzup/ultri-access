<template>
  <q-page class="flex flex-center">
    Manage Workspace
  </q-page>
</template>

<script setup>
import { ref, readonly, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router"

import { useQuasar } from "quasar";

import WorkspaceMetaDialog from "../components/dialog/WorkspaceMetaDialog.vue";

import { useUltriStore } from "../stores/ultri";
const $u = useUltriStore();

const metaDialogVisible = ref(false);

const { workspaces } = storeToRefs($u, readonly);

const $q = useQuasar();
const route = useRoute();

watch(() => route.params.workspaceUid, async (newVal, oldVal) => {
  console.log('NEW WORKSPACE VIEW', newVal)
  await $u.loadWorkspace(newVal);
}, {immediate: true})

</script>

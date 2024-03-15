<template>
  <q-scroll-area class="fit">
    <q-list>
      <q-expansion-item
        label="Workspaces"
        icon="mdi-folder-open"
        clickable
        v-if="workspaces.size > 0"
        class="text-weight-bold"
      >
        <q-list bordered separator>
          <q-item
            v-for="[key, value] in workspaces"
            :key="key"
            clickable
            v-ripple
            :to="{ name: 'workspaceMgmt', params: { workspaceUid: value.uid }}"
          >
            <q-item-section>
              <!-- <q-item-label overline>NEW</q-item-label> -->
              <q-item-label class="ellipsis text-weight-regular">{{ value.name }}</q-item-label>
              <q-item-label caption class="ellipsis">{{ value.description }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
      <q-separator></q-separator>
      <q-item clickable v-ripple @click="metaDialogVisible = true" class="text-weight-bold">
        <q-item-section avatar>
          <q-icon name="mdi-folder-plus"></q-icon>
        </q-item-section>
        <q-item-section> Create Workspace </q-item-section>
      </q-item>
      <q-separator></q-separator>
    </q-list>
    <workspace-meta-dialog
      v-model="metaDialogVisible"
      mode="create"
      @workspace="(workspace) => $u.saveWorkspace(workspace)"
    ></workspace-meta-dialog>
  </q-scroll-area>
</template>

<script setup>
import { ref, onMounted, readonly } from "vue";
import { storeToRefs } from "pinia";

import { useQuasar } from "quasar";

import WorkspaceMetaDialog from "../../components/dialog/WorkspaceMetaDialog.vue";

import { useUltriStore } from "../../stores/ultri";
const $u = useUltriStore();

const metaDialogVisible = ref(false);

const { workspaces } = storeToRefs($u, readonly);

const $q = useQuasar();

onMounted(async () => {
  console.log("WORKER ENABLED?", $u.workerEnabled);
  await $u.loadWorkspaces();
  console.log("WORKSPACES LOADED", $u.workspaces);
});
</script>

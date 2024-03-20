<template>
  <q-scroll-area class="fit">
    <q-list>
      <q-expansion-item
        label="Spaces"
        icon="mdi-folder-open"
        clickable
        v-if="$u.spaces && $u.spaces.length > 0"
        class="text-weight-bold"
      >
        <q-list bordered >
          <q-item
            v-for="space in $u.spaces"
            :key="space.id"
            clickable
            v-ripple
            :to="{ name: 'spaceMgmt', params: { spaceId: space.id }}"
          >
            <q-item-section>
              <q-item-label class="ellipsis text-weight-regular">{{ space.name }}</q-item-label>
              <q-item-label caption class="ellipsis">{{ space.description }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
      <q-separator></q-separator>
      <q-item clickable v-ripple @click="metaDialogVisible = true" class="text-weight-bold">
        <q-item-section avatar>
          <q-icon name="mdi-folder-plus"></q-icon>
        </q-item-section>
        <q-item-section> Create Space </q-item-section>
      </q-item>
      <q-separator></q-separator>
    </q-list>
    <workspace-meta-dialog
      v-model="metaDialogVisible"
      mode="create"
      @space="createSpace"
    ></workspace-meta-dialog>
  </q-scroll-area>
</template>

<script setup>
import { ref, onMounted, readonly } from "vue";
import { storeToRefs } from "pinia";

import { useQuasar } from "quasar";

import WorkspaceMetaDialog from "../../components/dialog/WorkspaceMetaDialog.vue";

import { useUltriStore } from "../../stores/ultri";
import { useRouter } from "vue-router";
const $u = useUltriStore();

const metaDialogVisible = ref(false);

const router = useRouter();

// const { workspaces } = storeToRefs($u, readonly);

const $q = useQuasar();

const createSpace = async (space) => {
  const spaceId = await $u.createSpace(space);
  router.push({name: "spaceMgmt", params: { spaceId: spaceId }})
}

// onMounted(async () => {
//   console.log("WORKER ENABLED?", $u.workerEnabled);
//   // await $u.loadWorkspaces();
//   // console.log("WORKSPACES LOADED", $u.workspaces);
// });
</script>

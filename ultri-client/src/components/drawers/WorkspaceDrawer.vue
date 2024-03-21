<template>
  <q-scroll-area class="fit">
    <q-list style="max-width: 300px">
      <q-expansion-item
        v-model="spaceExpanded"
        v-if="spaceId"
        group="mainMenu"
        label="Current Space"
        icon="mdi-view-dashboard-variant"
        clickable
        class="ellipsis text-h6 text-weight-bold"
        header-class="bg-grey-3"
      >
        <q-list v-if="currSpace" bordered separator class="text-body1">
          <q-item>
            <q-item-section>
              <div class="fullwidth text-bold">{{ currSpace.name }}</div>
              <div class="fullwidth">{{ currSpace.description }}</div>
              <div class="fullwidth text-caption row" style="max-width: 275px">
                <span>Created: {{ currSpace.createdAt }}</span
                ><q-space></q-space
                ><q-btn round size="xs" icon="mdi-pencil"></q-btn>
              </div>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-btn-dropdown label="CREATE NEW..." icon="mdi-plus">
                <q-list>
                  <q-item
                    clickable
                    class="q-pl-sm ellipsis text-body1"
                  >
                    <q-item-section avatar>
                      <q-icon name="mdi-bookshelf"></q-icon>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Product</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    class="q-pl-sm ellipsis text-body1"
                  >
                    <q-item-section avatar>
                      <q-icon name="mdi-view-dashboard"></q-icon>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Canvas</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    class="q-pl-sm ellipsis text-body1"
                  >
                    <q-item-section avatar>
                      <q-icon name="mdi-chart-gantt"></q-icon>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Project</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    @click="triggerNuggetDialog('circle')"
                    clickable
                    class="q-pl-sm ellipsis text-body1"
                  >
                    <q-item-section avatar>
                      <q-icon name="mdi-account-group"></q-icon>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Circle</q-item-label>
                    </q-item-section></q-item
                  >
                  <q-item
                    @click="triggerNuggetDialog('publication')"
                    clickable
                    class="q-pl-sm ellipsis text-body1"
                  >
                    <q-item-section avatar>
                      <q-icon name="mdi-book-open-variant"></q-icon>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Publication</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    @click="triggerNuggetDialog('ledger')"
                    clickable
                    class="q-pl-sm ellipsis text-body1"
                  >
                    <q-item-section avatar>
                      <q-icon name="mdi-finance"></q-icon>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Bookkeeping Ledger</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-item-section>
          </q-item>
          <q-expansion-item
            label="Products"
            icon="mdi-bookshelf"
            clickable
            class="q-pl-sm ellipsis text-body1 text-weight-medium"
          >
          </q-expansion-item>
          <q-expansion-item
            label="Canvas"
            icon="mdi-view-dashboard"
            clickable
            class="q-pl-sm ellipsis text-body1 text-weight-medium"
          >
          </q-expansion-item>
          <q-expansion-item
            label="Projects"
            icon="mdi-chart-gantt"
            clickable
            class="q-pl-sm ellipsis text-body1 text-weight-medium"
          >
          </q-expansion-item>
          <q-expansion-item
            label="Circles"
            icon="mdi-account-group"
            clickable
            class="q-pl-sm ellipsis text-body1 text-weight-medium"
          ></q-expansion-item>
          <q-expansion-item
            label="Publications"
            icon="mdi-book-open-variant"
            clickable
            class="q-pl-sm ellipsis text-body1 text-weight-medium"
          >
          </q-expansion-item>
          <q-expansion-item
            label="Bookkeeping"
            icon="mdi-finance"
            clickable
            class="q-pl-sm ellipsis text-body1 text-weight-medium"
          >
          </q-expansion-item>
        </q-list>
      </q-expansion-item>
      <q-separator></q-separator>
      <q-expansion-item
        v-model="spacesExpanded"
        group="mainMenu"
        label="Spaces"
        icon="mdi-folder-open"
        clickable
        class="ellipsis text-h6 text-weight-medium"
        header-class="bg-grey-3"
      >
        <q-list bordered separator class="text-body1">
          <q-item>
            <q-item-section>
              <q-btn
                label="Create Space"
                icon-right="mdi-folder-plus"
                @click="metaDialogVisible = true"
              ></q-btn>
            </q-item-section>
          </q-item>
          <q-item
            v-for="space in $u.spaces"
            :key="space.id"
            clickable
            v-ripple
            :to="{ name: 'spaceMgmt', params: { spaceId: space.id } }"
          >
            <q-item-section>
              <q-item-label>{{ space.name }}</q-item-label>
              <q-item-label caption>{{ space.description }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
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
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";

import WorkspaceMetaDialog from "../../components/dialog/WorkspaceMetaDialog.vue";

import { useUltriStore } from "../../stores/ultri";
const $u = useUltriStore();

const metaDialogVisible = ref(false);
const spaceExpanded = ref(false);
const spacesExpanded = ref(true);

const $q = useQuasar();
const router = useRouter();
const route = useRoute();

const createSpace = async (space) => {
  const spaceId = await $u.createSpace(space);
  router.push({ name: "spaceMgmt", params: { spaceId: spaceId } });
};

const spaceId = ref(null);
const currSpace = ref(null);

const triggerNuggetDialog = (nuggetType) => {
  console.log(`TRIGGER DIALOG FOR ${nuggetType}`)
}

watch(
  () => route.params.spaceId,
  async (newVal, oldVal) => {
    console.log(`OLD ${oldVal} -> NEW ${newVal}`);
    if (newVal) {
      spaceId.value = newVal;
      currSpace.value = await $u.getSpace(newVal);
      spaceExpanded.value = true;
    }
  },
  { immediate: true }
);
</script>

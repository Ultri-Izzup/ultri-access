<template>
  <q-scroll-area class="fit">
    <q-list>
      <template>
        {{ nugget.getWorkspaces() }}
      </template>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="mdi-folder-open"></q-icon>
          </q-item-section>
          <q-item-section>
            Open Workspace
          </q-item-section>
        </q-item>
        <q-separator></q-separator>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="mdi-folder-plus"></q-icon>
          </q-item-section>
          <q-item-section>
            Create Workspace
          </q-item-section>
        </q-item>
        <q-separator></q-separator>
    </q-list>
  </q-scroll-area>
</template>

<script setup>
import useUltriNuggets from "../../composables/UltriNuggets.js";
const nugget = useUltriNuggets();
</script>

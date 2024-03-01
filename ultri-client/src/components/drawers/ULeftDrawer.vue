<template>
  <q-scroll-area class="fit">
    <q-list>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="mdi-folder"></q-icon>
          </q-item-section>
          <q-item-section>
            Open Workspace
          </q-item-section>
        </q-item>
        <q-separator></q-separator>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="mdi-plus"></q-icon>
          </q-item-section>
          <q-item-section>
            Create Workspace
          </q-item-section>
        </q-item>
    </q-list>
  </q-scroll-area>
</template>

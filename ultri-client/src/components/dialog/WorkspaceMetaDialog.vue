<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-form>
        <q-card-section>
          <div class="text-h6">Create Workspace</div>
          <q-input label="Workspace name"></q-input>
          <q-input label="Description" autogrow></q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="onDialogCancel" color="grey-6" />
          <q-btn
            v-if="mode === 'create'"
            color="primary"
            label="Create"
            @click="onOKClick"
          />
          <q-btn v-else color="primary" label="Update" @click="onOKClick" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";

const props = defineProps({
  mode: String,
});

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits,
]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

// this is part of our example (so not required)
function onOKClick() {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  onDialogOK();
  // or with payload: onDialogOK({ ... })
  // ...and it will also hide the dialog automatically
}
</script>

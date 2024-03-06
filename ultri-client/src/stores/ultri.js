import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

// import { api } from "boot/axios";

/**
 * Ultri Worker
 */
let uWorker = null;

if(window.Worker) {
  // Create Ultri Dedicated Worker.
  // Each script or tab will have it's own copy of this worker.
  uWorker = new Worker('./modules/ultri-worker.js');
  console.log('WORKER LOADED')

  // Handle responses for each type
  uWorker.onmessage = (msg) => {

    console.log('STORE - DEDICATED WORKER EVENT RETURNED DATA \n', msg)

      // if(msg.data.load_manifest) {
      //   console.log('OPEN MANIFEST RETURNED', msg.data.load_manifest);
      // }

      if(msg.data.open_file) {
        console.log('OPEN FILE RETURNED', msg.data.open_file);
      }
  }

  // Call the worker to load the UltriManifest.json
  // uWorker.postMessage({load_manifest: true})
  // uWorker.postMessage({open_file: 'UltriManifest.json'})
}

/**
 * The Ultri store manages Ultri functionality and state.
 * It communicates with the Ultri Worker.,
 */
export const useUltriStore = defineStore("ultri", () => {

  /**
   * STATE - Store state is defined using refs.
   * These should be consumed using Pinia storeToRefs.
   * These should all be accounted for in the $reset function as well.
   */
  const ultriVersion = ref(null);


  /**
   * GETTERS - *Computed* functions become store getters
   */

  const workerEnabled = computed(() => {
    return uWorker ? true : false;
  })

  /**
   * ACTIONS - Plain arrow functions become store actions
   */
  const $reset = () => {
    ultriVersion.value = null;

  };

  /**
   * RETURN ONLY WHAT IS NEEDED EXTERNALLY
   */
  return {
    // STATE


    // GETTERS
    workerEnabled,


    // ACTIONS
    $reset,

  };
});

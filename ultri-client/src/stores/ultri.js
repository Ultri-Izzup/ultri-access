import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

// import { api } from "boot/axios";

/**
 * Initialize Ultri Worker
 */
let uWorker = null;

if(window.Worker) {
  // Create Ultri Dedicated OPFS Worker.
  // Each script or tab will have it's own copy of this worker.
  uWorker = new Worker('./modules/ultri-worker.mjs',{ type: 'module' });

  // Define handlers for each message type
  uWorker.onmessage = (msg) => {

    console.log('STORE - DEDICATED WORKER EVENT RETURNED DATA \n', msg)
    if(msg.data.read_directory) {
      console.log('READ DIRECTORY RETURNED', msg.data.read_directory);
    }
  }

  console.log('WORKER LOADED IN STORE');
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
  const workspaces = useStorage("workspaces", new Map());
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

  const loadWorkspaces = async () => {
    console.log('LOADING WORKSPACES')
    const readConf = {
      path: "/workspaces"
    }
    console.log('UWORKER', uWorker)
      uWorker.postMessage('read_directory', readConf);
  }

  const readDirectory = async (readConfigObj) => {
    const dirPath = readConfigObj.dirPath;

    console.log('READ DIRECTORY', dirPath)

  }

  const $reset = () => {
    spaces.value = new Map();
    ultriVersion.value = null;
  };

  /**
   * RETURN ONLY WHAT IS NEEDED EXTERNALLY
   */
  return {
    // STATE
    workspaces,


    // GETTERS
    workerEnabled,


    // ACTIONS
    loadWorkspaces,
    $reset,

  };
});

import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

// import { api } from "boot/axios";

/**
 * The Ultri store manages Ultri functionality and state.
 * It communicates with the Ultri Worker.,
 */
export const useUltriStore = defineStore("ultri", () => {

  const workspaceSaved = (data) => {
    console.log("WORKSPACED SAVED, UPDATING STORE", data.savedFile);

    // Use the first/only file data
    const [fileStr] = data.savedFile.values();

    const fileData = JSON.parse(fileStr);

    console.log('FILE DATA', fileData)

    const newWorkspace = new Map([[fileData.uid, fileData]]);
    console.log('FILE MAP', newWorkspace)
    workspaces.value = new Map([...workspaces.value, ...newWorkspace])
  };

  /**
   * Initialize Ultri Worker
   */
  let uWorker = null;

  if (window.Worker) {
    // Create Ultri Dedicated OPFS Worker.
    // Each script or tab will have it's own copy of this worker.
    uWorker = new Worker("./modules/ultri-worker.mjs", { type: "module" });

    // Define handlers for each message type
    uWorker.onmessage = (msg) => {
      console.log("STORE - DEDICATED WORKER EVENT RETURNED DATA \n", msg);
      console.log(`USE HANDLER ${msg.data.handler}`);

      //console.log("HANDLER", validHandlers[msg.data.handler]);

      validHandlers[msg.data.handler](msg.data);

    };

    console.log("WORKER LOADED IN STORE");
  }

  /**
   * STATE - Store state is defined using refs.
   * These should be consumed using Pinia storeToRefs.
   * These should all be accounted for in the $reset function as well.
   */
  const workspaces = useStorage("workspaces", new Map());
  const ultriVersion = ref(null);

  console.log('WTFFFFFFFFFFFFFFFFFFFFFF', workspaces)

  const workspaceRead = (data) => {

    const localData = data.directoryRead;

    const workspaceUid = localData.path.split('/')[2];

    console.log(`WORKSPACE ${workspaceUid} READ, UPDATING STORE`, data);

    const foundMeta = localData.fileData.get('meta.json');

    const objUpdate = {
      name: foundMeta.name,
      description: foundMeta.description
    }

    const updateMap = new Map([[workspaceUid, objUpdate]])
    console.log('WORKSPACES ????????????????????????????', workspaces.value)
    if(workspaces.value.has(workspaceUid)) {
      workspaces.value.set(workspaceUid, {...workspaces.value.get(workspaceUid), ...objUpdate})
      console.log('WORKSPACE FOUND')
    } else {
      console.log('NEW WORKSPACE')
    }
  };

  const validHandlers = {
    workspaceSaved: workspaceSaved,
    workspaceRead: workspaceRead,
  };

  /**
   * GETTERS - *Computed* functions become store getters
   */
  const workerEnabled = computed(() => {
    return uWorker ? true : false;
  });

  /**
   * ACTIONS - Plain arrow functions become store actions
   */

  const loadWorkspaces = async () => {
    console.log("LOADING WORKSPACES");
    const readConf = {
      path: "/workspaces",
      opts: {
        loadFiles: ['manifest.json']
      }
    };
    uWorker.postMessage("readDirectory", readConf);
  };

  const loadWorkspace = async (workspaceUid) => {
    const readConf = {
      path: `/workspaces/${workspaceUid}`,
      opts: {
        loadFiles: ['meta.json']
      }
    };
    console.log(`LOADING WORKSPACE ${workspaceUid} with config: `, readConf);
    uWorker.postMessage({ readDirectory: readConf, handler: "workspaceRead" });
  };

  // const readDirectory = async (readConf) => {
  //   const dirPath = readConf.dirPath;

  //   console.log("STORE - READ DIRECTORY", dirPath);
  // };

  const saveWorkspace = (workspaceMeta) => {
    console.log("WORKSPACE META", workspaceMeta);

    const path = `/workspaces/${workspaceMeta.uid}/meta.json`;

    const writeData = new Map([[path, workspaceMeta]]);

    console.log("WRITE DATA", writeData);
    uWorker.postMessage({ writeFiles: writeData, handler: "workspaceSaved" });
  };

  const $reset = () => {
    spaces.value = new Map();
    ultriVersion.value = null;
  };

  /**
   * RETURN ONLY WHAT IS NEEDED EXTERNALLY
   */
  return {
    // STATE
    saveWorkspace,
    workspaces,

    // GETTERS
    workerEnabled,

    // ACTIONS
    loadWorkspace,
    loadWorkspaces,
    $reset
  };
});

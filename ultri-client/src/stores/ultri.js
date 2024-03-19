import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

import { liveQuery } from "dexie";
import { db } from "../dexie/db.js";
import { useObservable } from "@vueuse/rxjs";

console.log('DEXIE DB', db.spaces)

/**
 * The Ultri store manages Ultri functionality and state.
 * It communicates with the Ultri Worker.,
 */
export const useUltriStore = defineStore("ultri", () => {

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
      console.log("DEDICATED WORKER EVENT RETURNED DATA TO ULTRI STORE \n", msg);
      console.log(`USE HANDLER ${msg.data.handler}`);

      //validHandlers[msg.data.handler](msg.data);

    };

    console.log("WORKER LOADED IN STORE");
  }

  /**
   * STATE - Store state is defined using refs.
   * These should be consumed using Pinia storeToRefs.
   * These should all be accounted for in the $reset function as well.
   */

  const spaces  = useObservable(
    liveQuery(() => db.spaces.toArray())
  )

  const validHandlers = {

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

  const createSpace = async (def) => {
    console.log('SPACE DEFINITION', def)
    const newId = await db.spaces.add({ name: def.name, description: def.description, createdAt: def.createdAt });
    console.log('NEWSPACE', newId)
    return newId;
  }


  const $reset = () => {

  };

  /**
   * RETURN ONLY WHAT IS NEEDED EXTERNALLY
   */
  return {
    // STATE
    spaces,

    // GETTERS
    workerEnabled,

    // ACTIONS
    createSpace,
    $reset
  };
});

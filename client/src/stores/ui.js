import { ref, watch, nextTick, computed } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { useQuasar, QSpinnerPie } from "quasar";
import { useStorage } from "@vueuse/core";

import { useUserStore } from "./user";

/**
 * The UI store manages UI functionality and state.
 */
export const useUIStore = defineStore("ui", () => {
  const $q = useQuasar();

  const user = useUserStore();

  const { isNew } = storeToRefs(user);

  // STATE - Store state is defined refs
  const darkMode = useStorage("darkMode", false);
  const isLoading = ref(false);
  const leftDrawerOpen = useStorage("leftDrawerOpen", false);
  const policyDialogVisible = useStorage("policyDialogVisible", false);
  const dialogPolicy = useStorage("dialogPolicy", null);
  const showConfetti = ref(false);

  // GETTERS - Computed functions become store getters
  const authenticated = computed(() => {
    console.log("UI", user.isSignedIn);
    return user.isSignedIn ? true : false;
  });

  // ACTIONS - Plain functions become store actions

  const $reset = () => {
    darkMode.value = false;
    isLoading.value = false;
    leftDrawerOpen.value = false;
  };

  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value;
    $q.dark.set(darkMode.value);
  };

  const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value;
  };

  // WATCHERS

  // Set darkMode from store/localStorage
  watch(
    () => darkMode,
    () => {
      if (darkMode.value) {
        $q.dark.set(true);
      } else {
        $q.dark.set(false);
      }
    },
    { immediate: true }
  );

  // Default loading spinner to show during async operations
  watch(
    isLoading,
    (newVal, oldVal) => {
      if (newVal) {
        $q.loading.show({
          delay: 400, // ms
          spinner: QSpinnerPie,
          backgroundColor: "grey-2",
          message: "Loading great things...",
          messageColor: "black"
        });
      } else {
        $q.loading.hide();
      }
    },
    { immediate: true }
  );

  /**
   * RETURN ONLY WHAT IS NEEDED EXTERNALLY
   */
  return {
    // STATE
    darkMode,
    isLoading,
    leftDrawerOpen,

    // GETTERS

    // ACTIONS
    toggleDarkMode,
    toggleLeftDrawer,
  };
});

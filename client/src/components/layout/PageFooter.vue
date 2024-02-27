<template>
  <q-footer reveal class="bg-grey-7 text-white">
    <q-toolbar>
      <cookie-acceptance-btn></cookie-acceptance-btn>
      <q-space></q-space>
      <legal-policy-btn></legal-policy-btn>
      <q-space></q-space>
      <q-btn :label="$t('footer.about.label')" no-caps flat dense to="/about"></q-btn>
      <q-space></q-space>
      <span>&copy; {{ $t("site.copyright.holder.short") }}</span>
    </q-toolbar>
  </q-footer>
</template>

<script setup>
import CookieAcceptanceBtn from "../buttons/CookieAcceptanceBtn.vue";
import LegalPolicyBtn from "../buttons/LegalPolicyBtn.vue";
</script>

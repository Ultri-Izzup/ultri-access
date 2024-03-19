import { boot } from 'quasar/wrappers'
import { db } from "../dexie/db";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app }) => {

  app.config.globalProperties.$db = db

})

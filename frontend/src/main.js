import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

createApp(App).use(router).use(store).mount("#app");
//App.vue=>router.js=>store.js=>el html #app
//1-Creation de l'app de vue
//2Passage par le router
//3-Passage par le store
//4-Montage de l'application sur le Dom

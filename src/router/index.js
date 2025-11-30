import { createRouter, createWebHistory } from "vue-router";
import OffersView from "../views/OffersView.vue";
import AboutView from "../views/AboutView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "offers", component: OffersView },
    { path: "/about", name: "about", component: AboutView },
  ],
});

export default router;

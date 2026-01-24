import { createRouter, createWebHistory } from "vue-router";
import OffersView from "../views/OffersView.vue";
import AboutView from "../views/AboutView.vue";
import SubscribeView from "../views/SubscribeView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "offers", component: OffersView },
    { path: "/subscribe", name: "buy", component: SubscribeView },
    { path: "/about", name: "about", component: AboutView },
  ],
});

export default router;

import { createRouter, createWebHistory } from "vue-router";
import OffersView from "../views/OffersView.vue";
import AboutView from "../views/AboutView.vue";
import SubscribeView from "../views/SubscribeView.vue";
import SubscribeEditView from "../views/SubscribeEditView.vue";
import ApiView from "../views/ApiView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "offers", component: OffersView },
    { path: "/subscribe", name: "subscribe", component: SubscribeView },
    { path: "/subscribe/:uuid", name: "subscribe-edit", component: SubscribeEditView },
    { path: "/about", name: "about", component: AboutView },
    { path: "/api", name: "api", component: ApiView },
  ],
});

export default router;

<script setup>
import { RouterLink, RouterView, useRoute } from "vue-router";
import { computed, onMounted } from "vue";
import Toast from "primevue/toast";
import { useOffersStore } from "@/stores/offers.ts";

const offersStore = useOffersStore();
const route = useRoute();
const activeRouteName = computed(() => route.name);
const { fetchOffers } = offersStore;

onMounted(() => {
  fetchOffers();
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-white via-surface to-primary-50">
    <header class="sticky top-0 z-10 border-b border-primary-100 bg-white/80 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div class="flex items-center gap-1">
          <RouterLink to="/" custom v-slot="{ navigate }">
            <div @click="navigate" class="cursor-pointer">
              <div class="text-lg font-semibold text-primary">
                AlliedExchange
              </div>
            </div>
          </RouterLink>
        </div>

        <nav class="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <RouterLink to="/" custom v-slot="{ navigate }">
            <button type="button" class="rounded-full px-4 py-2 transition hover:bg-primary-50 hover:text-primary"
              :class="{
                'bg-primary-50 text-primary': activeRouteName === 'offers',
              }" @click="navigate">
              Home
            </button>
          </RouterLink>
          <RouterLink to="/about" custom v-slot="{ navigate }">
            <button type="button" class="rounded-full px-4 py-2 transition hover:bg-primary-50 hover:text-primary"
              :class="{
                'bg-primary-50 text-primary': activeRouteName === 'about',
              }" @click="navigate">
              About
            </button>
          </RouterLink>

          <RouterLink to="/api" custom v-slot="{ navigate }">
            <button type="button" class="rounded-full px-4 py-2 transition hover:bg-primary-50 hover:text-primary"
              :class="{
                'bg-primary-50 text-primary': activeRouteName === 'api',
              }" @click="navigate">
              API
            </button>
          </RouterLink>

          <a href="https://offer-price-pi.vercel.app/login" target="_blank" rel="noopener noreferrer"
            class="rounded-full px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-primary-50 hover:text-primary border border-primary-200 hover:border-primary-300">
            Developer Login
          </a>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 pb-16 pt-10">
      <RouterView />
    </main>
    <Toast position="bottom-center" />
  </div>
</template>

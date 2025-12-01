<script setup>
import { RouterLink, RouterView, useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const activeRouteName = computed(() => route.name);
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-b from-white via-surface to-primary-50"
  >
    <header
      class="sticky top-0 z-10 border-b border-primary-100 bg-white/80 backdrop-blur"
    >
      <div
        class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4"
      >
        <div class="flex items-center gap-1">
          <RouterLink to="/" custom v-slot="{ navigate }">
            <div @click="navigate" class="cursor-pointer">
              <div class="text-lg font-semibold text-primary">
                Carbon Market Alliance
              </div>
            </div>
          </RouterLink>
        </div>

        <nav
          class="flex items-center gap-2 text-sm font-semibold text-slate-700"
        >
          <RouterLink to="/about" custom v-slot="{ navigate }">
            <button
              type="button"
              class="rounded-full px-4 py-2 transition hover:bg-primary-50 hover:text-primary"
              :class="{
                'bg-primary-50 text-primary': activeRouteName === 'about',
              }"
              @click="navigate"
            >
              About
            </button>
          </RouterLink>

          <a href="https://api.publicdomain.co.in/offers/api" target="_blank">
            <button
              type="button"
              class="rounded-full px-4 py-2 transition hover:bg-primary-50 hover:text-primary"
              :class="{
                'bg-primary-50 text-primary': activeRouteName === 'api',
              }"
              @click="openAPi"
            >
              API
            </button>
          </a>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 pb-16 pt-10">
      <RouterView />
    </main>
  </div>
</template>

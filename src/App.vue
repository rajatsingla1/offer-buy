<script setup>
import { RouterLink, RouterView, useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const activeRouteName = computed(() => route.name);
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-white via-surface to-primary-50">
    <header
      class="sticky top-0 z-10 border-b border-primary-100 bg-white/80 backdrop-blur"
    >
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div class="flex items-center gap-1">
          <div
            class="flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-soft"
          >
            <img
              src="https://www.alliedoffsets.com/wp-content/uploads/2022/07/faviconalllied.png"
              height="25"
              width="25"
              alt="AlliedOffsets logo"
            />
          </div>
          <div>
            <div class="text-lg font-semibold text-primary">AlliedOffsets</div>
          </div>
        </div>
        <nav class="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <RouterLink to="/offers" custom v-slot="{ navigate }">
            <button
              type="button"
              class="rounded-full px-4 py-2 transition hover:bg-primary-50 hover:text-primary"
              :class="{ 'bg-primary-50 text-primary': activeRouteName === 'offers' }"
              @click="navigate"
            >
              Offers
            </button>
          </RouterLink>
          <RouterLink to="/about" custom v-slot="{ navigate }">
            <button
              type="button"
              class="rounded-full px-4 py-2 transition hover:bg-primary-50 hover:text-primary"
              :class="{ 'bg-primary-50 text-primary': activeRouteName === 'about' }"
              @click="navigate"
            >
              About
            </button>
          </RouterLink>
          <RouterLink to="/api" custom v-slot="{ navigate }">
            <button
              type="button"
              class="rounded-full px-4 py-2 transition hover:bg-primary-50 hover:text-primary"
              :class="{ 'bg-primary-50 text-primary': activeRouteName === 'api' }"
              @click="navigate"
            >
              API
            </button>
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 pb-16 pt-10">
      <RouterView />
    </main>
  </div>
</template>

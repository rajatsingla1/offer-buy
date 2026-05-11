<template>
  <section class="mt-16">
    <div class="mb-8">
      <h2 class="text-3xl font-semibold text-ink">AlliedCredits FAQs</h2>
    </div>

    <div class="flex mb-10">
      <div class="inline-flex flex-wrap gap-1 rounded-full bg-primary-50/70 p-1.5 ring-1 ring-primary-100">
        <button v-for="(section, index) in sections" :key="section.title" type="button"
          class="relative rounded-full px-4 py-2 text-sm font-medium transition-colors" :class="activeIndex === index
              ? 'text-ink'
              : 'text-slate-600 hover:text-ink'
            " @click="setActive(index)">
          {{ section.title }}
          <span v-if="activeIndex === index"
            class="absolute left-4 right-4 bottom-1 h-0.5 bg-primary rounded-full"></span>
        </button>
      </div>
    </div>

    <div class="card p-6 sm:p-10">
      <ul class="divide-y divide-dashed divide-slate-200">
        <li v-for="(item, qIndex) in activeSection.items" :key="qIndex" class="py-5">
          <button type="button" class="flex w-full items-start justify-between gap-6 text-left" @click="toggle(qIndex)">
            <span class="text-base sm:text-lg font-medium text-ink">
              {{ item.q }}
            </span>
            <span class="shrink-0 text-2xl leading-none text-slate-500 transition-transform"
              :class="{ 'rotate-45': openIndex === qIndex }">
              +
            </span>
          </button>
          <div v-if="openIndex === qIndex" class="mt-3 space-y-3 text-slate-600">
            <template v-for="(part, pIndex) in toParts(item.a)" :key="pIndex">
              <p v-if="typeof part === 'string'" class="leading-relaxed">
                {{ part }}
              </p>
              <ul v-else class="list-disc pl-6 space-y-1.5 leading-relaxed">
                <li v-for="(b, bIndex) in part.bullets" :key="bIndex">
                  {{ b }}
                </li>
              </ul>
            </template>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { faqSections } from "../composables/faqData.js";

const sections = faqSections;
const activeIndex = ref(0);
const openIndex = ref(-1);

const activeSection = computed(() => sections[activeIndex.value]);

function setActive(index) {
  activeIndex.value = index;
  openIndex.value = -1;
}

function toggle(qIndex) {
  openIndex.value = openIndex.value === qIndex ? -1 : qIndex;
}

function toParts(answer) {
  if (Array.isArray(answer)) return answer;
  return [answer];
}
</script>

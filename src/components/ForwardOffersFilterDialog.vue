<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    header="Filters"
    :style="{ width: '32rem' }"
    :dismissable-mask="true"
    class="filter-dialog"
    @hide="emit('update:visible', false)"
  >
    <div class="flex flex-col gap-4 text-sm">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="font-medium text-slate-700">Offer price range</label>
          <div class="flex items-center gap-2">
            <InputNumber
              v-model="local.priceMin"
              :min="0"
              :min-fraction-digits="0"
              :max-fraction-digits="2"
              placeholder="Min"
              class="flex-1 filter-input text-sm"
            />
            <span class="text-slate-400">–</span>
            <InputNumber
              v-model="local.priceMax"
              :min="0"
              :min-fraction-digits="0"
              :max-fraction-digits="2"
              placeholder="Max"
              class="flex-1 filter-input text-sm"
            />
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <label class="font-medium text-slate-700">Vintages</label>
        <div class="flex items-center gap-2">
          <InputNumber
            v-model="local.vintageMin"
            :min="1990"
            :max="2100"
            :max-fraction-digits="0"
            :use-grouping="false"
            placeholder="Min"
            class="flex-1 filter-input text-sm"
          />
          <span class="text-slate-400">–</span>
          <InputNumber
            v-model="local.vintageMax"
            :min="1990"
            :max="2100"
            :max-fraction-digits="0"
            :use-grouping="false"
            placeholder="Max"
            class="flex-1 filter-input text-sm"
          />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <label class="font-medium text-slate-700">Country</label>
        <MultiSelect
          v-model="local.countries"
          :options="countryOptions"
          placeholder="All"
          filter
          show-clear
          class="w-full filter-multiselect text-sm"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label class="font-medium text-slate-700">Registry Stage</label>
        <MultiSelect
          v-model="local.registryStages"
          :options="registryStageOptions"
          placeholder="All"
          filter
          show-clear
          class="w-full filter-multiselect text-sm"
        />
      </div>
    </div>
    <template #footer>
      <Button label="Apply" @click="apply" />
      <Button
        label="Clear all"
        severity="secondary"
        outlined
        @click="clearAll"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import MultiSelect from "primevue/multiselect";
import {
  defaultForwardCriteria,
  getUniqueForwardCountries,
  getUniqueRegistryStages,
} from "../composables/forwardOffersFilter.js";

const props = defineProps({
  visible: { type: Boolean, default: false },
  criteria: { type: Object, required: true },
  offers: { type: Array, default: () => [] },
});

const emit = defineEmits(["update:visible", "update:criteria", "applied"]);

const isVisible = computed({
  get: () => props.visible,
  set: (v) => emit("update:visible", v),
});

const countryOptions = computed(() => getUniqueForwardCountries(props.offers));
const registryStageOptions = computed(() =>
  getUniqueRegistryStages(props.offers),
);

const local = ref({ ...defaultForwardCriteria() });

function syncFromCriteria() {
  local.value = {
    priceMin: props.criteria.priceMin ?? null,
    priceMax: props.criteria.priceMax ?? null,
    vintageMin: props.criteria.vintageMin ?? null,
    vintageMax: props.criteria.vintageMax ?? null,
    countries: props.criteria.countries ? [...props.criteria.countries] : [],
    registryStages: props.criteria.registryStages
      ? [...props.criteria.registryStages]
      : [],
  };
}

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      syncFromCriteria();
    }
  },
  { immediate: true },
);

function apply() {
  emit("update:criteria", { ...local.value });
  emit("applied");
  emit("update:visible", false);
}

function clearAll() {
  local.value = { ...defaultForwardCriteria() };
}
</script>
<style scoped>
.filter-input :deep(input) {
  font-size: 0.875rem;
}

.filter-multiselect :deep(.p-multiselect-label),
.filter-multiselect :deep(input) {
  font-size: 0.875rem;
}
</style>

<template>
  <Dialog v-model:visible="isVisible" modal header="Filters" :style="{ width: '32rem' }" :dismissable-mask="true"
    class="filter-dialog" @hide="emit('update:visible', false)">
    <div class="flex flex-col gap-4 text-sm">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="font-medium text-slate-700">Offer price range</label>
          <div class="flex items-center gap-2">
            <InputNumber v-model="local.priceMin" :min="0" :min-fraction-digits="0" :max-fraction-digits="2"
              placeholder="Min" class="flex-1 filter-input text-sm" />
            <span class="text-slate-400">–</span>
            <InputNumber v-model="local.priceMax" :min="0" :min-fraction-digits="0" :max-fraction-digits="2"
              placeholder="Max" class="flex-1 filter-input text-sm" />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-slate-700">Total offer range</label>
          <div class="flex items-center gap-2">
            <InputNumber v-model="local.totalMin" :min="0" :min-fraction-digits="0" :max-fraction-digits="0"
              placeholder="Min" class="flex-1 filter-input text-sm" />
            <span class="text-slate-400">–</span>
            <InputNumber v-model="local.totalMax" :min="0" :min-fraction-digits="0" :max-fraction-digits="0"
              placeholder="Max" class="flex-1 filter-input text-sm" />
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <label class="font-medium text-slate-700">Offer type</label>
        <div class="flex gap-6">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="local.indicative"
              class="rounded border-slate-300 text-primary focus:ring-primary" />
            <span>Indicative</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="local.firm"
              class="rounded border-slate-300 text-primary focus:ring-primary" />
            <span>Firm</span>
          </label>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <label class="font-medium text-slate-700">Country</label>
        <MultiSelect v-model="local.countries" :options="countryOptions" placeholder="All" filter show-clear
          class="w-full filter-multiselect text-sm" />
      </div>
      <div class="flex flex-col gap-2">
        <label class="font-medium text-slate-700">Method / Sector</label>
        <MultiSelect v-model="local.sectors" :options="sectorOptions" placeholder="All" filter show-clear
          class="w-full filter-multiselect text-sm" />
      </div>
      <div class="flex flex-col gap-2">
        <label class="font-medium text-slate-700">Rating (rated by)</label>
        <MultiSelect v-model="local.raters" :options="raterOptions" placeholder="All" filter show-clear
          class="w-full filter-multiselect text-sm" />
      </div>
      <div class="flex flex-col gap-2">
        <label class="font-medium text-slate-700">Removal / Avoidance</label>
        <div class="flex gap-6">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="local.avoidance"
              class="rounded border-slate-300 text-primary focus:ring-primary" />
            <span>Avoidance</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="local.removal"
              class="rounded border-slate-300 text-primary focus:ring-primary" />
            <span>Removal</span>
          </label>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <label class="font-medium text-slate-700">Eligible</label>
        <div class="flex gap-6">
          <label class="flex items-center gap-2 cursor-pointer" @click.prevent="cycleTriState('ccpEligible')">
            <input type="checkbox" ref="ccpCheckbox" :checked="local.ccpEligible === true"
              class="rounded border-slate-300 text-primary focus:ring-primary pointer-events-none" />
            <span>CCP</span>
            <span class="text-xs text-slate-400">{{ triStateLabel(local.ccpEligible) }}</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer" @click.prevent="cycleTriState('complianceEligible')">
            <input type="checkbox" ref="complianceCheckbox" :checked="local.complianceEligible === true"
              class="rounded border-slate-300 text-primary focus:ring-primary pointer-events-none" />
            <span>Compliance</span>
            <span class="text-xs text-slate-400">{{ triStateLabel(local.complianceEligible) }}</span>
          </label>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <label class="font-medium text-slate-700">CORSIA</label>
        <MultiSelect v-model="local.corsiaValues" :options="corsiaOptions" placeholder="All" filter show-clear
          class="w-full filter-multiselect text-sm" />
      </div>
    </div>
    <template #footer>
      <Button label="Apply" @click="apply" />
      <Button label="Clear all" severity="secondary" outlined @click="clearAll" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed, nextTick } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import MultiSelect from "primevue/multiselect";
import {
  defaultCriteria,
  getUniqueCountries,
  getUniqueSectors,
  getUniqueRaters,
  getUniqueCorsiaValues,
} from "../composables/offersFilter.js";

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

const countryOptions = computed(() => getUniqueCountries(props.offers));
const sectorOptions = computed(() => getUniqueSectors(props.offers));
const raterOptions = computed(() => getUniqueRaters(props.offers));
const corsiaOptions = computed(() => getUniqueCorsiaValues(props.offers));

const local = ref({ ...defaultCriteria() });

const ccpCheckbox = ref(null);
const complianceCheckbox = ref(null);

const checkboxRefs = { ccpEligible: ccpCheckbox, complianceEligible: complianceCheckbox };

function triStateLabel(val) {
  if (val === null) return "(both)";
  return val ? "(yes)" : "(no)";
}

function cycleTriState(field) {
  const cur = local.value[field];
  local.value[field] = cur === null ? true : cur === true ? false : null;
  syncIndeterminate();
}

function syncIndeterminate() {
  nextTick(() => {
    for (const [field, elRef] of Object.entries(checkboxRefs)) {
      if (elRef.value) elRef.value.indeterminate = local.value[field] === null;
    }
  });
}

function syncFromCriteria() {
  local.value = {
    priceMin: props.criteria.priceMin ?? null,
    priceMax: props.criteria.priceMax ?? null,
    totalMin: props.criteria.totalMin ?? null,
    totalMax: props.criteria.totalMax ?? null,
    indicative: props.criteria.indicative ?? true,
    firm: props.criteria.firm ?? true,
    countries: props.criteria.countries ? [...props.criteria.countries] : [],
    sectors: props.criteria.sectors ? [...props.criteria.sectors] : [],
    raters: props.criteria.raters ? [...props.criteria.raters] : [],
    avoidance: props.criteria.avoidance ?? true,
    removal: props.criteria.removal ?? true,
    ccpEligible: props.criteria.ccpEligible ?? null,
    corsiaValues: props.criteria.corsiaValues ? [...props.criteria.corsiaValues] : [],
    complianceEligible: props.criteria.complianceEligible ?? null,
  };
}

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      syncFromCriteria();
      syncIndeterminate();
    }
  },
  { immediate: true }
);

function apply() {
  emit("update:criteria", { ...local.value });
  emit("applied");
  emit("update:visible", false);
}

function clearAll() {
  local.value = { ...defaultCriteria() };
  syncIndeterminate();
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

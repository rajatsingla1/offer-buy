<template>
  <div class="mb-40">
    <section class="card relative overflow-hidden p-8">
      <div class="absolute right-10 top-10 h-24 w-24 rounded-full bg-primary-100 blur-3xl"></div>
      <div class="absolute -bottom-6 left-6 h-20 w-20 rounded-full bg-primary-50 blur-2xl"></div>
      <div class="flex flex-col gap-4">
        <p
          class="inline-flex w-fit items-center gap-2 rounded-full bg-primary-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700 ring-1 ring-primary-100">
          <span class="h-2 w-2 rounded-full bg-primary"></span>
          Live offers
        </p>
        <div class="space-y-3">
          <h1 class="text-3xl font-semibold text-ink sm:text-4xl">
            Carbon Credit Offers
          </h1>
          <p class="max-w-3xl text-lg text-slate-600">
            Review curated opportunities with clear pricing and quantities.
          </p>
        </div>
      </div>
    </section>

    <section class="mt-10 space-y-4">
      <div class="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div class="flex flex-wrap items-center gap-3">
          <button type="button" class="button-outline text-sm" @click="filterDialogVisible = true">
            Amend view for custom criteria
          </button>
          <template v-if="hasActiveFilters">
            <span class="text-sm text-slate-600">{{ filteredOffers.length }} results</span>
            <button type="button" class="text-sm text-primary-600 hover:text-primary-700 hover:underline font-medium"
              @click="resetFilters">
              Reset
            </button>
          </template>
        </div>
        <a href="https://alliedoffsets.metabaseapp.com/auth/login/password" target="_blank" rel="noopener noreferrer"
          class="text-sm text-red-600 hover:text-red-700 hover:underline">
          click for complete project detail on the AlliedOffsets database
        </a>
      </div>
      <section class="card overflow-hidden">
        <div class="relative">
          <div ref="tableScrollRef" class="max-h-[1000px] max-w-full overflow-x-auto transition-opacity"
            @scroll="onTableScroll">
            <table class="w-full min-w-max divide-y divide-primary-100 ">
              <thead class="table-header">
                <tr>
                  <th scope="col" class="max-w-[14rem] w-[14rem] whitespace-nowrap px-4 py-2.5 text-left text-sm">
                    <button type="button" class="flex flex-col items-start gap-0.5 text-left "
                      @click="toggleSort('name')">
                      <span class="inline-flex items-center gap-1">
                        <span>Name</span>
                        <span v-if="sortKey === 'name'" class="text-[0.7rem] text-slate-500">
                          {{ sortDirection === "asc" ? "↑" : "↓" }}
                        </span>
                      </span>
                      <span role="button" tabindex="0"
                        class="inline-flex items-center gap-1 text-[0.7rem] font-normal text-slate-500 hover:text-primary-700 cursor-pointer"
                        @click.stop="toggleSort('uid')" @keydown.enter.prevent="toggleSort('uid')"
                        @keydown.space.prevent="toggleSort('uid')">
                        <span>UID</span>
                        <span v-if="sortKey === 'uid'" class="text-[0.7rem] text-slate-500">
                          {{ sortDirection === "asc" ? "↑" : "↓" }}
                        </span>
                      </span>
                    </button>
                  </th>
                  <th scope="col" class="max-w-[7rem] w-[7rem] whitespace-nowrap px-4 py-2.5 text-left text-sm">
                    <button type="button" class="inline-flex items-center gap-1 " @click="toggleSort('price')">
                      <span>Offer<br />price</span>
                      <span v-if="sortKey === 'price'" class="text-[0.7rem] text-slate-500">
                        {{ sortDirection === "asc" ? "↑" : "↓" }}
                      </span>
                    </button>
                  </th>
                  <th scope="col" class="max-w-[7rem] w-[7rem] whitespace-nowrap px-4 py-2.5 text-left text-sm">
                    <button type="button" class="inline-flex items-center gap-1 " @click="toggleSort('credits')">
                      <span>Number<br />credits</span>
                      <span v-if="sortKey === 'credits'" class="text-[0.7rem] text-slate-500">
                        {{ sortDirection === "asc" ? "↑" : "↓" }}
                      </span>
                    </button>
                  </th>
                  <th scope="col" class="max-w-[7rem] w-[7rem] whitespace-nowrap px-4 py-2.5 text-left text-sm">
                    <button type="button" class="inline-flex items-center gap-1 " @click="toggleSort('total')">
                      <span>Total<br />offer</span>
                      <span v-if="sortKey === 'total'" class="text-[0.7rem] text-slate-500">
                        {{ sortDirection === "asc" ? "↑" : "↓" }}
                      </span>
                    </button>
                  </th>
                  <th scope="col" class="max-w-[7rem] w-[7rem] whitespace-nowrap px-4 py-2.5 text-left text-sm">
                    <button type="button" class="inline-flex items-center gap-1 " @click="toggleSort('type')">
                      <span>Action/<br />type*</span>
                      <span v-if="sortKey === 'type'" class="text-[0.7rem] text-slate-500">
                        {{ sortDirection === "asc" ? "↑" : "↓" }}
                      </span>
                    </button>
                  </th>
                  <th scope="col" class="max-w-[12rem] w-[12rem] whitespace-nowrap px-4 py-2.5 text-left text-sm">
                    Country/<br />Method
                  </th>
                  <th scope="col" class="max-w-[8rem] w-[8rem] whitespace-nowrap px-4 py-2.5 text-left text-sm">
                    Rating
                  </th>
                  <th scope="col" class="max-w-[6.5rem] w-[6.5rem] whitespace-nowrap px-4 py-2.5 text-left text-sm">
                    Removal/<br />avoidance
                  </th>
                  <th scope="col" class="max-w-[10rem] w-[10rem] whitespace-nowrap px-4 py-2.5 text-left text-sm">
                    Eligible
                  </th>
                  <th scope="col" class="max-w-[12rem] w-[12rem] whitespace-nowrap px-4 py-2.5 text-left text-sm">
                    Top 3 buyers
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-primary-50 bg-white">
                <tr v-for="(offer, index) in filteredOffers" :key="offerRowKey(offer, index)"
                  class="hover:bg-primary-50/40">
                  <td class="table-cell max-w-[14rem] overflow-hidden px-4 py-2.5">
                    <div class="min-w-0 truncate text-sm font-semibold text-ink" :title="[
                      offer.projectName,
                      offer.projectId,
                      'Vintage: ' + (offer.vintage || ''),
                    ]
                      .filter(Boolean)
                      .join('\n')
                      ">
                      {{ offer.projectName }}
                    </div>
                    <p class="mt-0.5 min-w-0 truncate text-xs text-slate-600" :title="offer.projectId">
                      {{ offer.projectId }}
                    </p>
                    <p class="mt-0.5 min-w-0 truncate text-xs text-slate-600"
                      :title="'Vintage: ' + (offer.vintage || '')">
                      Vintage: {{ offer.vintage }}
                    </p>
                  </td>
                  <td class="table-cell max-w-[5rem] overflow-hidden px-4 py-2.5 text-sm">
                    <span class="block min-w-0 truncate font-semibold text-primary" :title="'$' + Number(offer.pricePerCredit).toFixed(2).toLocaleString()
                      ">
                      ${{ Number(offer.pricePerCredit).toFixed(2).toLocaleString() }}
                    </span>
                  </td>
                  <td class="table-cell max-w-[5rem] overflow-hidden px-4 py-2.5 text-sm">
                    <span class="block min-w-0 truncate font-semibold text-primary" :title="String(
                      offer.creditsToOffer?.toLocaleString?.() ??
                      offer.creditsToOffer,
                    )
                      ">
                      {{
                        offer.creditsToOffer?.toLocaleString?.() ??
                        offer.creditsToOffer
                      }}
                    </span>
                  </td>
                  <td class="table-cell max-w-[6rem] overflow-hidden px-4 py-2.5 text-sm">
                    <span class="block min-w-0 truncate font-semibold text-ink" :title="'$' +
                      Math.round(
                        Number(offer.creditsToOffer) *
                        Number(offer.pricePerCredit)
                      ).toLocaleString()
                      ">
                      ${{
                        Math.round(
                          Number(offer.creditsToOffer) *
                          Number(offer.pricePerCredit)
                        ).toLocaleString()
                      }}
                    </span>
                  </td>
                  <td class="table-cell max-w-[6rem] overflow-hidden px-4 py-2.5 text-right">
                    <button type="button" class="button-primary text-sm" @click="openBuyDialog(offer)">
                      Buy
                    </button>
                    <div class="text-amber-600 text-xs mt-0.5">Indicative</div>
                  </td>
                  <td class="table-cell max-w-[12rem] overflow-hidden px-4 py-2.5 text-sm">
                    <div class="min-w-0 truncate" :title="offer.countries ?? '—'">
                      {{ offer.countries ?? "—" }}
                    </div>
                    <div class="min-w-0 truncate text-slate-600" :title="offer.sectors ?? '—'">
                      {{ offer.sectors ?? "—" }}
                    </div>
                  </td>
                  <td class="table-cell max-w-[10rem] overflow-hidden px-4 py-2.5 text-sm !whitespace-break-spaces">
                    <div class="min-w-0" :title="offer.raters ?? '—'">
                      <template v-if="offer.raters">
                        <div v-for="(item, i) in commaBreakItems(offer.raters)" :key="i">
                          {{ item.text }}{{ item.comma }}
                        </div>
                      </template>
                      <span v-else>—</span>
                    </div>
                  </td>
                  <td class="table-cell max-w-[6.5rem] overflow-hidden px-4 py-2.5 text-sm">
                    <span class="block min-w-0 truncate" :title="formatOffsetType(offer.project_offset_type)">
                      {{ formatOffsetType(offer.project_offset_type) }}
                    </span>
                  </td>
                  <td class="table-cell max-w-[7.5rem] overflow-hidden px-4 py-2.5 text-sm">
                    <div class="min-w-0" :title="'CCP: ' +
                      (offer.ccp ? 'Yes' : 'No') +
                      ', Compliance: ' +
                      (offer.compliance ? 'Yes' : 'No')
                      ">
                      <div>CCP: {{ offer.ccp ? "Yes" : "No" }}</div>
                      <div>
                        CORSIA:
                        {{ offer.corsia_phase_eligibility ? " Yes" : "No" }} </div>
                      <div class="min-w-0 truncate">
                        Compliance: {{ offer.compliance ? "Yes" : "No" }}
                      </div>
                    </div>
                  </td>
                  <td class="table-cell max-w-[12rem] overflow-hidden px-4 py-2.5 text-sm !whitespace-break-spaces">
                    <div class="min-w-0" :title="offer.top_3_buyers ?? '—'">
                      <template v-if="offer.top_3_buyers">
                        <div v-for="(item, i) in commaBreakItems(
                          offer.top_3_buyers,
                        )" :key="i">
                          {{ item.text }}{{ item.comma }}
                        </div>
                      </template>
                      <span v-else>—</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Transition name="fade">
            <div v-show="showSwipeIndicator"
              class="pointer-events-none absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/85 px-3 py-1.5 text-xs font-medium text-primary-700 shadow-sm ring-1 ring-primary-200/60 backdrop-blur-sm"
              aria-hidden="true">
              Swipe →
            </div>
          </Transition>
        </div>
      </section>
    </section>

    <Dialog v-model:visible="buyDialogVisible" modal header="Bidding" :style="{ width: '28rem' }"
      :dismissable-mask="true" class="buy-dialog" @hide="resetBuyForm">
      <template v-if="selectedOffer">
        <p class="text-slate-700 mb-4">
          You are expressing an interest to buy
          <strong>{{ formatCredits(buyForm.credits) }} credits</strong>
          of {{ selectedOffer.projectName }} vintage
          {{ selectedOffer.vintage }} at
          <strong>${{ formatPrice(buyForm.price) }}</strong>.
        </p>
        <p class="text-slate-700 mb-4">
          Your indication of interest will be emailed to the party offering the
          credits for sale and the administrator of this site.
        </p>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label for="buy-credits" class="text-sm font-medium text-slate-700">Credits</label>
            <InputNumber id="buy-credits" v-model="buyForm.credits" :min="0" :max-fraction-digits="0" class="w-full" />
          </div>
          <div class="flex flex-col gap-2">
            <label for="buy-price" class="text-sm font-medium text-slate-700">Price per credit ($)</label>
            <InputNumber id="buy-price" v-model="buyForm.price" :min="0" :min-fraction-digits="2"
              :max-fraction-digits="2" mode="currency" currency="USD" locale="en-US" class="w-full" />
          </div>
          <div class="flex flex-col gap-2">
            <label for="buy-email" class="text-sm font-medium text-slate-700">Email address</label>
            <InputText id="buy-email" v-model="buyForm.email" type="email" placeholder="your.email@example.com"
              class="w-full" />
          </div>
          <div class="flex flex-col gap-2">
            <label for="buy-phone" class="text-sm font-medium text-slate-700">Phone(optional)</label>
            <InputText id="buy-phone" v-model="buyForm.phone" type="tel" placeholder="123-456-7890" class="w-full" />
          </div>
        </div>
      </template>
      <template #footer>
        <Button label="Confirm" :loading="submitLoading" @click="handleBuyConfirm" />
      </template>
    </Dialog>

    <OffersFilterDialog v-model:visible="filterDialogVisible" v-model:criteria="filterCriteria" :offers="offers"
      @applied="onFiltersApplied" />

    <div class="text-slate-600 mt-10">
      <RouterLink to="/subscribe"><span class="underline cursor-pointer">Click here</span></RouterLink>
      if you would like email alerts for new prices/projects or periodic email
    </div>
    <div class="text-slate-600 mt-4">
      <a href="mailto:lars.kroijer@alliedoffsets.com?subject=Credits Buy - Project Developer" target="_blank"><span
          class="underline cursor-pointer">Click here</span></a>
      if you are a project developer and want to list credits on this site (plus
      other distribution channels including API, and emails)
    </div>
    <div class="text-slate-600 mt-4">
      <a href="mailto:lars.kroijer@alliedoffsets.com?subject=Credits Buy - Other Credits" target="_blank"><span
          class="underline cursor-pointer">Click here</span></a>
      if you are interested in other credits and we will try to put you in touch with a potential broker or seller
    </div>
    <div class="text-slate-600 mt-4">
      <router-link to="/api" target="_blank"><span class="underline cursor-pointer">Click here</span></router-link>
      if you want access to data via API
    </div>

    <div class="mt-10 text-slate-600">
      <Accordion>
        <AccordionPanel value="terms">
          <AccordionHeader>T&Cs</AccordionHeader>
          <AccordionContent>
            <p class="">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text ever
              since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book. It has survived not only five
              centuries, but also the leap into electronic typesetting, remaining
              essentially unchanged.
            </p>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>
    <div class="text-slate-600 text-xs mt-4">
      <p>
        *an “indicative” offer means that the final agreement on price/quantity is subject to agreement with the seller
        (we
        put you in touch, but we are not involved with the negotiations). A “firm” offer means that a 3rd party has
        reserved
        the credits and unless the offer is modified then they are available at that price (subject to potential
        transaction
        costs).
      </p>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, nextTick, computed } from "vue";
import { RouterLink } from "vue-router";
import { storeToRefs } from "pinia";
import { useOffersStore } from "../stores/offers";
import { useToast } from "primevue/usetoast";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
import OffersFilterDialog from "../components/OffersFilterDialog.vue";
import { defaultCriteria, filterOffers, hasActiveFilters as checkHasActiveFilters, splitByComma } from "../composables/offersFilter.js";

const toast = useToast();
const offersStore = useOffersStore();
const { offers } = storeToRefs(offersStore);

const sortKey = ref(null);
const sortDirection = ref("asc");
const filterDialogVisible = ref(false);
const filterCriteria = ref(defaultCriteria());


const sortedOffers = computed(() => {
  const list = offers.value;
  if (!list || !Array.isArray(list)) return [];
  if (!sortKey.value) return [...list];

  const getNumeric = (val) => {
    const n = Number(val);
    return Number.isFinite(n) ? n : 0;
  };
  const total = (offer) =>
    getNumeric(offer.creditsToOffer) * getNumeric(offer.pricePerCredit);
  const typeStr = (offer) =>
    formatOffsetType(offer.project_offset_type || "")
      .toString()
      .toLowerCase();

  const dir = sortDirection.value === "asc" ? 1 : -1;
  const key = sortKey.value;

  return [...list].sort((a, b) => {
    let av;
    let bv;
    let numeric = false;
    switch (key) {
      case "name":
        av = (a.projectName || "").toString().toLowerCase();
        bv = (b.projectName || "").toString().toLowerCase();
        break;
      case "uid":
        av = (a.projectId || "").toString().toLowerCase();
        bv = (b.projectId || "").toString().toLowerCase();
        break;
      case "price":
        av = getNumeric(a.pricePerCredit);
        bv = getNumeric(b.pricePerCredit);
        numeric = true;
        break;
      case "credits":
        av = getNumeric(a.creditsToOffer);
        bv = getNumeric(b.creditsToOffer);
        numeric = true;
        break;
      case "total":
        av = total(a);
        bv = total(b);
        numeric = true;
        break;
      case "type":
        av = typeStr(a);
        bv = typeStr(b);
        break;
      default:
        return 0;
    }

    if (numeric) {
      if (av !== bv) return av > bv ? dir : -dir;
    } else {
      const cmp = String(av).localeCompare(String(bv));
      if (cmp !== 0) return cmp * dir;
    }
    // Tie-breaker: keep order stable by comparing name then id
    const nameCmp = (a.projectName || "").localeCompare(b.projectName || "");
    if (nameCmp !== 0) return nameCmp * dir;
    return (a.projectId || "").localeCompare(b.projectId || "") * dir;
  });
});

const filteredOffers = computed(() =>
  filterOffers(sortedOffers.value, filterCriteria.value)
);

const hasActiveFilters = computed(() => checkHasActiveFilters(filterCriteria.value));

function onFiltersApplied() {
  toast.add({
    severity: "success",
    summary: "View updated",
    life: 3000,
  });
}

function resetFilters() {
  filterCriteria.value = defaultCriteria();
}

function toggleSort(key) {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortDirection.value = "asc";
  }
}

function offerRowKey(offer, index) {
  if (offer.orderId != null) return String(offer.orderId);
  if (offer.id != null) return String(offer.id);
  if (offer.serial != null) return String(offer.serial);
  return `row-${offer.projectId ?? ""}-${offer.projectName ?? ""}-${offer.vintage ?? ""}-${index}`;
}

const tableScrollRef = ref(null);
const showSwipeIndicator = ref(true);
const SWIPE_HIDE_THRESHOLD = 20;

function onTableScroll() {
  const el = tableScrollRef.value;
  if (!el) return;
  if (el.scrollLeft >= SWIPE_HIDE_THRESHOLD) {
    showSwipeIndicator.value = false;
  }
}

function updateSwipeIndicatorVisibility() {
  const el = tableScrollRef.value;
  if (!el) return;
  const canScroll = el.scrollWidth > el.clientWidth;
  if (!canScroll) {
    showSwipeIndicator.value = false;
  } else if (el.scrollLeft >= SWIPE_HIDE_THRESHOLD) {
    showSwipeIndicator.value = false;
  } else {
    showSwipeIndicator.value = true;
  }
}

onMounted(updateSwipeIndicatorVisibility);
watch(offers, () => nextTick(updateSwipeIndicatorVisibility), {
  immediate: false,
});

const buyDialogVisible = ref(false);
const selectedOffer = ref(null);
const submitLoading = ref(false);
const buyForm = ref({
  credits: null,
  price: null,
  email: "",
  phone: "",
});

function formatOffsetType(val) {
  if (!val || typeof val !== "string") return "—";
  const s = val.toLowerCase();
  if (s.includes("removal")) return "removal";
  if (s.includes("avoidance") || s.includes("reduction")) return "avoidance";
  return val;
}

function uniqueItems(arr) {
  return [...new Set(arr)];
}

function commaBreakItems(val) {
  let arr = splitByComma(val);
  arr = uniqueItems(arr);
  return arr.map((text, i) => ({ text, comma: i < arr.length - 1 ? "," : "" }));
}

function formatCredits(val) {
  if (val == null) return "—";
  return Number(val).toLocaleString();
}

function formatPrice(val) {
  if (val == null) return "—";
  return Number(val).toFixed(2);
}

function openBuyDialog(offer) {
  selectedOffer.value = offer;
  const credits = Number(offer.creditsToOffer);
  const price = Number(offer.pricePerCredit);
  buyForm.value = {
    credits: Number.isFinite(credits) ? credits : 0,
    price: Number.isFinite(price) ? price : 0,
    email: "",
    phone: "",
  };
  buyDialogVisible.value = true;
}

function resetBuyForm() {
  selectedOffer.value = null;
  submitLoading.value = false;
  buyForm.value = { credits: null, price: null, email: "", phone: "" };
}

function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  const s = email.trim();
  return (
    s.includes("@") && s.includes(".") && s.indexOf("@") < s.lastIndexOf(".")
  );
}

function validateBuyForm() {
  const errors = [];
  const credits = Number(buyForm.value.credits);
  const price = Number(buyForm.value.price);
  const available = Number(selectedOffer.value?.creditsToOffer);

  if (!Number.isFinite(credits) || credits <= 1) {
    errors.push("Credits must be greater than 1.");
  } else if (Number.isFinite(available) && credits > available) {
    errors.push(
      `Credits cannot exceed ${available.toLocaleString()} available.`,
    );
  }

  if (!Number.isFinite(price) || price <= 1) {
    errors.push("Price must be greater than $1.");
  }

  if (!isValidEmail(buyForm.value.email)) {
    errors.push("Please enter a valid email.");
  }

  return errors;
}

async function handleBuyConfirm() {
  const errors = validateBuyForm();
  if (errors.length) {
    toast.add({
      severity: "error",
      summary: "Validation failed",
      detail: errors.join(" "),
      life: 5000,
    });
    return;
  }

  submitLoading.value = true;
  try {
    const total = Number(buyForm.value.credits) * Number(buyForm.value.price);
    const payload = {
      offerId: selectedOffer.value?.id,
      orderId: selectedOffer.value?.orderId,
      serial: selectedOffer.value?.serial,
      vintage: selectedOffer.value?.vintage,
      credits: buyForm.value.credits,
      projectName: selectedOffer.value?.projectName,
      pricePerCredit: buyForm.value.price,
      total,
      projectDeveloperEmail: selectedOffer.value?.email,
      email: buyForm.value.email.trim(),
      phone: buyForm.value.phone.trim(),
    };
    await offersStore.sendOfferBid(payload);
    toast.add({
      severity: "success",
      summary: "Bid submitted",
      detail: "Your bid has been submitted successfully.",
      life: 5000,
    });
    buyDialogVisible.value = false;
  } finally {
    submitLoading.value = false;
  }
}
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

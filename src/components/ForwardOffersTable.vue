<template>
  <div>
    <div
      class="mb-3 mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2"
    >
      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          class="text-sm font-medium text-primary-700 bg-primary-50 px-3 py-1.5 rounded-full border border-primary-200 hover:bg-primary-100 hover:border-primary-300 transition-colors shadow-sm"
          @click="filterDialogVisible = true"
        >
          <span class="inline-flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polygon
                points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
              ></polygon>
            </svg>
            Amend view for custom criteria
          </span>
        </button>
        <template v-if="hasActiveFilters">
          <span class="text-sm text-slate-600"
            >{{ filteredOffers.length }} results</span
          >
          <button
            type="button"
            class="text-sm text-primary-600 hover:text-primary-700 hover:underline font-medium"
            @click="resetFilters"
          >
            Reset
          </button>
        </template>
      </div>
    </div>
    <section class="card overflow-hidden">
      <div class="relative">
        <div
          ref="tableScrollRef"
          class="max-h-[1000px] max-w-full overflow-x-auto transition-opacity"
          @scroll="onTableScroll"
        >
          <table class="w-full min-w-max divide-y divide-primary-100">
            <thead class="sticky top-0 z-1 table-header">
              <tr>
                <th
                  scope="col"
                  class="max-w-[9rem] whitespace-nowrap px-4 py-2.5 text-left text-sm"
                >
                  Project Name /<br />UID
                </th>
                <th
                  scope="col"
                  class="max-w-[7rem] whitespace-nowrap px-4 py-2.5 text-left text-sm"
                >
                  <button
                    type="button"
                    class="inline-flex items-center gap-1"
                    @click="toggleSort('vintage')"
                  >
                    <span>Vintages</span>
                    <span
                      v-if="sortKey === 'vintage'"
                      class="text-[0.7rem] text-slate-500"
                    >
                      {{ sortDirection === "asc" ? "↑" : "↓" }}
                    </span>
                  </button>
                </th>
                <th
                  scope="col"
                  class="max-w-[7rem] whitespace-nowrap px-4 py-2.5 text-left text-sm"
                >
                  <button
                    type="button"
                    class="inline-flex items-center gap-1"
                    @click="toggleSort('price')"
                  >
                    <span>Offer<br />Price</span>
                    <span
                      v-if="sortKey === 'price'"
                      class="text-[0.7rem] text-slate-500"
                    >
                      {{ sortDirection === "asc" ? "↑" : "↓" }}
                    </span>
                  </button>
                </th>
                <th
                  scope="col"
                  class="max-w-[8rem] whitespace-nowrap px-4 py-2.5 text-left text-sm"
                >
                  Action
                </th>
                <th
                  scope="col"
                  class="max-w-[10rem] whitespace-nowrap px-4 py-2.5 text-left text-sm"
                >
                  Country /<br />Methodology
                </th>
                <th
                  scope="col"
                  class="max-w-[8rem] whitespace-nowrap px-4 py-2.5 text-left text-sm"
                >
                  Credits<br />(Available/Sold)
                </th>
                <th
                  scope="col"
                  class="max-w-[10rem] whitespace-nowrap px-4 py-2.5 text-left text-sm"
                >
                  Rating /<br />Verifier
                </th>
                <th
                  scope="col"
                  class="max-w-[10rem] whitespace-nowrap px-4 py-2.5 text-left text-sm"
                >
                  Registry /<br />Stage
                </th>
                <th
                  scope="col"
                  class="max-w-[8rem] whitespace-nowrap px-4 py-2.5 text-left text-sm"
                >
                  Delivery /<br />Risk
                </th>
                <th
                  scope="col"
                  class="max-w-[9rem] whitespace-nowrap px-4 py-2.5 text-left text-sm"
                >
                  Eligible /<br />Type
                </th>
                <th
                  scope="col"
                  class="max-w-[8rem] whitespace-nowrap px-4 py-2.5 text-left text-sm"
                >
                  Contract
                </th>
                <th
                  scope="col"
                  class="max-w-[10rem] whitespace-nowrap px-4 py-2.5 text-left text-sm"
                >
                  Links
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-primary-50 bg-white">
              <tr v-if="forwardLoading">
                <td colspan="12" class="p-8 text-center text-slate-500">
                  <div class="flex items-center justify-center gap-3">
                    <svg
                      class="h-5 w-5 animate-spin text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span class="font-medium">Loading forward offers...</span>
                  </div>
                </td>
              </tr>
              <template v-else>
                <tr
                  v-for="(offer, index) in filteredOffers"
                  :key="offer.id || index"
                  class="hover:bg-primary-50/40"
                >
                  <td class="table-cell overflow-hidden px-4 py-2.5">
                    <div
                      class="min-w-0 text-sm font-semibold text-ink line-clamp-2"
                      :title="offer.projectName"
                    >
                      {{ offer.projectName || "" }}
                    </div>
                    <p
                      class="mt-0.5 min-w-0 truncate text-xs text-slate-600"
                      :title="offer.uid"
                    >
                      {{ offer.uid || "" }}
                    </p>
                  </td>
                  <td class="table-cell overflow-hidden px-4 py-2.5 text-sm">
                    <span
                      class="block min-w-0 truncate font-semibold text-ink"
                      :title="offer.vintages"
                    >
                      {{ offer.vintages || "" }}
                    </span>
                  </td>
                  <td class="table-cell overflow-hidden px-4 py-2.5 text-sm">
                    <span
                      class="block min-w-0 truncate font-semibold text-primary"
                      :title="offer.pricePerCredit"
                    >
                      {{
                        offer.pricePerCredit ? "$" + offer.pricePerCredit : ""
                      }}
                    </span>
                  </td>
                  <td class="table-cell overflow-hidden px-4 py-2.5 text-left">
                    <button
                      v-if="offer.contactEmail"
                      @click="openBuyDialog(offer)"
                      class="text-primary-700 bg-primary-50 px-3 py-1.5 rounded-3xl text-xs font-medium hover:bg-primary-100 transition-colors inline-block whitespace-nowrap"
                    >
                      Express interest
                    </button>
                  </td>
                  <td class="table-cell overflow-hidden px-4 py-2.5 text-sm">
                    <div class="min-w-0 truncate" :title="offer.country">
                      {{ offer.country || "" }}
                    </div>
                    <div
                      class="min-w-0 truncate text-slate-600"
                      :title="offer.methodology"
                    >
                      {{ offer.methodology || "" }}
                    </div>
                  </td>
                  <td class="table-cell overflow-hidden px-4 py-2.5 text-sm">
                    <template v-if="offer.creditsMode === 'estimated'">
                      <div
                        class="min-w-0 truncate"
                        :title="offer.estimatedAvailable"
                      >
                        <template v-if="offer.estimatedAvailable"
                          >Available: {{ offer.estimatedAvailable }}</template
                        >
                      </div>
                      <div
                        class="min-w-0 truncate text-slate-600"
                        :title="offer.estimatedSold"
                      >
                        <template v-if="offer.estimatedSold"
                          >Sold: {{ offer.estimatedSold }}</template
                        >
                      </div>
                    </template>
                    <template
                      v-else-if="
                        offer.creditsRows && offer.creditsRows.length > 0
                      "
                    >
                      <div class="min-w-0 truncate" title="Total Available">
                        Available:
                        {{ sumCredits(offer.creditsRows, "available") }}
                      </div>
                      <div
                        class="min-w-0 truncate text-slate-600"
                        title="Total Sold"
                      >
                        Sold: {{ sumCredits(offer.creditsRows, "sold") }}
                      </div>
                      <button
                        type="button"
                        @click="showCreditsDetails(offer)"
                        class="text-primary-600 hover:text-primary-700 hover:underline text-xs mt-1"
                      >
                        Details
                      </button>
                    </template>
                  </td>
                  <td class="table-cell overflow-hidden px-4 py-2.5 text-sm">
                    <div class="min-w-0 truncate" :title="formatRating(offer)">
                      {{ formatRating(offer) || "" }}
                    </div>
                    <div
                      class="min-w-0 truncate text-slate-600"
                      :title="offer.verifierVvb"
                    >
                      {{ offer.verifierVvb || "" }}
                    </div>
                  </td>
                  <td class="table-cell overflow-hidden px-4 py-2.5 text-sm">
                    <div class="min-w-0 truncate" :title="offer.registry">
                      {{ offer.registry || "" }}
                    </div>
                    <div
                      class="min-w-0 truncate text-slate-600"
                      :title="offer.registryStage"
                    >
                      {{ offer.registryStage || "" }}
                    </div>
                  </td>
                  <td class="table-cell overflow-hidden px-4 py-2.5 text-sm">
                    <div class="min-w-0 truncate" :title="offer.deliveryRisk">
                      {{ offer.deliveryRisk || "" }}
                    </div>
                  </td>
                  <td class="table-cell overflow-hidden px-4 py-2.5 text-sm">
                    <div
                      class="min-w-0 truncate"
                      :title="formatEligibility(offer)"
                    >
                      {{ formatEligibility(offer) || "" }}
                    </div>
                    <div
                      class="min-w-0 truncate text-slate-600"
                      :title="offer.avoidanceRemoval"
                    >
                      {{ offer.avoidanceRemoval || "" }}
                    </div>
                  </td>
                  <td class="table-cell overflow-hidden px-4 py-2.5 text-sm">
                    <template v-if="offer.defaultContractMode === 'upload'">
                      <a
                        v-if="offer.defaultContractFileLink"
                        :href="offer.defaultContractFileLink"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-primary-600 hover:text-primary-700 hover:underline"
                        >Contract File</a
                      >
                    </template>
                    <template
                      v-else-if="offer.defaultContractMode === 'template'"
                    >
                      <span v-if="offer.defaultContractTemplate === 'other'">{{
                        offer.defaultContractTemplateOther || ""
                      }}</span>
                      <span v-else class="capitalize">{{
                        offer.defaultContractTemplate
                          ? offer.defaultContractTemplate.replace("-", " ")
                          : ""
                      }}</span>
                    </template>
                  </td>
                  <td class="table-cell overflow-hidden px-4 py-2.5 text-sm">
                    <div class="flex flex-col gap-1 items-start">
                      <a
                        v-if="offer.websiteLink"
                        :href="offer.websiteLink"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-primary-600 hover:text-primary-700 hover:underline text-xs"
                        >Website</a
                      >
                      <a
                        v-if="offer.projectPdfLink"
                        :href="offer.projectPdfLink"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-primary-600 hover:text-primary-700 hover:underline text-xs"
                        >Project PDF</a
                      >
                      <a
                        v-if="offer.dueDiligenceSite"
                        :href="offer.dueDiligenceSite"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-primary-600 hover:text-primary-700 hover:underline text-xs"
                        >Due Diligence</a
                      >
                      <a
                        v-if="offer.vvbLink"
                        :href="offer.vvbLink"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-primary-600 hover:text-primary-700 hover:underline text-xs"
                        >VVB Link</a
                      >
                      <a
                        v-else-if="offer.verifierVvbLink"
                        :href="offer.verifierVvbLink"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-primary-600 hover:text-primary-700 hover:underline text-xs"
                        >VVB Link</a
                      >
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredOffers.length === 0 && !forwardLoading">
                  <td colspan="12" class="p-8 text-center text-slate-500">
                    No forward offers found.
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
        <Transition name="fade">
          <div
            v-show="showSwipeIndicator"
            class="pointer-events-none absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/85 px-3 py-1.5 text-xs font-medium text-primary-700 shadow-sm ring-1 ring-primary-200/60 backdrop-blur-sm"
            aria-hidden="true"
          >
            Swipe →
          </div>
        </Transition>
      </div>

      <!-- Credits Details Modal -->
      <Dialog
        v-model:visible="detailsDialogVisible"
        modal
        header="Credits Details"
        :style="{ width: '30rem' }"
      >
        <div v-if="selectedCreditsOffer" class="flex flex-col gap-4">
          <h3 class="font-semibold text-lg">
            {{ selectedCreditsOffer.projectName }}
          </h3>
          <table class="w-full text-sm text-left">
            <thead class="bg-primary-50">
              <tr>
                <th class="px-3 py-2 font-semibold">Vintage</th>
                <th class="px-3 py-2 font-semibold">Available</th>
                <th class="px-3 py-2 font-semibold">Sold</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="(row, idx) in selectedCreditsOffer.creditsRows"
                :key="idx"
              >
                <td class="px-3 py-2">{{ row.vintage || "—" }}</td>
                <td class="px-3 py-2">{{ row.available || "—" }}</td>
                <td class="px-3 py-2">{{ row.sold || "—" }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <template #footer>
          <div class="flex justify-start pt-2">
            <button
              type="button"
              class="button-outline text-sm px-4 py-2"
              @click="detailsDialogVisible = false"
            >
              Close
            </button>
          </div>
        </template>
      </Dialog>

      <!-- Express Interest Modal -->
      <Dialog
        v-model:visible="buyDialogVisible"
        modal
        header="Express Interest"
        :style="{ width: '28rem' }"
        :dismissable-mask="true"
        class="buy-dialog"
        @hide="resetBuyForm"
      >
        <template v-if="selectedOffer">
          <p class="text-slate-700 mb-4">
            You are expressing an interest to buy
            <strong>{{ formatCredits(buyForm.credits) }} credits</strong>
            of {{ selectedOffer.projectName }} vintage
            {{ selectedOffer.vintages }} at
            <strong>${{ formatPrice(buyForm.price) }}</strong>.
          </p>
          <p class="text-slate-700 mb-4">
            Your indication of interest will be emailed to the party offering the
            credits for sale and the administrator of this site.
          </p>
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label for="buy-credits" class="text-sm font-medium text-slate-700"
                >Credits</label
              >
              <InputNumber
                id="buy-credits"
                v-model="buyForm.credits"
                :min="0"
                :max-fraction-digits="0"
                class="w-full"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label for="buy-price" class="text-sm font-medium text-slate-700"
                >Price per credit ($)</label
              >
              <InputNumber
                id="buy-price"
                v-model="buyForm.price"
                :min="0"
                :min-fraction-digits="2"
                :max-fraction-digits="2"
                mode="currency"
                currency="USD"
                locale="en-US"
                class="w-full"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label for="buy-email" class="text-sm font-medium text-slate-700"
                >Email address</label
              >
              <InputText
                id="buy-email"
                v-model="buyForm.email"
                type="email"
                placeholder="your.email@example.com"
                class="w-full"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label for="buy-phone" class="text-sm font-medium text-slate-700"
                >Phone(optional)</label
              >
              <InputText
                id="buy-phone"
                v-model="buyForm.phone"
                type="tel"
                placeholder="123-456-7890"
                class="w-full"
              />
            </div>
          </div>
        </template>
        <template #footer>
          <Button
            label="Confirm"
            :loading="submitLoading"
            @click="handleBuyConfirm"
          />
        </template>
      </Dialog>
    </section>
    <ForwardOffersFilterDialog
      v-model:visible="filterDialogVisible"
      v-model:criteria="filterCriteria"
      :offers="forwardOffers"
      @applied="onFiltersApplied"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useToast } from "primevue/usetoast";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";
import { useOffersStore } from "../stores/offers";
import ForwardOffersFilterDialog from "./ForwardOffersFilterDialog.vue";
import {
  defaultForwardCriteria,
  hasActiveForwardFilters,
  filterForwardOffers,
} from "../composables/forwardOffersFilter.js";

const toast = useToast();
const offersStore = useOffersStore();
const { forwardOffers, forwardLoading } = storeToRefs(offersStore);

const sortKey = ref("");
const sortDirection = ref("asc");
const filterDialogVisible = ref(false);
const filterCriteria = ref(defaultForwardCriteria());

const sortedOffers = computed(() => {
  const list = forwardOffers.value;
  if (!list || !Array.isArray(list)) return [];
  if (!sortKey.value) return [...list];

  const getNumeric = (val) => {
    // try to parse ranges like 15-25, 2028-2032
    if (!val) return 0;
    const parts = String(val)
      .split("-")
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n));
    if (parts.length === 0) return 0;
    return parts[0];
  };

  const dir = sortDirection.value === "asc" ? 1 : -1;
  const key = sortKey.value;

  return [...list].sort((a, b) => {
    let av, bv;
    let numeric = false;

    switch (key) {
      case "vintage":
        av = getNumeric(a.vintages);
        bv = getNumeric(b.vintages);
        numeric = true;
        break;
      case "price":
        av = getNumeric(a.pricePerCredit);
        bv = getNumeric(b.pricePerCredit);
        numeric = true;
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

    // Stable sort
    const nameCmp = (a.projectName || "").localeCompare(b.projectName || "");
    if (nameCmp !== 0) return nameCmp * dir;
    return (a.uid || "").localeCompare(b.uid || "") * dir;
  });
});

const filteredOffers = computed(() =>
  filterForwardOffers(sortedOffers.value, filterCriteria.value),
);

const hasActiveFilters = computed(() =>
  hasActiveForwardFilters(filterCriteria.value),
);

function onFiltersApplied() {
  toast.add({
    severity: "success",
    summary: "View updated",
    life: 3000,
  });
}

function resetFilters() {
  filterCriteria.value = defaultForwardCriteria();
}

function toggleSort(key) {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortDirection.value = "asc";
  }
}

const tableScrollRef = ref(null);
const showSwipeIndicator = ref(false);
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

onMounted(() => {
  window.addEventListener("resize", updateSwipeIndicatorVisibility);
  setTimeout(updateSwipeIndicatorVisibility, 100);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateSwipeIndicatorVisibility);
});

function formatRating(offer) {
  let parts = [];
  if (offer.ratingType) parts.push(offer.ratingType);
  if (offer.ratingCompanies && offer.ratingCompanies.length > 0) {
    parts.push(`(${offer.ratingCompanies.join(", ")})`);
  }
  return parts.join(" ") || "";
}

function formatEligibility(offer) {
  let list = [];
  if (offer.otherEligibility && Array.isArray(offer.otherEligibility)) {
    list = [...offer.otherEligibility];
  }
  return list.join(", ") || "";
}

const detailsDialogVisible = ref(false);
const selectedCreditsOffer = ref(null);

function showCreditsDetails(offer) {
  selectedCreditsOffer.value = offer;
  detailsDialogVisible.value = true;
}

function sumCredits(rows, key) {
  if (!rows || !Array.isArray(rows)) return 0;
  return rows.reduce((sum, row) => sum + (Number(row[key]) || 0), 0);
}

const buyDialogVisible = ref(false);
const selectedOffer = ref(null);
const submitLoading = ref(false);
const buyForm = ref({
  credits: null,
  price: null,
  email: "",
  phone: "",
});

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
  
  // Extract max price from range or single value
  let price = 0;
  if (offer.pricePerCredit) {
    const parts = String(offer.pricePerCredit).split("-").map(s => Number(s.trim())).filter(n => Number.isFinite(n));
    if (parts.length > 0) {
      price = Math.max(...parts);
    }
  }

  // Extract credits
  let credits = 0;
  if (offer.creditsMode === 'estimated') {
    const avail = Number(String(offer.estimatedAvailable).replace(/,/g, ''));
    if (Number.isFinite(avail)) {
      credits = avail;
    }
  } else if (offer.creditsRows && offer.creditsRows.length > 0) {
    credits = sumCredits(offer.creditsRows, "available");
  }

  buyForm.value = {
    credits: Number.isFinite(credits) && credits > 0 ? credits : null,
    price: Number.isFinite(price) && price > 0 ? price : null,
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

  if (!Number.isFinite(credits) || credits <= 0) {
    errors.push("Credits must be greater than 0.");
  }
  
  if (!Number.isFinite(price) || price <= 0) {
    errors.push("Price must be greater than $0.");
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
      uid: selectedOffer.value?.uid, 
      vintages: selectedOffer.value?.vintages,
      credits: buyForm.value.credits,
      projectName: selectedOffer.value?.projectName,
      pricePerCredit: buyForm.value.price,
      total,
      contactEmail: selectedOffer.value?.contactEmail,
      email: buyForm.value.email.trim(),
      phone: buyForm.value.phone.trim(),
    };
    await offersStore.sendForwardOfferBid(payload);
    toast.add({
      severity: "success",
      summary: "Interest submitted",
      detail: "Your interest has been submitted successfully.",
      life: 5000,
    });
    buyDialogVisible.value = false;
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Submission failed",
      detail: "Failed to submit your interest. Please try again later.",
      life: 5000,
    });
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

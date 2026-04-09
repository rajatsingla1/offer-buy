<template>
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
                Vintages
              </th>
              <th
                scope="col"
                class="max-w-[7rem] whitespace-nowrap px-4 py-2.5 text-left text-sm"
              >
                Offer<br />Price
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
            <tr
              v-for="(offer, index) in forwardOffers"
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
                  {{ offer.pricePerCredit ? "$" + offer.pricePerCredit : "" }}
                </span>
              </td>
              <td class="table-cell overflow-hidden px-4 py-2.5 text-left">
                <a
                  v-if="offer.contactEmail"
                  :href="`mailto:${offer.contactEmail}?subject=Interest in Forward Offer: ${offer.projectName}`"
                  class="text-primary-700 bg-primary-50 px-3 py-1.5 rounded-3xl text-xs font-medium hover:bg-primary-100 transition-colors inline-block whitespace-nowrap"
                >
                  Express interest
                </a>
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
                  v-else-if="offer.creditsRows && offer.creditsRows.length > 0"
                >
                  <div class="min-w-0 truncate" title="Total Available">
                    Available: {{ sumCredits(offer.creditsRows, "available") }}
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
                <div class="min-w-0 truncate" :title="formatEligibility(offer)">
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
                <template v-else-if="offer.defaultContractMode === 'template'">
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
            <tr v-if="forwardOffers.length === 0">
              <td colspan="11" class="p-8 text-center text-slate-500">
                No forward offers found.
              </td>
            </tr>
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
      <div v-if="selectedCreditsOffer" class="p-4">
        <h3 class="font-semibold text-lg mb-4">
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
    </Dialog>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import Dialog from "primevue/dialog";
import { useOffersStore } from "../stores/offers";

const offersStore = useOffersStore();
const { forwardOffers } = storeToRefs(offersStore);

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

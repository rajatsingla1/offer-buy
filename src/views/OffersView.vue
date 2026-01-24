<template>
  <div class="mb-40">
    <section class="card relative overflow-hidden p-8">
      <div class="absolute right-10 top-10 h-24 w-24 rounded-full bg-primary-100 blur-3xl"></div>
      <div class="absolute -bottom-6 left-6 h-20 w-20 rounded-full bg-primary-50 blur-2xl"></div>
      <div class="flex flex-col gap-4">
        <p
          class="inline-flex w-fit items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700 ring-1 ring-primary-100">
          <span class="h-2 w-2 rounded-full bg-primary"></span>
          Live offers
        </p>
        <div class="space-y-3">
          <h1 class="text-3xl font-semibold text-ink sm:text-4xl">
            Premium offers on Credits
          </h1>
          <p class="max-w-3xl text-lg text-slate-600">
            Review curated opportunities with clear pricing and quantities.
          </p>
        </div>
      </div>
    </section>

    <section class="mt-10 space-y-4">
      <section class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-primary-100">
            <thead class="table-header">
              <tr>
                <th scope="col" class="px-6 py-3 text-left">Id</th>
                <th scope="col" class="px-6 py-3 text-left">Vintage</th>
                <th scope="col" class="px-6 py-3 text-left">Credits</th>
                <th scope="col" class="px-6 py-3 text-left">Price</th>
                <th scope="col" class="px-6 py-3 text-left">Total value</th>
                <th scope="col" class="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-primary-50 bg-white">
              <tr v-for="offer in offers" :key="offer.id" class="hover:bg-primary-50/40">
                <td class="table-cell">
                  <div class="text-sm font-semibold text-ink">
                    {{ offer.orderId }}
                  </div>
                  <p class="mt-1 text-xs text-slate-600">
                    Serial ID {{ offer.serial }}
                  </p>
                </td>
                <td class="table-cell">{{ offer.vintage }}</td>
                <td class="table-cell">
                  {{
                    offer.creditsToOffer?.toLocaleString?.() ??
                    offer.creditsToOffer
                  }}
                </td>
                <td class="table-cell">
                  ${{ Number(offer.pricePerCredit).toFixed(2) }}
                </td>
                <td class="table-cell font-semibold text-primary">
                  ${{
                    (
                      Number(offer.creditsToOffer) *
                      Number(offer.pricePerCredit)
                    ).toFixed(2)
                  }}
                </td>
                <td class="table-cell text-right">
                  <button type="button" class="button-primary">Buy</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </section>
    <div class=" text-slate-600 mt-10 ">
      <RouterLink to="/subscribe"> <span class="underline cursor-pointer" ">Click
        here</span></RouterLink> if you would like email alerts for new prices/projects or periodic email
    </div>
    <div class=" text-slate-600 mt-4 "><a href=" mailto:lars.kroijer@alliedoffsets.com?subject=Credits Buy - Project
          Developer" target="_blank"><span class=" underline cursor-pointer" ">Click
        here</span></a> if you are a project developer and want to list credits on this site (plus other distribution
      channels including API, and emails)</div>

  </div>
</template>
<script setup>
import { RouterLink } from "vue-router";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useOffersStore } from "../stores/offers";

const offersStore = useOffersStore();
const { offers, loading, error } = storeToRefs(offersStore);
const { fetchOffers } = offersStore;

onMounted(() => {
  fetchOffers();
});
</script>

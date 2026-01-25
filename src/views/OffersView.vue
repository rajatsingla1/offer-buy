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
                  <button type="button" class="button-primary" @click="openBuyDialog(offer)">
                    Buy
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </section>

    <Dialog v-model:visible="buyDialogVisible" modal header="Bidding" :style="{ width: '28rem' }"
      :dismissable-mask="true" class="buy-dialog" @hide="resetBuyForm">
      <template v-if="selectedOffer">
        <p class="text-slate-700 mb-4">
          You are bidding to buy
          <strong>{{ formatCredits(buyForm.credits) }} credits</strong>
          of {{ selectedOffer.projectName }} vintage {{ selectedOffer.vintage }} at
          <strong>${{ formatPrice(buyForm.price) }}</strong>.
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
        </div>
      </template>
      <template #footer>
        <Button label="Confirm" @click="handleBuyConfirm" />
      </template>
    </Dialog>
    <div class=" text-slate-600 mt-10 ">
      <RouterLink to="/subscribe"><span class="underline cursor-pointer">Click
          here</span></RouterLink> if you would like email alerts for new prices/projects or periodic email
    </div>
    <div class=" text-slate-600 mt-4 "><a
        href="mailto:lars.kroijer@alliedoffsets.com?subject=Credits Buy - Project Developer" target="_blank"><span
          class="underline cursor-pointer">Click
          here</span></a> if you are a project developer and want to list credits on this site (plus other distribution
      channels including API, and emails)</div>

  </div>
</template>
<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { storeToRefs } from "pinia";
import { useOffersStore } from "../stores/offers";
import { useToast } from "primevue/usetoast";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import InputText from "primevue/inputtext";

const toast = useToast();
const offersStore = useOffersStore();
const { offers } = storeToRefs(offersStore);

const buyDialogVisible = ref(false);
const selectedOffer = ref(null);
const buyForm = ref({
  credits: null,
  price: null,
  email: "",
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
  const credits = Number(offer.creditsToOffer);
  const price = Number(offer.pricePerCredit);
  buyForm.value = {
    credits: Number.isFinite(credits) ? credits : 0,
    price: Number.isFinite(price) ? price : 0,
    email: "",
  };
  buyDialogVisible.value = true;
}

function resetBuyForm() {
  selectedOffer.value = null;
  buyForm.value = { credits: null, price: null, email: "" };
}

function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  const s = email.trim();
  return s.includes("@") && s.includes(".") && s.indexOf("@") < s.lastIndexOf(".");
}

function validateBuyForm() {
  const errors = [];
  const credits = Number(buyForm.value.credits);
  const price = Number(buyForm.value.price);
  const available = Number(selectedOffer.value?.creditsToOffer);

  if (!Number.isFinite(credits) || credits <= 1) {
    errors.push("Credits must be greater than 1.");
  } else if (Number.isFinite(available) && credits > available) {
    errors.push(`Credits cannot exceed ${available.toLocaleString()} available.`);
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
  };
  await offersStore.sendOfferBid(payload);
  buyDialogVisible.value = false;
}
</script>

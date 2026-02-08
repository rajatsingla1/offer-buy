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
      <div class="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 flex-row-reverse">
        <a href="https://alliedoffsets.metabaseapp.com/auth/login/password" target="_blank" rel="noopener noreferrer"
          class="text-sm text-red-600 hover:text-red-700 hover:underline">
          click for complete project detail on the AlliedOffsets database
        </a>
      </div>
      <section class="card overflow-hidden">
        <div class="overflow-x-auto" style="max-width: 100%">
          <table class="w-full min-w-max divide-y divide-primary-100">
            <thead class="table-header">
              <tr>
                <th scope="col" class="whitespace-nowrap px-4 py-2.5 text-left text-sm">
                  Name
                </th>

                <th scope="col" class="whitespace-nowrap px-4 py-2.5 text-left text-sm">
                  OFFER
                </th>
                <th scope="col" class="whitespace-nowrap px-4 py-2.5 text-right text-sm">
                  Action
                </th>
                <th scope="col" class="whitespace-nowrap px-4 py-2.5 text-left text-sm">
                  Country & Method
                </th>
                <th scope="col" class="whitespace-nowrap px-4 py-2.5 text-left text-sm">
                  Rating
                </th>
                <th scope="col" class="whitespace-nowrap px-4 py-2.5 text-left text-sm">
                  Removal/<br />avoidance
                </th>
                <th scope="col" class="whitespace-nowrap px-4 py-2.5 text-left text-sm">
                  Eligible
                </th>
                <th scope="col" class="whitespace-nowrap px-4 py-2.5 text-left text-sm">
                  Top 3 buyers
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-primary-50 bg-white">
              <tr v-for="(offer, index) in offers" :key="offer.serial ?? offer.projectName + index"
                class="hover:bg-primary-50/40">
                <td class="table-cell whitespace-nowrap px-4 py-2.5">
                  <div class="text-sm font-semibold text-ink">
                    {{ offer.projectName }}
                  </div>
                  <p class="mt-0.5 text-xs text-slate-600">
                    {{ offer.projectId }}
                  </p>
                  <p class="mt-0.5 text-xs text-slate-600">
                    Vintage:
                    {{ offer.vintage }}
                  </p>
                </td>
                <td class="table-cell whitespace-nowrap px-4 py-2.5 text-sm">

                  <div>
                    <span class=""># credits:</span> <span class="font-semibold text-primary">{{
                      offer.creditsToOffer?.toLocaleString?.() ??
                      offer.creditsToOffer
                    }}</span>
                  </div>
                  <div>
                    <span class=" inline-block">Price:</span> <span class="font-semibold text-primary">${{
                      Number(offer.pricePerCredit).toLocaleString() }}</span>
                  </div>
                  <div class="">
                    <span class=" inline-block">Total:</span> ${{
                      (
                        Number(offer.creditsToOffer) *
                        Number(offer.pricePerCredit)
                      ).toLocaleString()
                    }}
                  </div>
                  <div class="">
                    <span class=" inline-block">Type:</span> <span class="text-amber-600">Indicative</span>
                  </div>




                </td>
                <td class="table-cell whitespace-nowrap px-4 py-2.5 text-right">
                  <button type="button" class="button-primary text-sm" @click="openBuyDialog(offer)">
                    Buy
                  </button>
                </td>
                <td class="table-cell px-4 py-2.5 text-sm">
                  <div>{{ offer.countries ?? "—" }}</div>
                  <div class="text-slate-600">{{ offer.sectors ?? "—" }}</div>
                </td>
                <td class="table-cell px-4 py-2.5 text-sm !whitespace-break-spaces">
                  <template v-if="offer.raters">
                    <div v-for="(item, i) in commaBreakItems(offer.raters)" :key="i">
                      {{ item.text }}{{ item.comma }}
                    </div>
                  </template>
                  <span v-else>—</span>
                </td>
                <td class="table-cell whitespace-nowrap px-4 py-2.5 text-sm">
                  {{ formatOffsetType(offer.project_offset_type) }}
                </td>
                <td class="table-cell px-4 py-2.5 text-sm">
                  <div>CCP: {{ offer.ccp ? "Yes" : "No" }}</div>
                  <div>Compliance: {{ offer.compliance ? "Yes" : "No" }}</div>
                </td>
                <td class="table-cell max-w-[12rem] px-4 py-2.5 text-sm !whitespace-break-spaces">
                  <template v-if="offer.top_3_buyers">
                    <div v-for="(item, i) in commaBreakItems(offer.top_3_buyers)" :key="i">
                      {{ item.text }}{{ item.comma }}
                    </div>
                  </template>
                  <span v-else>—</span>
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
          You are expressing an interest to buy
          <strong>{{ formatCredits(buyForm.credits) }} credits</strong>
          of {{ selectedOffer.projectName }} vintage
          {{ selectedOffer.vintage }} at
          <strong>${{ formatPrice(buyForm.price) }}</strong>.
        </p>
        <p class="text-slate-700 mb-4">Your indication of interest will be emailed to the party offering the credits for
          sale and the
          administrator of this site.</p>
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
      <a href="https://api.publicdomain.co.in/offers/api" target="_blank"><span class="underline cursor-pointer">Click
          here</span></a>
      if you want access to data via API
    </div>
    <div class="text-slate-600 mt-10">
      <h1 class="text-xl">T&Cs:</h1>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged.
      </p>
    </div>
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

function splitByComma(val) {
  if (!val) return [];
  return String(val)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function commaBreakItems(val) {
  const arr = splitByComma(val);
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
      `Credits cannot exceed ${available.toLocaleString()} available.`
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
    buyDialogVisible.value = false;
  } finally {
    submitLoading.value = false;
  }
}
</script>

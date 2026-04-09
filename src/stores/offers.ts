import axios from "axios";
import { defineStore } from "pinia";
import apiClient from "../utils/apiClient.ts";

const API_URL = `${apiClient.root.defaults.baseURL}`;

export const useOffersStore = defineStore("offers", {
  state: () => ({
    offers: [],
    forwardOffers: [],
    loading: false,
    forwardLoading: false,
    error: "",
    forwardError: "",
  }),
  actions: {
    async fetchOffers() {
      if (this.loading) return;

      this.loading = true;
      this.error = "";

      try {
        const response = await axios.get(`${API_URL}/offers/website`);

        const payload = response.data;
        const remoteOffers = payload ?? [];

        this.offers = Array.isArray(remoteOffers) ? remoteOffers : [];
      } catch (err) {
        this.error =
          err instanceof Error
            ? err.message
            : "Unexpected error fetching offers.";
        this.offers = [];
      } finally {
        this.loading = false;
      }
    },
    async fetchForwardOffers() {
      if (this.forwardLoading) return;

      this.forwardLoading = true;
      this.forwardError = "";

      try {
        const response = await axios.get(`${API_URL}/forward-offers/website`);

        const payload = response.data;
        const remoteOffers = payload ?? [];

        this.forwardOffers = Array.isArray(remoteOffers) ? remoteOffers : [];
      } catch (err) {
        this.forwardError =
          err instanceof Error
            ? err.message
            : "Unexpected error fetching forward offers.";
        this.forwardOffers = [];
      } finally {
        this.forwardLoading = false;
      }
    },
    async sendOfferBid(bid: any) {
      try {
        const response = await axios.post(`${API_URL}/offers/bid`, bid);
        return response.data;
      } catch (err: any) {
        console.error("Error sending offer bid", err.response?.data || err);
        throw err;
      }
    },
    async sendForwardOfferBid(bid: any) {
      try {
        const response = await axios.post(`${API_URL}/forward-offers/bid`, bid);
        return response.data;
      } catch (err: any) {
        console.error("Error sending forward offer bid", err.response?.data || err);
        throw err;
      }
    },
  },
});

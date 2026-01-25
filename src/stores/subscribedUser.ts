import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../utils/apiClient.ts";
import { useToast } from "primevue/usetoast";

export const useSubscribedUserStore = defineStore("subscribedUser", () => {
  const subscribedUser = ref(null);
  const toast = useToast();

  const createSubscribedUser = async ({
    email,
    name,
    instantUpdates,
    schedulePreference,
  }: {
    email: string;
    name?: string;
    instantUpdates: boolean;
    schedulePreference: string;
  }) => {
    try {
      const response = await apiClient.root.post("/subscribed-users", {
        email,
        name,
        instantUpdates,
        schedulePreference,
      });
      return response.data;
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Error creating subscribed user",
        life: 3000,
      });
    }
  };

  return {
    subscribedUser,
    createSubscribedUser,
  };
});

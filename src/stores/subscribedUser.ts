import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "../utils/apiClient.ts";
import { useToast } from "primevue/usetoast";

export const useSubscribedUserStore = defineStore("subscribedUser", () => {
  const subscribedUser = ref(null);
  const toast = useToast();

  const getSubscribedUser = async (uuid: string) => {
    try {
      const response = await apiClient.root.get(`/subscribed-users/${uuid}`);
      subscribedUser.value = response.data;
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Error getting subscribed user",
        life: 3000,
      });
    }
  };

  const createSubscribedUser = async ({
    email,
    name,
    instantUpdates,
    schedulePreference,
    subscribedProjectIds,
    autoSubscribeNewOffers,
  }: {
    email: string;
    name?: string;
    instantUpdates: boolean;
    schedulePreference: string;
    subscribedProjectIds: string[];
    autoSubscribeNewOffers?: boolean;
  }) => {
    try {
      const body: Record<string, unknown> = {
        email,
        name,
        instantUpdates,
        schedulePreference,
        subscribed_project_ids: subscribedProjectIds,
      };
      if (autoSubscribeNewOffers !== undefined) {
        body.subscribe_new_projects = autoSubscribeNewOffers;
      }
      const response = await apiClient.root.post("/subscribed-users", body);
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

  const updateSubscribedUser = async (
    uuid: string,
    {
      instantUpdates,
      schedulePreference,
      active,
      subscribedProjectIds,
      autoSubscribeNewOffers,
    }: {
      instantUpdates?: boolean;
      schedulePreference?: string;
      active?: boolean;
      subscribedProjectIds?: string[];
      autoSubscribeNewOffers?: boolean;
    },
  ) => {
    try {
      const body: Record<string, unknown> = {};
      if (instantUpdates != null) body.instant_updates = instantUpdates;
      if (schedulePreference != null) body.schedule_preference = schedulePreference;
      if (active != null) body.active = active;
      if (subscribedProjectIds !== undefined) body.subscribed_project_ids = subscribedProjectIds;
      if (autoSubscribeNewOffers != null) body.subscribe_new_projects = autoSubscribeNewOffers;

      const response = await apiClient.root.patch(`/subscribed-users/${uuid}`, body);
      if (response.data) {
        subscribedUser.value = response.data;
      }
      return response.data;
    } catch (error) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Error updating subscribed user",
        life: 3000,
      });
    }
  };

  return {
    subscribedUser,
    getSubscribedUser,
    createSubscribedUser,
    updateSubscribedUser,
  };
});

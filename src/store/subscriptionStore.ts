import { create } from 'zustand';
import type { UserSubscription, SubscriptionPlan } from '@/types';

export interface SubscriptionState {
  subscription: (UserSubscription & { plan?: SubscriptionPlan }) | null;
  isActive: boolean;
  daysRemaining: number;
  telegramLink: string | null;
  loading: boolean;
  setSubscription: (data: Partial<SubscriptionState>) => void;
  fetchSubscription: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscription: null,
  isActive: false,
  daysRemaining: 0,
  telegramLink: null,
  loading: true,
  setSubscription: (data) => set((state) => ({ ...state, ...data })),
  fetchSubscription: async () => {
    try {
      set({ loading: true });
      const res = await fetch('/api/user/subscription');
      if (res.ok) {
        const data = await res.json();
        set({
          subscription: data.subscription,
          isActive: data.isActive,
          daysRemaining: data.daysRemaining,
          telegramLink: data.telegramLink,
        });
      } else {
        set({ subscription: null, isActive: false, daysRemaining: 0, telegramLink: null });
      }
    } catch {
      set({ subscription: null, isActive: false, daysRemaining: 0, telegramLink: null });
    } finally {
      set({ loading: false });
    }
  },
}));

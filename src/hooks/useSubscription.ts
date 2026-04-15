'use client';

import { useEffect } from 'react';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useAuth } from './useAuth';

export const useSubscription = () => {
  const { user } = useAuth();
  const state = useSubscriptionStore();

  useEffect(() => {
    if (user) {
      state.fetchSubscription();
    } else {
      state.setSubscription({
        subscription: null,
        isActive: false,
        daysRemaining: 0,
        telegramLink: null,
        loading: false
      });
    }
  }, [user, state]);

  return {
    subscription: state.subscription,
    isActive: state.isActive,
    daysRemaining: state.daysRemaining,
    telegramLink: state.telegramLink,
    loading: state.loading,
    refresh: state.fetchSubscription
  };
};

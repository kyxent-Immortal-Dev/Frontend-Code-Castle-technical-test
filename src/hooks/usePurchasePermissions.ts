import { useMemo } from 'react';
import type { PurchaseInterface } from '../interfaces/inventary/Purchases.interface';

export interface PurchasePermissions {
  canEdit: boolean;
  canDelete: boolean;
  canComplete: boolean;
  canCancel: boolean;
  canChangeStatus: boolean;
}

export const usePurchasePermissions = (purchase: PurchaseInterface | null): PurchasePermissions => {
  return useMemo(() => {
    if (!purchase) {
      return {
        canEdit: false,
        canDelete: false,
        canComplete: false,
        canCancel: false,
        canChangeStatus: false,
      };
    }

    const isPending = purchase.status === 'pending';
    // const isCompleted = purchase.status === 'completed';
    // const isCancelled = purchase.status === 'cancelled';

    return {
      canEdit: isPending,
      canDelete: isPending,
      canComplete: isPending,
      canCancel: isPending,
      canChangeStatus: isPending,
    };
  }, [purchase]);
}; 
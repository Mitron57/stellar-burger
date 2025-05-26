import { type FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import type { OrderCardProps } from './type';
import type { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';

import { useAppSelector } from '@store';
import { getAvailableMenuItems } from '@slices';

const maxDisplayItems = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const currentLocation = useLocation();

  const availableItems: TIngredient[] = useAppSelector(getAvailableMenuItems);

  const orderDisplayData = useMemo(() => {
    if (!availableItems.length) return null;

    const itemsData = order.ingredients.reduce(
      (accumulator: TIngredient[], itemId: string) => {
        const menuItem = availableItems.find((item) => item._id === itemId);
        if (menuItem) return [...accumulator, menuItem];
        return accumulator;
      },
      []
    );

    const totalCost = itemsData.reduce((sum, item) => sum + item.price, 0);

    const displayItems = itemsData.slice(0, maxDisplayItems);

    const remainingCount =
      itemsData.length > maxDisplayItems
        ? itemsData.length - maxDisplayItems
        : 0;

    const orderDate = new Date(order.createdAt);
    return {
      ...order,
      ingredientsInfo: itemsData,
      ingredientsToShow: displayItems,
      remains: remainingCount,
      total: totalCost,
      date: orderDate
    };
  }, [order, availableItems]);

  if (!orderDisplayData) return null;

  return (
    <OrderCardUI
      orderInfo={orderDisplayData}
      maxIngredients={maxDisplayItems}
      locationState={{ background: currentLocation }}
    />
  );
});

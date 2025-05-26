'use client';

import { type FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import type { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store';
import {
  loadOrderDetailsAction,
  getOrderDetailsInfo,
  getAvailableMenuItems
} from '@slices';

export const OrderInfo: FC = () => {
  const dispatcher = useAppDispatch();
  const orderNumber = Number(useParams().number);

  useEffect(() => {
    dispatcher(loadOrderDetailsAction(orderNumber));
  }, [dispatcher]);

  const orderDetailsData = useAppSelector(getOrderDetailsInfo).currentOrder;

  const availableItems: TIngredient[] = useAppSelector(getAvailableMenuItems);

  /* Подготавливаем данные для отображения */
  const orderDisplayInfo = useMemo(() => {
    if (!orderDetailsData || !availableItems.length) return null;

    const orderDate = new Date(orderDetailsData.createdAt);

    type TItemsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const itemsInfo = orderDetailsData.ingredients.reduce(
      (accumulator: TItemsWithCount, itemId) => {
        if (!accumulator[itemId]) {
          const menuItem = availableItems.find((item) => item._id === itemId);
          if (menuItem) {
            accumulator[itemId] = {
              ...menuItem,
              count: 1
            };
          }
        } else {
          accumulator[itemId].count++;
        }

        return accumulator;
      },
      {}
    );

    const totalCost = Object.values(itemsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...orderDetailsData,
      ingredientsInfo: itemsInfo,
      date: orderDate,
      total: totalCost
    };
  }, [orderDetailsData, availableItems]);

  if (!orderDisplayInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderDisplayInfo} />;
};

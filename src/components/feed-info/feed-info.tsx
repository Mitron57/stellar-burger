import type { FC } from 'react';

import type { TOrder } from '@utils-types';
import { FeedInfoUI } from '@ui';
import { useAppSelector } from '@store';
import { getOrdersStreamStateInfo } from '@slices';

const filterOrdersByStatus = (
  ordersList: TOrder[],
  orderStatus: string
): number[] =>
  ordersList
    .filter((order) => order.status === orderStatus)
    .map((order) => order.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const streamState = useAppSelector(getOrdersStreamStateInfo);
  const ordersList: TOrder[] = streamState.ordersList;
  const streamData = {
    total: streamState.totalOrdersCount,
    totalToday: streamState.todayOrdersCount
  };

  const completedOrders = filterOrdersByStatus(ordersList, 'done');

  const processingOrders = filterOrdersByStatus(ordersList, 'pending');

  return (
    <FeedInfoUI
      readyOrders={completedOrders}
      pendingOrders={processingOrders}
      feed={streamData}
    />
  );
};

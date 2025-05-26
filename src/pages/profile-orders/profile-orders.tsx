import { ProfileOrdersUI } from '@ui-pages';
import type { TOrder } from '@utils-types';
import { type FC, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@store';
import { getOrdersListData, loadUserOrdersAction } from '@slices';

export const ProfileOrders: FC = () => {
  const dispatcher = useAppDispatch();
  const userOrdersList: TOrder[] = useAppSelector(getOrdersListData);

  useEffect(() => {
    dispatcher(loadUserOrdersAction());
  }, [dispatcher]);

  return <ProfileOrdersUI orders={userOrdersList} />;
};

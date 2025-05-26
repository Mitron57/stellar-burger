'use client';

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import type { TOrder } from '@utils-types';
import { type FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store';
import { loadOrdersStreamAction, getOrdersListData } from '@slices';

export const Feed: FC = () => {
  const dispatcher = useAppDispatch();
  const ordersList: TOrder[] = useAppSelector(getOrdersListData);

  const handleStreamRefresh = () => {
    dispatcher(loadOrdersStreamAction());
  };

  useEffect(() => {
    handleStreamRefresh();
  }, [dispatcher]);

  if (!ordersList.length) {
    return <Preloader />;
  }

  return <FeedUI orders={ordersList} handleGetFeeds={handleStreamRefresh} />;
};

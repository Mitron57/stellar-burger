import type { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useAppSelector } from '@store';
import { getCurrentUserInfo } from '@slices';

export const AppHeader: FC = () => {
  const currentUser = useAppSelector(getCurrentUserInfo);
  const displayName = currentUser?.name;
  return <AppHeaderUI userName={displayName} />;
};

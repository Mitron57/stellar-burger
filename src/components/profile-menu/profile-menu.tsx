import type { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useAppDispatch } from '@store';
import { signOutAction } from '@slices';

export const ProfileMenu: FC = () => {
  const dispatcher = useAppDispatch();
  const { pathname } = useLocation();

  const handleUserSignOut = () => {
    dispatcher(signOutAction());
  };

  return <ProfileMenuUI handleLogout={handleUserSignOut} pathname={pathname} />;
};

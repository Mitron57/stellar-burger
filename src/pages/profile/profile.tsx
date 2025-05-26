import type React from 'react';

import { ProfileUI } from '@ui-pages';
import { type FC, type SyntheticEvent, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@store';
import { getCurrentUserInfo, modifyAccountAction } from '@slices';
import type { TUser } from '@utils-types';

export const Profile: FC = () => {
  const dispatcher = useAppDispatch();
  const currentUser = useAppSelector(getCurrentUserInfo) as TUser;

  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    password: ''
  });

  useEffect(() => {
    setFormData((previousState) => ({
      ...previousState,
      name: currentUser?.name || '',
      email: currentUser?.email || ''
    }));
  }, [currentUser]);

  const hasFormChanges =
    formData.name !== currentUser?.name ||
    formData.email !== currentUser?.email ||
    !!formData.password;

  const handleFormSubmission = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const handleFormReset = (event: SyntheticEvent) => {
    event.preventDefault();
    dispatcher(modifyAccountAction(formData));
    setFormData({
      ...currentUser,
      password: ''
    });
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((previousState) => ({
      ...previousState,
      [event.target.name]: event.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formData}
      isFormChanged={hasFormChanges}
      handleCancel={handleFormReset}
      handleSubmit={handleFormSubmission}
      handleInputChange={handleFieldChange}
    />
  );

  return null;
};

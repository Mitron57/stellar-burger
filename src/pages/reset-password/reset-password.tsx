'use client';

import { type FC, type SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ResetPasswordUI } from '@ui-pages';

import { useAppSelector, useAppDispatch } from '@store';
import {
  confirmPasswordResetAction,
  getAccountError,
  resetErrorMessage
} from '@slices';

export const ResetPassword: FC = () => {
  const navigator = useNavigate();
  const dispatcher = useAppDispatch();
  const [passwordInput, setPasswordInput] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const errorMessage = useAppSelector(getAccountError) as string;

  const handleFormSubmission = (event: SyntheticEvent) => {
    event.preventDefault();
    dispatcher(
      confirmPasswordResetAction({ password: passwordInput, token: tokenInput })
    ).then((result) => {
      if (result.payload) {
        localStorage.removeItem('resetPassword');
        navigator('/login');
      }
    });
  };

  useEffect(() => {
    dispatcher(resetErrorMessage());
  }, [dispatcher]);

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigator('/forgot-password', { replace: true });
    }
  }, [navigator]);

  return (
    <ResetPasswordUI
      errorText={errorMessage}
      password={passwordInput}
      token={tokenInput}
      setPassword={setPasswordInput}
      setToken={setTokenInput}
      handleSubmit={handleFormSubmission}
    />
  );
};

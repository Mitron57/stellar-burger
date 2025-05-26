'use client';

import { type FC, type SyntheticEvent, useState, useEffect } from 'react';
import { LoginUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store';
import { authenticateUserAction, resetErrorMessage } from '@slices';

export const Login: FC = () => {
  const dispatcher = useAppDispatch();
  const navigator = useNavigate();
  const errorMessage = useAppSelector((state) => state.account.errorMessage);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  useEffect(() => {
    dispatcher(resetErrorMessage());
  });

  const handleFormSubmission = (event: SyntheticEvent) => {
    event.preventDefault();
    dispatcher(
      authenticateUserAction({ email: emailInput, password: passwordInput })
    );
  };

  return (
    <LoginUI
      errorText={errorMessage?.toString()}
      email={emailInput}
      setEmail={setEmailInput}
      password={passwordInput}
      setPassword={setPasswordInput}
      handleSubmit={handleFormSubmission}
    />
  );
};

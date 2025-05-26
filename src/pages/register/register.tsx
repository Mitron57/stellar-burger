'use client';

import { type FC, type SyntheticEvent, useState, useEffect } from 'react';
import { RegisterUI } from '@ui-pages';
import { useAppDispatch, useAppSelector } from '@store';
import {
  resetErrorMessage,
  createAccountAction,
  getAccountError
} from '@slices';

export const Register: FC = () => {
  const dispatcher = useAppDispatch();
  const errorMessage = useAppSelector(getAccountError);
  const [userNameInput, setUserNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const handleFormSubmission = (event: SyntheticEvent) => {
    event.preventDefault();
    const userName = userNameInput;
    dispatcher(
      createAccountAction({
        email: emailInput,
        name: userName,
        password: passwordInput
      })
    );
  };

  useEffect(() => {
    dispatcher(resetErrorMessage());
  });

  return (
    <RegisterUI
      errorText={errorMessage?.toString()}
      email={emailInput}
      userName={userNameInput}
      password={passwordInput}
      setEmail={setEmailInput}
      setPassword={setPasswordInput}
      setUserName={setUserNameInput}
      handleSubmit={handleFormSubmission}
    />
  );
};

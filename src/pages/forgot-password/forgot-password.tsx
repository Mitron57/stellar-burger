import { type FC, useState, type SyntheticEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ForgotPasswordUI } from '@ui-pages';

import { useAppSelector, useAppDispatch } from '@store';
import {
  requestPasswordResetAction,
  getAccountError,
  resetErrorMessage
} from '@slices';

export const ForgotPassword: FC = () => {
  const [emailInput, setEmailInput] = useState('');
  const errorMessage = useAppSelector(getAccountError) as string;

  const navigator = useNavigate();
  const dispatcher = useAppDispatch();

  useEffect(() => {
    dispatcher(resetErrorMessage());
  });

  const handleFormSubmission = (event: SyntheticEvent) => {
    event.preventDefault();

    dispatcher(requestPasswordResetAction({ email: emailInput })).then(
      (result) => {
        if (result.payload) {
          localStorage.setItem('resetPassword', 'true');
          navigator('/reset-password', { replace: true });
        }
      }
    );
  };

  return (
    <ForgotPasswordUI
      errorText={errorMessage}
      email={emailInput}
      setEmail={setEmailInput}
      handleSubmit={handleFormSubmission}
    />
  );
};

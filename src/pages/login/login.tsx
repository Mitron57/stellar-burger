import { type FC, type SyntheticEvent, useEffect } from 'react';
import { LoginUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@store';
import { authenticateUserAction, resetErrorMessage } from '@slices';
import { useForm } from '@hooks';

export const Login: FC = () => {
  const dispatcher = useAppDispatch();
  const navigator = useNavigate();
  const errorMessage = useAppSelector((state) => state.account.errorMessage);
  const { values, handleChange } = useForm({
    email: '',
    password: ''
  });

  useEffect(() => {
    dispatcher(resetErrorMessage());
  });

  const handleFormSubmission = (event: SyntheticEvent) => {
    event.preventDefault();
    dispatcher(
      authenticateUserAction({
        email: values.email,
        password: values.password
      })
    );
  };

  return (
    <LoginUI
      errorText={errorMessage?.toString()}
      email={values.email}
      setEmail={(value) =>
        handleChange({
          target: { name: 'email', value }
        } as React.ChangeEvent<HTMLInputElement>)
      }
      password={values.password}
      setPassword={(value) =>
        handleChange({
          target: { name: 'password', value }
        } as React.ChangeEvent<HTMLInputElement>)
      }
      handleSubmit={handleFormSubmission}
    />
  );
};

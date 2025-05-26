'use client';

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import {
  AppHeader,
  Modal,
  OrderInfo,
  IngredientDetails,
  ProtectedRoute,
  Center
} from '@components';
import { useAppDispatch } from '@store';
import {
  loadMenuItemsAction,
  getAccountStateInfo,
  fetchAccountAction
} from '@slices';
import { useEffect } from 'react';
import { useAppSelector } from '@store';

const App = () => {
  const navigator = useNavigate();
  const currentLocation = useLocation();
  const dispatcher = useAppDispatch();
  const accountProcessing = useAppSelector(getAccountStateInfo).isProcessing;
  const backgroundLocation = currentLocation.state?.background;

  useEffect(() => {
    dispatcher(fetchAccountAction());
    dispatcher(loadMenuItemsAction());
  }, [dispatcher]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || currentLocation}>
        <Route path='/' element={<ConstructorPage />} />
        <Route
          path='/ingredients/:id'
          element={
            <Center title={`Детали ингредиента`}>
              <IngredientDetails />
            </Center>
          }
        />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/feed/:number'
          element={
            <Center title={`#${currentLocation.pathname.match(/\d+/)}`}>
              <OrderInfo />
            </Center>
          }
        />
        <Route element={<ProtectedRoute forAuthorized={false} />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>
        <Route element={<ProtectedRoute forAuthorized />}>
          <Route path='/profile'>
            <Route index element={<Profile />} />
            <Route path='orders' element={<ProfileOrders />} />
            <Route
              path='orders/:number'
              element={
                <Center title={`#${currentLocation.pathname.match(/\d+/)}`}>
                  <OrderInfo />
                </Center>
              }
            />
          </Route>
        </Route>
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={`#${currentLocation.pathname.match(/\d+/)}`}
                onClose={() => {
                  navigator(-1);
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title={`Детали ингредиента`}
                onClose={() => {
                  navigator(-1);
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route element={<ProtectedRoute forAuthorized />}>
            <Route
              path='/profile/orders/:number'
              element={
                <Modal
                  title={`#${currentLocation.pathname.match(/\d+/)}`}
                  onClose={() => {
                    navigator('/profile/orders');
                  }}
                >
                  <OrderInfo />
                </Modal>
              }
            />
          </Route>
        </Routes>
      )}
    </div>
  );
};

export default App;

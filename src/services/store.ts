import { combineReducers, configureStore } from '@reduxjs/toolkit';

import accountReducer from '../slices/account-slice';
import ordersStreamReducer from '../slices/orders-stream-slice';
import menuItemsReducer from '../slices/menu-items-slice';
import builderReducer from '../slices/builder-slice';
import orderDetailsReducer from '../slices/order-details-slice';

import {
  type TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

export const combinedReducer = combineReducers({
  account: accountReducer,
  ordersStream: ordersStreamReducer,
  orderDetails: orderDetailsReducer,
  menuItems: menuItemsReducer,
  builder: builderReducer
});

const appStore = configureStore({
  reducer: combinedReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type AppState = ReturnType<typeof combinedReducer>;

export type StoreDispatch = typeof appStore.dispatch;

export const useAppDispatch: () => StoreDispatch = () => dispatchHook();
export const useAppSelector: TypedUseSelectorHook<AppState> = selectorHook;

export default appStore;

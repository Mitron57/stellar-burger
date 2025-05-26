import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './ingredients-slice';
import builderReducer from './builder-slice';
import orderReducer from './order-slice';
import accountReducer from './account-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  builder: builderReducer,
  order: orderReducer,
  account: accountReducer
});

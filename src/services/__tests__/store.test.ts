import { combinedReducer } from '../store';
import { accountDefaultState } from '../../slices/account-slice';
import { builderDefaultState } from '../../slices/builder-slice';
import { menuItemsDefaultState } from '../../slices/menu-items-slice';
import { ordersStreamDefaultState } from '../../slices/orders-stream-slice';
import { orderDetailsDefaultState } from '../../slices/order-details-slice';

describe('rootReducer', () => {
  it('should return the correct initial state when called with undefined state and unknown action', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const initialState = combinedReducer(undefined, unknownAction);

    expect(initialState).toEqual({
      account: accountDefaultState,
      builder: builderDefaultState,
      menuItems: menuItemsDefaultState,
      ordersStream: ordersStreamDefaultState,
      orderDetails: orderDetailsDefaultState
    });
  });

  it('should handle state updates correctly', () => {
    const initialState = combinedReducer(undefined, { type: '@@INIT' });

    expect(initialState.account.isProcessing).toBe(false);
    expect(initialState.builder.selectedItems.bunItem).toBe(null);
    expect(initialState.menuItems.availableItems).toEqual([]);
    expect(initialState.ordersStream.ordersList).toEqual([]);
    expect(initialState.orderDetails.currentOrder).toBe(null);
  });
});

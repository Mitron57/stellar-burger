import orderDetailsReducer, {
  orderDetailsDefaultState,
  loadOrderDetailsAction
} from '../order-details-slice';
import type { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: '1',
  status: 'done',
  name: 'Test Order',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  number: 12345,
  ingredients: ['1', '2']
};

describe('order-details slice', () => {
  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(orderDetailsReducer(undefined, { type: 'unknown' })).toEqual(
        orderDetailsDefaultState
      );
    });
  });

  describe('loadOrderDetailsAction async thunk', () => {
    it('should handle pending state', () => {
      const action = { type: loadOrderDetailsAction.pending.type };
      const result = orderDetailsReducer(orderDetailsDefaultState, action);

      expect(result.isLoading).toBe(true);
      expect(result.errorMessage).toBe(null);
    });

    it('should handle fulfilled state', () => {
      const action = {
        type: loadOrderDetailsAction.fulfilled.type,
        payload: { orders: [mockOrder] }
      };
      const result = orderDetailsReducer(orderDetailsDefaultState, action);

      expect(result.isLoading).toBe(false);
      expect(result.currentOrder).toEqual(mockOrder);
      expect(result.errorMessage).toBe(null);
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Failed to load order details';
      const action = {
        type: loadOrderDetailsAction.rejected.type,
        error: { message: errorMessage }
      };
      const result = orderDetailsReducer(orderDetailsDefaultState, action);

      expect(result.isLoading).toBe(false);
      expect(result.errorMessage).toBe(errorMessage);
    });
  });
});

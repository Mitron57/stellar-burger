import ordersStreamReducer, {
  ordersStreamDefaultState,
  loadOrdersStreamAction,
  loadUserOrdersAction
} from '../orders-stream-slice';
import type { TOrder } from '@utils-types';

const mockOrders: TOrder[] = [
  {
    _id: '1',
    status: 'done',
    name: 'Test Order 1',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    number: 12345,
    ingredients: ['1', '2']
  },
  {
    _id: '2',
    status: 'pending',
    name: 'Test Order 2',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02',
    number: 12346,
    ingredients: ['3', '4']
  }
];

describe('orders-stream slice', () => {
  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(ordersStreamReducer(undefined, { type: 'unknown' })).toEqual(
        ordersStreamDefaultState
      );
    });
  });

  describe('loadOrdersStreamAction async thunk', () => {
    it('should handle pending state', () => {
      const action = { type: loadOrdersStreamAction.pending.type };
      const result = ordersStreamReducer(ordersStreamDefaultState, action);

      expect(result.isLoading).toBe(true);
      expect(result.errorMessage).toBe(null);
    });

    it('should handle fulfilled state', () => {
      const mockStreamData = {
        orders: mockOrders,
        total: 100,
        totalToday: 10
      };

      const action = {
        type: loadOrdersStreamAction.fulfilled.type,
        payload: mockStreamData
      };
      const result = ordersStreamReducer(ordersStreamDefaultState, action);

      expect(result.isLoading).toBe(false);
      expect(result.ordersList).toEqual(mockOrders);
      expect(result.totalOrdersCount).toBe(100);
      expect(result.todayOrdersCount).toBe(10);
      expect(result.errorMessage).toBe(null);
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Failed to load orders stream';
      const action = {
        type: loadOrdersStreamAction.rejected.type,
        error: { message: errorMessage }
      };
      const result = ordersStreamReducer(ordersStreamDefaultState, action);

      expect(result.isLoading).toBe(false);
      expect(result.errorMessage).toBe(errorMessage);
    });
  });

  describe('loadUserOrdersAction async thunk', () => {
    it('should handle fulfilled state', () => {
      const action = {
        type: loadUserOrdersAction.fulfilled.type,
        payload: mockOrders
      };
      const result = ordersStreamReducer(ordersStreamDefaultState, action);

      expect(result.isLoading).toBe(false);
      expect(result.ordersList).toEqual(mockOrders);
      expect(result.errorMessage).toBe(null);
    });
  });
});

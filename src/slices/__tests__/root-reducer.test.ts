import { rootReducer } from '../root-reducer';

describe('Root Reducer', () => {
  it('should return initial state for unknown action', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(initialState).toEqual({
      ingredients: {
        ingredients: [],
        isLoading: false,
        error: null
      },
      builder: {
        selectedItems: {
          bunItem: null,
          fillingItems: []
        },
        isProcessing: false,
        isOrderSubmitting: false,
        completedOrderData: null,
        errorMessage: null
      },
      order: {
        isLoading: false,
        order: null,
        error: null
      },
      account: {
        currentUser: null,
        hasAccess: false,
        isProcessing: false,
        errorMessage: null
      }
    });
  });
});

import builderReducer, {
  builderDefaultState,
  includeItem,
  excludeItem,
  shiftItemUp,
  shiftItemDown,
  clearCompletedOrder,
  submitOrderAction
} from '../builder-slice';
import type { TIngredient, TConstructorIngredient } from '@utils-types';

const mockBun: TConstructorIngredient = {
  _id: '1',
  id: '1',
  name: 'Булка',
  type: 'bun',
  proteins: 20,
  fat: 10,
  carbohydrates: 30,
  calories: 200,
  price: 100,
  image: 'bun.jpg',
  image_large: 'bun_large.jpg',
  image_mobile: 'bun_mobile.jpg'
};

const mockIngredient: TIngredient = {
  _id: '2',
  name: 'Начинка',
  type: 'main',
  proteins: 15,
  fat: 8,
  carbohydrates: 25,
  calories: 150,
  price: 50,
  image: 'ingredient.jpg',
  image_large: 'ingredient_large.jpg',
  image_mobile: 'ingredient_mobile.jpg'
};

describe('builder slice', () => {
  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(builderReducer(undefined, { type: 'unknown' })).toEqual(
        builderDefaultState
      );
    });
  });

  describe('includeItem', () => {
    it('should add bun to selectedItems.bunItem', () => {
      const action = includeItem(mockBun);
      const result = builderReducer(builderDefaultState, action);

      expect(result.selectedItems.bunItem).toEqual(mockBun);
      expect(result.selectedItems.fillingItems).toEqual([]);
    });

    it('should add ingredient to selectedItems.fillingItems with unique id', () => {
      const action = includeItem(mockIngredient);
      const result = builderReducer(builderDefaultState, action);

      expect(result.selectedItems.bunItem).toBe(null);
      expect(result.selectedItems.fillingItems).toHaveLength(1);
      expect(result.selectedItems.fillingItems[0]).toMatchObject(
        mockIngredient
      );
      expect(result.selectedItems.fillingItems[0].id).toBeDefined();
    });

    it('should replace existing bun when adding new bun', () => {
      const initialState = {
        ...builderDefaultState,
        selectedItems: {
          ...builderDefaultState.selectedItems,
          bunItem: mockBun
        }
      };

      const newBun = { ...mockBun, _id: '3', name: 'Новая булка' };
      const action = includeItem(newBun);
      const result = builderReducer(initialState, action);

      expect(result.selectedItems.bunItem).toEqual(newBun);
    });
  });

  describe('excludeItem', () => {
    it('should remove ingredient from fillingItems by id', () => {
      const ingredientWithId = { ...mockIngredient, id: 'unique-id' };
      const initialState = {
        ...builderDefaultState,
        selectedItems: {
          ...builderDefaultState.selectedItems,
          fillingItems: [ingredientWithId]
        }
      };

      const action = excludeItem('unique-id');
      const result = builderReducer(initialState, action);

      expect(result.selectedItems.fillingItems).toEqual([]);
    });

    it('should not affect other ingredients when removing one', () => {
      const ingredient1 = { ...mockIngredient, id: 'id-1' };
      const ingredient2 = {
        ...mockIngredient,
        id: 'id-2',
        name: 'Другая начинка'
      };

      const initialState = {
        ...builderDefaultState,
        selectedItems: {
          ...builderDefaultState.selectedItems,
          fillingItems: [ingredient1, ingredient2]
        }
      };

      const action = excludeItem('id-1');
      const result = builderReducer(initialState, action);

      expect(result.selectedItems.fillingItems).toEqual([ingredient2]);
    });
  });

  describe('shiftItemUp', () => {
    it('should move ingredient up in the list', () => {
      const ingredient1 = { ...mockIngredient, id: 'id-1', name: 'Первая' };
      const ingredient2 = { ...mockIngredient, id: 'id-2', name: 'Вторая' };

      const initialState = {
        ...builderDefaultState,
        selectedItems: {
          ...builderDefaultState.selectedItems,
          fillingItems: [ingredient1, ingredient2]
        }
      };

      const action = shiftItemUp(1);
      const result = builderReducer(initialState, action);

      expect(result.selectedItems.fillingItems[0]).toEqual(ingredient2);
      expect(result.selectedItems.fillingItems[1]).toEqual(ingredient1);
    });
  });

  describe('shiftItemDown', () => {
    it('should move ingredient down in the list', () => {
      const ingredient1 = { ...mockIngredient, id: 'id-1', name: 'Первая' };
      const ingredient2 = { ...mockIngredient, id: 'id-2', name: 'Вторая' };

      const initialState = {
        ...builderDefaultState,
        selectedItems: {
          ...builderDefaultState.selectedItems,
          fillingItems: [ingredient1, ingredient2]
        }
      };

      const action = shiftItemDown(0);
      const result = builderReducer(initialState, action);

      expect(result.selectedItems.fillingItems[0]).toEqual(ingredient2);
      expect(result.selectedItems.fillingItems[1]).toEqual(ingredient1);
    });
  });

  describe('clearCompletedOrder', () => {
    it('should clear completed order data', () => {
      const initialState = {
        ...builderDefaultState,
        completedOrderData: {
          _id: 'order-id',
          status: 'done',
          name: 'Test Order',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
          number: 12345,
          ingredients: ['1', '2']
        }
      };

      const action = clearCompletedOrder();
      const result = builderReducer(initialState, action);

      expect(result.completedOrderData).toBe(null);
    });
  });

  describe('submitOrderAction async thunk', () => {
    it('should handle pending state', () => {
      const action = { type: submitOrderAction.pending.type };
      const result = builderReducer(builderDefaultState, action);

      expect(result.isProcessing).toBe(true);
      expect(result.errorMessage).toBe(null);
    });

    it('should handle fulfilled state', () => {
      const mockOrder = {
        _id: 'order-id',
        status: 'done',
        name: 'Test Order',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        number: 12345,
        ingredients: ['1', '2']
      };

      const initialState = {
        ...builderDefaultState,
        selectedItems: {
          bunItem: mockBun,
          fillingItems: [{ ...mockIngredient, id: 'test-id' }]
        },
        isProcessing: true
      };

      const action = {
        type: submitOrderAction.fulfilled.type,
        payload: { order: mockOrder }
      };
      const result = builderReducer(initialState, action);

      expect(result.isProcessing).toBe(false);
      expect(result.isOrderSubmitting).toBe(false);
      expect(result.completedOrderData).toEqual(mockOrder);
      expect(result.selectedItems.bunItem).toBe(null);
      expect(result.selectedItems.fillingItems).toEqual([]);
      expect(result.errorMessage).toBe(null);
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Order submission failed';
      const action = {
        type: submitOrderAction.rejected.type,
        error: { message: errorMessage }
      };
      const result = builderReducer(builderDefaultState, action);

      expect(result.isProcessing).toBe(false);
      expect(result.errorMessage).toBe(errorMessage);
    });
  });
});

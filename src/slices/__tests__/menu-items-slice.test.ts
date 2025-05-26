import menuItemsReducer, {
  menuItemsDefaultState,
  loadMenuItemsAction
} from '../menu-items-slice';
import type { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
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
  },
  {
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
  }
];

describe('menu-items slice', () => {
  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(menuItemsReducer(undefined, { type: 'unknown' })).toEqual(
        menuItemsDefaultState
      );
    });
  });

  describe('loadMenuItemsAction async thunk', () => {
    it('should handle pending state', () => {
      const action = { type: loadMenuItemsAction.pending.type };
      const result = menuItemsReducer(menuItemsDefaultState, action);

      expect(result.isLoading).toBe(true);
      expect(result.errorMessage).toBe(null);
    });

    it('should handle fulfilled state', () => {
      const initialState = {
        ...menuItemsDefaultState,
        isLoading: true
      };

      const action = {
        type: loadMenuItemsAction.fulfilled.type,
        payload: mockIngredients
      };
      const result = menuItemsReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.availableItems).toEqual(mockIngredients);
      expect(result.errorMessage).toBe(null);
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Failed to load ingredients';
      const initialState = {
        ...menuItemsDefaultState,
        isLoading: true
      };

      const action = {
        type: loadMenuItemsAction.rejected.type,
        error: { message: errorMessage }
      };
      const result = menuItemsReducer(initialState, action);

      expect(result.isLoading).toBe(false);
      expect(result.errorMessage).toBe(errorMessage);
      expect(result.availableItems).toEqual([]);
    });
  });
});

import type React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { BurgerIngredient } from '../burger-ingredient';
import builderReducer from '../../../slices/builder-slice';
import type { TIngredient } from '@utils-types';

const mockIngredient: TIngredient = {
  _id: '1',
  name: 'Test Ingredient',
  type: 'main',
  proteins: 20,
  fat: 10,
  carbohydrates: 30,
  calories: 200,
  price: 100,
  image: 'test.jpg',
  image_large: 'test_large.jpg',
  image_mobile: 'test_mobile.jpg'
};

const mockStore = configureStore({
  reducer: {
    builder: builderReducer
  }
});

const renderWithProviders = (component: React.ReactElement) =>
  render(
    <Provider store={mockStore}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );

describe('BurgerIngredient', () => {
  it('should render ingredient information', () => {
    renderWithProviders(
      <BurgerIngredient ingredient={mockIngredient} count={0} />
    );

    expect(screen.getByText('Test Ingredient')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Добавить')).toBeInTheDocument();
  });

  it('should show counter when count > 0', () => {
    renderWithProviders(
      <BurgerIngredient ingredient={mockIngredient} count={2} />
    );

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should dispatch add action on button click', () => {
    const { container } = renderWithProviders(
      <BurgerIngredient ingredient={mockIngredient} count={0} />
    );

    const addButton = screen.getByText('Добавить');
    fireEvent.click(addButton);

    // Проверяем, что состояние изменилось
    const state = mockStore.getState();
    expect(state.builder.selectedItems.fillingItems).toHaveLength(1);
  });
});

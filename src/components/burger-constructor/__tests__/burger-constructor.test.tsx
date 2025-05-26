import type React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { BurgerConstructor } from '../burger-constructor';
import builderReducer from '../../../slices/builder-slice';
import accountReducer from '../../../slices/account-slice';

const mockStore = configureStore({
  reducer: {
    builder: builderReducer,
    account: accountReducer
  },
  preloadedState: {
    builder: {
      isProcessing: false,
      selectedItems: {
        bunItem: null,
        fillingItems: []
      },
      isOrderSubmitting: false,
      completedOrderData: null,
      errorMessage: null
    },
    account: {
      isProcessing: false,
      currentUser: null,
      hasAccess: false,
      errorMessage: null
    }
  }
});

const renderWithProviders = (component: React.ReactElement) =>
  render(
    <Provider store={mockStore}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );

// Мокаем react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('BurgerConstructor', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should render empty constructor', () => {
    renderWithProviders(<BurgerConstructor />);

    expect(screen.getAllByText('Выберите булки')).toHaveLength(2);
    expect(screen.getByText('Выберите начинку')).toBeInTheDocument();
    expect(screen.getByText('Оформить заказ')).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
    renderWithProviders(<BurgerConstructor />);

    const orderButton = screen.getByText('Оформить заказ');
    fireEvent.click(orderButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});

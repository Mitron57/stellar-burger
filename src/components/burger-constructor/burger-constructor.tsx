import { type FC, useMemo } from 'react';
import type { TConstructorIngredient } from '../../utils/types';
import { BurgerConstructorUI } from '../ui';
import { useAppSelector, useAppDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  getBuilderStateInfo,
  submitOrderAction,
  clearCompletedOrder,
  checkAccessStatus
} from '../../slices';

export const BurgerConstructor: FC = () => {
  const navigator = useNavigate();
  const dispatcher = useAppDispatch();
  const builderData = useAppSelector(getBuilderStateInfo);
  const isAuthenticated = useAppSelector(checkAccessStatus);

  const { selectedItems, isOrderSubmitting, completedOrderData, isProcessing } =
    builderData;

  const onOrderClick = () => {
    if (!isAuthenticated) {
      navigator('/login');
      return;
    }
    if (!selectedItems.bunItem || isOrderSubmitting) return;

    const orderItemIds = [
      selectedItems.bunItem._id,
      ...selectedItems.fillingItems.map(
        (item: TConstructorIngredient) => item._id
      ),
      selectedItems.bunItem._id
    ];
    dispatcher(submitOrderAction(orderItemIds));
  };

  const closeOrderModal = () => {
    dispatcher(clearCompletedOrder());
  };

  const totalPrice = useMemo(
    () =>
      (selectedItems.bunItem ? selectedItems.bunItem.price * 2 : 0) +
      selectedItems.fillingItems.reduce(
        (sum: number, item: TConstructorIngredient) => sum + item.price,
        0
      ),
    [selectedItems]
  );

  return (
    <BurgerConstructorUI
      constructorItems={{
        bun: selectedItems.bunItem,
        ingredients: selectedItems.fillingItems
      }}
      orderRequest={isOrderSubmitting}
      price={totalPrice}
      orderModalData={completedOrderData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

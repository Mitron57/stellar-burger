'use client';

import type { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useAppSelector } from '@store';
import { getAvailableMenuItems, getMenuItemsStateInfo } from '@slices';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const itemId = useParams().id;
  const availableItems = useAppSelector(getAvailableMenuItems);
  const { isLoading } = useAppSelector(getMenuItemsStateInfo);
  const selectedItem = availableItems.find((item) => item._id === itemId);

  // Show preloader while loading or when item is not found
  if (isLoading || !availableItems.length || !selectedItem) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={selectedItem} />;
};

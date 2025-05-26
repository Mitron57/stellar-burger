'use client';

import type { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useAppSelector } from '@store';
import { getAvailableMenuItems } from '@slices';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const itemId = useParams().id;

  const availableItems = useAppSelector(getAvailableMenuItems);
  const selectedItem = availableItems.find((item) => item._id === itemId);

  if (!selectedItem) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={selectedItem} />;
};

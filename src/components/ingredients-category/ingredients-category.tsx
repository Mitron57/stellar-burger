'use client';

import { forwardRef, useMemo } from 'react';
import type { TIngredientsCategoryProps } from './type';
import type { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useAppSelector } from '@store';
import { getBuilderStateInfo } from '@slices';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const builderData = useAppSelector(getBuilderStateInfo).selectedItems;

  const itemCounters = useMemo(() => {
    const { bunItem, fillingItems } = builderData;
    const counters: { [key: string]: number } = {};
    fillingItems.forEach((item: TIngredient) => {
      if (!counters[item._id]) counters[item._id] = 0;
      counters[item._id]++;
    });
    if (bunItem) counters[bunItem._id] = 2;
    return counters;
  }, [builderData]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={itemCounters}
      ref={ref}
    />
  );
});

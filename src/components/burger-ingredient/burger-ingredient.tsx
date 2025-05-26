import { type FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import type { TBurgerIngredientProps } from './type';
import { useAppDispatch } from '@store';
import { includeItem } from '@slices';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const currentLocation = useLocation();
    const dispatcher = useAppDispatch();

    const handleItemAddition = () => {
      dispatcher(includeItem(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: currentLocation }}
        handleAdd={handleItemAddition}
      />
    );
  }
);

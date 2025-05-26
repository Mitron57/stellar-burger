import { type FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import type { BurgerConstructorElementProps } from './type';
import { useAppDispatch } from '@store';
import { excludeItem, shiftItemDown, shiftItemUp } from '@slices';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatcher = useAppDispatch();

    const handleItemShiftDown = () => {
      dispatcher(shiftItemDown(index));
    };

    const handleItemShiftUp = () => {
      dispatcher(shiftItemUp(index));
    };

    const handleItemRemoval = () => {
      dispatcher(excludeItem(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleItemShiftUp}
        handleMoveDown={handleItemShiftDown}
        handleClose={handleItemRemoval}
      />
    );
  }
);

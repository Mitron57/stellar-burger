import styles from './constructor-page.module.css';

import { BurgerIngredients } from '@components';
import { BurgerConstructor } from '@components';
import { Preloader } from '@ui';
import type { FC } from 'react';
import { useAppSelector } from '@store';
import { getMenuItemsStateInfo } from '@slices';

export const ConstructorPage: FC = () => {
  const isItemsLoading = useAppSelector(getMenuItemsStateInfo).isLoading;

  return (
    <>
      {isItemsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};

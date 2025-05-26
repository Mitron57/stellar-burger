'use client';

import { useState, useRef, useEffect, type FC } from 'react';
import { useInView } from 'react-intersection-observer';

import type { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useAppSelector } from '@store';
import { getAvailableMenuItems } from '@slices';

export const BurgerIngredients: FC = () => {
  const availableItems: TIngredient[] = useAppSelector(getAvailableMenuItems);

  const bunItems = availableItems.filter((item) => {
    if (item.type === 'bun') {
      return item;
    }
  });
  const mainItems = availableItems.filter((item) => {
    if (item.type === 'main') {
      return item;
    }
  });
  const sauceItems = availableItems.filter((item) => {
    if (item.type === 'sauce') {
      return item;
    }
  });

  const [activeTab, setActiveTab] = useState<TTabMode>('bun');
  const bunTitleRef = useRef<HTMLHeadingElement>(null);
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const sauceTitleRef = useRef<HTMLHeadingElement>(null);

  const [bunSectionRef, bunInView] = useInView({
    threshold: 0
  });

  const [mainSectionRef, mainInView] = useInView({
    threshold: 0
  });

  const [sauceSectionRef, sauceInView] = useInView({
    threshold: 0
  });

  useEffect(() => {
    if (bunInView) {
      setActiveTab('bun');
    } else if (sauceInView) {
      setActiveTab('sauce');
    } else if (mainInView) {
      setActiveTab('main');
    }
  }, [bunInView, mainInView, sauceInView]);

  const handleTabSelection = (selectedTab: string) => {
    setActiveTab(selectedTab as TTabMode);
    if (selectedTab === 'bun')
      bunTitleRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (selectedTab === 'main')
      mainTitleRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (selectedTab === 'sauce')
      sauceTitleRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={activeTab}
      buns={bunItems}
      mains={mainItems}
      sauces={sauceItems}
      titleBunRef={bunTitleRef}
      titleMainRef={mainTitleRef}
      titleSaucesRef={sauceTitleRef}
      bunsRef={bunSectionRef}
      mainsRef={mainSectionRef}
      saucesRef={sauceSectionRef}
      onTabClick={handleTabSelection}
    />
  );
};

import React from 'react'
import * as s from './Category.styled'
import { ItemCard } from '../ItemCard'

/**
 *
 * @param {{
  *  categoryName: string,
  *  items: import('../../types').Item[],
  *  selectItem: () => void,
  * }} props
  */
export const Category = ({ categoryName, items, selectItem }) => (
  <s.CategoryContainer>
    <s.CategoryName>{categoryName}</s.CategoryName>
    <s.ItemCardsContainer>
      {items.map(item => (
        <ItemCard key={item.id} item={item} selectItem={selectItem} />
      ))}
    </s.ItemCardsContainer>
  </s.CategoryContainer>
)

import React from 'react'
import * as s from './Category.styled'
import { ItemCard } from '../ItemCard'

/**
 *
 * @param {{
  *  categoryName: string,
  *  items: import('../../types').Item[],
  *  openModal: () => void,
  * }} props
  */
export const Category = ({ categoryName, items, openModal }) => (
  <s.CategoryContainer>
    <s.CategoryName>{categoryName}</s.CategoryName>
    <s.ItemCardsContainer>
      {items.map(item => (
        <ItemCard key={item.id} item={item} openModal={openModal} />
      ))}
    </s.ItemCardsContainer>
  </s.CategoryContainer>
)

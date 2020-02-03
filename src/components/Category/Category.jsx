import React from 'react'
import * as s from './Category.styled'
import { ItemCard } from '../ItemCard'

export const Category = ({ categoryName, items }) => (
  <s.CategoryContainer>
    <s.CategoryName>{categoryName}</s.CategoryName>
    <s.ItemCardsContainer>
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </s.ItemCardsContainer>
  </s.CategoryContainer>
)

import React from 'react'
import * as s from './Category.styled'
import { ItemCard } from '../ItemCard'

export const Category = () => (
  <s.CategoryContainer>
    <s.CategoryName>Category Name</s.CategoryName>
  <s.ItemCardsContainer>
    <ItemCard />
    <ItemCard />
    <ItemCard />
    <ItemCard />
    <ItemCard />
    <ItemCard />
    <ItemCard />
    <ItemCard />
  </s.ItemCardsContainer>
  </s.CategoryContainer>
)

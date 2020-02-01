import React from 'react'
import * as s from './Category.styled'
import { ItemCard } from '../ItemCard'

export const Category = () => (
  <s.CategoryContainer>
    <ItemCard />
    <ItemCard />
    <ItemCard />
    <ItemCard />
  </s.CategoryContainer>
)

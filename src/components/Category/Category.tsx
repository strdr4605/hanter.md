import React from 'react'
import * as s from './Category.styled'
import { ItemCard } from '../ItemCard'
import { Item } from '../../types'

interface Props {
  categoryName: string
  items: Item[]
  selectItem: (item: Item) => void
}

export const Category: React.FC<Props> = props => {
  const { categoryName, selectItem, items } = props

  return (
    <s.CategoryContainer>
      <s.CategoryName>{categoryName}</s.CategoryName>
      <s.ItemCardsContainer>
        {items.map(item => (
          <ItemCard key={item.id} item={item} selectItem={selectItem} />
        ))}
      </s.ItemCardsContainer>
    </s.CategoryContainer>
  )
}

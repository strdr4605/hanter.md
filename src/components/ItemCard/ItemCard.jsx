import React, { useCallback } from 'react'
import * as s from './ItemCard.styled'

/**
 *
 * @param {{
 *  item: import('../../types').Item,
 *  selectItem: () => void,
 * }} props
 */
export const ItemCard = ({ item, selectItem }) => {
  const onClick = useCallback(() => selectItem(item), [item, selectItem])
  return (
  <s.ItemContainer onClick={onClick}>
    <s.ItemImg src={item.imgSrc} />
    <s.ItemTitle>{item.title}</s.ItemTitle>
    <s.ItemDescription>{item.description}</s.ItemDescription>
  </s.ItemContainer>
)
  }

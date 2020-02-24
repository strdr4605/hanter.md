import React, { useCallback } from 'react'
import * as s from './ItemCard.styled'
import { getImage } from '../../utils'

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
      <s.ItemImgContainer>
        <s.ItemImg src={getImage(item.imgSrc)} />
      </s.ItemImgContainer>
      <s.ItemInfo>
        <s.ItemTitle>{item.title}</s.ItemTitle>
        <s.ItemDescription>{item.description}</s.ItemDescription>
      </s.ItemInfo>
    </s.ItemContainer>
  )
}

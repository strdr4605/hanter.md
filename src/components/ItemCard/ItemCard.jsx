import React from 'react'
import * as s from './ItemCard.styled'

/**
 *
 * @param {{
 *  item: import('../../types').Item,
 *  openModal: () => void,
 * }} props
 */
export const ItemCard = ({ item, openModal }) => (
  <s.ItemContainer onClick={openModal}>
    <s.ItemImg src={item.imgSrc} />
    <s.ItemInfo>{item.info}</s.ItemInfo>
  </s.ItemContainer>
)

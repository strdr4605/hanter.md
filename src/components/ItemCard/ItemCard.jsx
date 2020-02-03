import React from 'react'
import * as s from './ItemCard.styled'

export const ItemCard = ({ item }) => (
  <s.ItemContainer>
    <s.ItemImg src={item.imgSrc} />
    <s.ItemInfo>{item.info}</s.ItemInfo>
  </s.ItemContainer>
)

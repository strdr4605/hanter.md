import React from 'react'
import { FaRegWindowClose } from 'react-icons/fa'
import * as s from './RightModal.styled'
import { getImage } from '../../utils'
import { List } from '../../types'

const ModalItemTitle: React.FC<{ title: string }> = ({ title }) => (
  <s.ModalItemTitleContainer>
    <s.ModalItemTitle>{title}</s.ModalItemTitle>
  </s.ModalItemTitleContainer>
)

const CloseModal: React.FC<{ onClick(): void }> = ({ onClick }) => (
  <s.CloseModal onClick={onClick} type="button">
    <FaRegWindowClose />
  </s.CloseModal>
)

const ModalItemList: React.FC<{ list: List }> = ({ list }) => (
  <>
    <s.ModalItemListName>{list.name}</s.ModalItemListName>
    <s.ModalItemList>
      {list.elements.map((el: string, i: number) => (
        <s.ModalItemListElement key={i}>{el}</s.ModalItemListElement>
      ))}
    </s.ModalItemList>
  </>
)

interface Props {
  selectedItem: import('../../types').Item
  closeModal: () => void
}

export const RightModal: React.FC<Props> = ({ selectedItem, closeModal }) => {
  if (!selectedItem) {
    return null
  }

  function onOverlayClick(e) {
    closeModal()
    e.stopPropagation()
  }

  function onContentClick(e) {
    e.stopPropagation()
  }

  return (
    <s.StickyContainer>
      <s.ModalOverlay onClick={onOverlayClick}>
        <s.ModalContent onClick={onContentClick}>
          <s.ModalTop>
            <ModalItemTitle title={selectedItem.title} />
            <CloseModal onClick={closeModal} />
          </s.ModalTop>
          <s.ItemImgContainer>
            <s.ItemImg src={getImage(selectedItem.imgSrc)} />
          </s.ItemImgContainer>
          <s.ItemDescription>{selectedItem.description}</s.ItemDescription>
          {selectedItem.list && <ModalItemList list={selectedItem.list} />}
        </s.ModalContent>
      </s.ModalOverlay>
    </s.StickyContainer>
  )
}

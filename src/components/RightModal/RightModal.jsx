import React from 'react'
import { FaRegWindowClose } from 'react-icons/fa'
import * as s from './RightModal.styled'

const ModalItemTitle = ({ title }) => (
  <s.ModalItemTitleContainer>
    <s.ModalItemTitle>{title}</s.ModalItemTitle>
  </s.ModalItemTitleContainer>
)

const CloseModal = ({ onClick }) => (
  <s.CloseModal onClick={onClick} type="button">
    <FaRegWindowClose />
  </s.CloseModal>
)

/**
 *
 * @param {{
 *  isModalOpen: boolean,
 *  closeModal: () => void,
 * }} props
 */
export const RightModal = ({ isModalOpen, closeModal }) => {
  if (!isModalOpen) {
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
            <ModalItemTitle title="Item title" />
            <CloseModal onClick={closeModal}/>
          </s.ModalTop>
        </s.ModalContent>
      </s.ModalOverlay>
    </s.StickyContainer>
  )
}

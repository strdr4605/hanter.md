import React from 'react'
import { FaRegWindowClose } from 'react-icons/fa'
import * as s from './RightModal.styled'

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
          <s.ModalItemTitleContainer>
            <s.ModalItemTitle>Modal text!</s.ModalItemTitle>
          </s.ModalItemTitleContainer>
          <s.CloseModal onClick={closeModal} type="button">
            <FaRegWindowClose />
          </s.CloseModal>
        </s.ModalTop>
      </s.ModalContent>
    </s.ModalOverlay>
    </s.StickyContainer>
  )
}

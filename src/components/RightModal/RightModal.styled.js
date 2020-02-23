import styled from 'styled-components'

/**
 * @todo Fix styling on Footer enter
 */
export const StickyContainer = styled.div`
  ${tw`absolute`};
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

export const ModalOverlay = styled.div`
  ${tw`sticky`};
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.25);
`

export const ModalContent = styled.div`
  ${tw`flex flex-col p-4 bg-grey-lighter absolute h-full w-11/12 sm:max-w-sm overflow-scroll`};
  right: 0;
  animation-duration: 0.3s;
  animation-name: slidein;

  @keyframes slidein {
    from {
      right: -100%;
    }

    to {
      right: 0;
    }
  }
`

export const ModalTop = styled.div`
  ${tw`flex items-center`};
`
export const ModalItemTitleContainer = styled.div`
  ${tw`flex flex-1 overflow-hidden`};
`

export const ModalItemTitle = styled.h3`
  ${tw`m-0 pb-1`};
  border-bottom: 2px solid;
`

export const CloseModal = styled.button`
  ${tw`w-12 h-12 self-start text-2xl p-0 m-0 border-0 bg-transparent`};
`

export const ItemDescription = styled.div`
  ${tw`w-full my-3`};
`

export const ItemImgContainer = styled.div`
  ${tw`w-full`};
`

export const ItemImg = styled.img`
  ${tw`m-auto max-w-full`};
`

export const ModalItemListName = styled.h4``

export const ModalItemList = styled.ul``

export const ModalItemListElement = styled.li`
  ${tw`m-0`};
`

import styled from 'styled-components'

export const ModalOverlay = styled.div`
  ${tw`absolute`};
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.25);
`

export const ModalContent = styled.div`
  ${tw`flex flex-col p-4 bg-red absolute h-full w-11/12 sm:max-w-sm`};
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

import styled from 'styled-components'

export const ItemContainer = styled.div`
  ${tw`
    flex
    flex-col
    w-84
    h-108
    m-2
    sm:w-56
    sm:h-80
    bg-grey-lightest
    border-2
    border-solid
    border-transparent
    hover:border-green
    rounded
  `};
`

export const ItemInfo = styled.div`
  ${tw`flex overflow-hidden flex-col`};
`

export const ItemDescription = styled.div`
  ${tw`mb-1 px-2 leading-tight text-sm`};
`

export const ItemTitle = styled.div`
  ${tw`self-center font-bold p-1`};
`

export const ItemImg = styled.img`
  ${tw`m-0 h-full w-full`};
  object-fit: cover;
`

export const ItemImgContainer = styled.div`
  ${tw`h-80 md:h-48`};
`

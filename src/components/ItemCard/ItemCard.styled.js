import styled from 'styled-components'

export const ItemContainer = styled.div`
  ${tw`
    flex
    flex-col
    w-full
    m-2
    sm:w-56
    h-80
    bg-grey-lightest
    border-2
    border-solid
    border-transparent
    hover:border-green
    rounded
  `};
`

export const ItemInfo = styled.div`
  ${tw`h-24 w-full`};
`
export const ItemImg = styled.img`
  ${tw`w-full m-0`};
`

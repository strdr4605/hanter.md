import styled from 'styled-components'

export const ItemContainer = styled.div`
  ${tw`
    flex
    flex-col
    w-84
    h-120
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
  ${tw`h-full w-full`};
`
export const ItemImg = styled.img`
  ${tw`m-0 h-4/5`};
`

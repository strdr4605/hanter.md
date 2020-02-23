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

export const ItemDescription = styled.div`
  ${tw`h-full overflow-hidden mb-1  px-2`};
`

export const ItemTitle = styled.div`
  ${tw`flex justify-center p-1`};
`

export const ItemImg = styled.img`
  ${tw`m-0 h-4/5`};
`

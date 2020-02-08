import { Link } from 'gatsby'
import styled from 'styled-components'

export const MainContainer = styled.div`
  ${tw`mx-auto w-11/12 lg:w-3/4`};
`

export const HeaderFlex = styled(MainContainer)`
  ${tw`flex`};
`

export const HeaderContainer = styled.div`
  ${tw`flex bg-grey-lightest h-16 items-center`};
`

export const HeaderTitle = styled.h1`
  ${tw`text-grey-darkest m-0`};
`

export const HeaderStyledLink = styled(Link)`
  ${tw`no-underline text-inherit flex-1`};
`

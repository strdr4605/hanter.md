import { Link } from 'gatsby'
import styled from 'styled-components'

export const HeaderContainer = styled.div`
  ${tw`container flex-grow-0 bg-grey-lightest`};
`
export const HeaderTitle = styled.h1`
  ${tw`text-grey-darkest m-0`};
`
export const HeaderStyledLink = styled(Link)`
  ${tw`no-underline text-inherit`};
`

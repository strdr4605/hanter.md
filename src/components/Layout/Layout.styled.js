import styled from 'styled-components'
import { MainContainer } from '../styled'

export const Flex = styled.div`
  ${tw`min-h-screen flex flex-col`};
`

export const Content = styled(MainContainer)`
  ${tw`flex-grow font-sans`};
`

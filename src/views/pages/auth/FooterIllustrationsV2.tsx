// ** React Imports
import { Fragment } from 'react'

// ** MUI Components
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

interface FooterIllustrationsProp {
  image?: string
}

// Styled Components
const MaskImg = styled('img')(({ theme }) => ({
  zIndex: -1,
  bottom: '7%',
  width: '100%',
  position: 'absolute',
  [theme.breakpoints.down('lg')]: {
    bottom: '17.5%'
  }
}))

const FooterIllustrationsV2 = (props: FooterIllustrationsProp) => {
  // ** Props
  const { image } = props

  // ** Hook
  const theme = useTheme()

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const src = image || `/images/pages/background.svg`

  if (!hidden) {
    return (
      <Fragment>
        {theme.palette.mode == "dark" &&  <MaskImg alt='mask' src={src} />}
      </Fragment>
    )
  } else {
    return null
  }
}

export default FooterIllustrationsV2

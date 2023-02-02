// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2 }}>
        {`© ${new Date().getFullYear()}, Made with `}
        <Box component='span' sx={{ color: 'error.main' }}>
          ❤️
        </Box>
        {` by `}
        <Link target='_blank' href=' '>
          Angelson Technical Co, Ltd
        </Link>
      </Typography>
      {hidden ? null : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>
          <a href="https://t.me/betting_for_u" target='blank'><img style={{ width: '30px' }} src='/images/icons/contact/telegram.webp' alt="betting4u-telegram" /></a>
          <a href="https://discord.gg/KyUJcc2a" target='blank'><img style={{ width: '30px' }} src='/images/icons/contact/discord.webp' alt="betting4u-discord" /></a>
          <a href='' target={'_blank'}><img style={{ width: '30px' }} src='/images/icons/contact/twitter.webp' alt="betting4u-twitter" /></a>
          <a href='' target={'_blank'}><img style={{ width: '30px' }} src='/images/icons/contact/facebook.webp' alt="betting4u-facebook" /></a>
        </Box>
      )}
    </Box>
  )
}

export default FooterContent

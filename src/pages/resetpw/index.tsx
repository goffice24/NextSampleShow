// ** React Imports
import { ReactNode, useState } from 'react'
import { useRouter } from "next/router";

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import MuiLink from '@mui/material/Link'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Icons Imports
import ChevronLeft from 'mdi-material-ui/ChevronLeft'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { useAuth } from 'src/hooks/useAuth'

import Lottie from 'lottie-react'
import myAni from 'src/components/animation.json' 

// Styled Components
const ForgotPasswordIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    padding: theme.spacing(20),
    paddingRight: '0 !important',
    [theme.breakpoints.down('lg')]: {
        padding: theme.spacing(10)
    }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    width: '100%',
    [theme.breakpoints.up('md')]: {
        maxWidth: 400
    },
    [theme.breakpoints.up('lg')]: {
        maxWidth: 450
    }
}))

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    width: '100%',
    [theme.breakpoints.down('md')]: {
        maxWidth: 400
    }
}))

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
    fontWeight: 600,
    letterSpacing: '0.18px',
    marginBottom: theme.spacing(1.5),
    [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))

const ResetPassword = () => {
    // ** Hooks
    const theme = useTheme()
    const { settings } = useSettings()
    const auth = useAuth();
    const { query } = useRouter();
    const router = useRouter();


    // ** Vars
    const { skin } = settings
    const hidden = useMediaQuery(theme.breakpoints.down('md'))
    const [pw, setPw] = useState("");

    const reset = () => {
        const access_token = "Bearer " + query.token;
        auth.resetPassword(
            {
                password: pw,
                access_token
            }
        )
        router.push('/login', undefined, {
            shallow: true
        })
    }

    return (
        <Box className='content-right'>
            {!hidden ? (
                <Box sx={{ flex: 1, display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
                    <ForgotPasswordIllustrationWrapper>
                        <Lottie animationData={myAni} />
                    </ForgotPasswordIllustrationWrapper>
                    <FooterIllustrationsV2 image={`/images/pages/background.svg`} />
                </Box>
            ) : null}
            <RightWrapper sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}>
                <Box
                    sx={{
                        p: 7,
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'background.paper'
                    }}
                >
                    <BoxWrapper>
                        <Box
                            sx={{
                                top: 30,
                                left: 40,
                                display: 'flex',
                                position: 'absolute',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <img style={{ maxHeight: '50px' }} src={theme.palette.mode == "light" ? "/images/logo/logo-dark.png" : "/images/logo/logo-white.png"} alt="" />
                        </Box>
                        <Box sx={{ mb: 6 }}>
                            <TypographyStyled variant='h5'>Reset Password? 🔒</TypographyStyled>
                            <Typography variant='body2'>
                                Enter your new password, we&prime;ll reset your password
                            </Typography>
                        </Box>
                        <TextField autoFocus type='text' label='New Password' sx={{ display: 'flex', mb: 4 }} value={pw} onChange={(e) => setPw(e.target.value)} />
                        <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 5.25 }} onClick={() => reset()}>
                            Reset
                        </Button>
                        <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Link passHref href='/login'>
                                <Typography
                                    component={MuiLink}
                                    sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', justifyContent: 'center' }}
                                >
                                    <ChevronLeft sx={{ mr: 1.5, fontSize: '2rem' }} />
                                    <span>Back to login</span>
                                </Typography>
                            </Link>
                        </Typography>
                    </BoxWrapper>
                </Box>
            </RightWrapper>
        </Box>
    )
}

ResetPassword.guestGuard = true
ResetPassword.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default ResetPassword

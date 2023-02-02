// ** React Imports
import { ReactNode, useState, Fragment, MouseEvent } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import MuiLink from '@mui/material/Link'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Icons Imports
import Google from 'mdi-material-ui/Google'
import Github from 'mdi-material-ui/Github'
import Twitter from 'mdi-material-ui/Twitter'
import Facebook from 'mdi-material-ui/Facebook'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

import { v4 } from 'uuid';

import Lottie from 'lottie-react'
import myAni from 'src/components/animation.json'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CRC32 = require('crc-32');

const defaultValues = {
  email: '',
  username: '',
  password: '',
  terms: false
}

// ** Styled Components
const RegisterIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
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

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))
const Register = () => {
  // ** States
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [mailCheck, setMailCheck] = useState(true);
  const [sendCode, setSendCode] = useState(false);
  const [code, setCode] = useState("");
  const [originCode, setOriginCode] = useState(0);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { register } = useAuth()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings
  const schema = yup.object().shape({
    password: yup.string().min(5).required(),
    username: yup.string().min(3).required(),
    email: yup.string().email().required(),
    terms: yup.bool().oneOf([true], 'You must accept the privacy policy & terms')
  })

  const {
    control,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const sendVerify = () => {
    const code = Math.abs(CRC32.str(v4()))
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    auth.verifyEmail({ email: email, token: code }, () => {
    })
    setOriginCode(code);
    setSendCode(true)
  }

  const handleCode = (e: any) => {
    const resCode = e.target.value;
    setCode(e.target.value);
    if (resCode == originCode) {
      setMailCheck(true);
    }
  }

  const registerUser = () => {
    const data = {
      name: username,
      email,
      avatar: "",
      password,
      history: [],
      token: "",
      role: "",
      online: true,
      other: ""
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    auth.register(data, () => {
    })
  }

  return (
    <Box className='content-right'>
      {!hidden ? (
        <Box sx={{ flex: 1, display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          <RegisterIllustrationWrapper>
            <Lottie animationData={myAni} />
          </RegisterIllustrationWrapper>
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
              <TypographyStyled variant='h5'>Adventure starts here 🚀</TypographyStyled>
              <Typography variant='body2'>Make your app management easy and fun!</Typography>
            </Box>
            <TextField
              fullWidth sx={{ mb: 4 }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              label='Username'
              placeholder='Username' 
            />
            <TextField
              fullWidth sx={{ mb: 4 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label='Email'
              error={Boolean(errors.email)} 
            />
            {
              mailCheck == false ?
                <>
                  {sendCode ?
                    <TextField
                      fullWidth sx={{ mb: 4 }}
                      label='Verification code'
                      value={code}
                      onChange={(e) => handleCode(e)}
                      placeholder=''
                    /> : <Button fullWidth size='large' type='submit' variant='contained' onClick={() => sendVerify()} sx={{ mb: 7 }}>
                      Send Code
                    </Button>
                  }
                </> : <></>
            }
            {
              mailCheck ?
                <>

                  <FormControl fullWidth>
                    <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                      Password
                    </InputLabel>
                    <OutlinedInput
                      value={password}
                      label='Password'
                      onChange={(e) => setPassword(e.target.value)}
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    {errors.password && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.password.message}</FormHelperText>
                    )}
                  </FormControl>

                  <FormControl sx={{ my: 0 }} error={Boolean(errors.terms)}>
                    <Controller
                      name='terms'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <FormControlLabel
                            sx={{
                              ...(errors.terms ? { color: 'error.main' } : null),
                              '& .MuiFormControlLabel-label': { fontSize: '0.875rem' }
                            }}
                            control={
                              <Checkbox
                                checked={value}
                                onChange={onChange}
                                sx={errors.terms ? { color: 'error.main' } : null}
                              />
                            }
                            label={
                              <Fragment>
                                <Typography
                                  variant='body2'
                                  component='span'
                                  sx={{ color: errors.terms ? 'error.main' : '' }}
                                >
                                  I agree to{' '}
                                </Typography>
                                <Link href='/' passHref>
                                  <Typography
                                    variant='body2'
                                    component={MuiLink}
                                    sx={{ color: 'primary.main' }}
                                    onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
                                  >
                                    privacy policy & terms
                                  </Typography>
                                </Link>
                              </Fragment>
                            }
                          />
                        )
                      }}
                    />
                    {errors.terms && (
                      <FormHelperText sx={{ mt: 0, color: 'error.main' }}>{errors.terms.message}</FormHelperText>
                    )}
                  </FormControl>
                  <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }} onClick={() => registerUser()}>
                    Sign up
                  </Button>
                </> : <></>
            }

            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography sx={{ mr: 2, color: 'text.secondary' }}>Already have an account?</Typography>
              <Typography>
                <Link passHref href='/login'>
                  <Typography component={MuiLink} sx={{ color: 'primary.main' }}>
                    Sign in instead
                  </Typography>
                </Link>
              </Typography>
            </Box>
            <Divider sx={{ mt: 5, mb: 7.5, '& .MuiDivider-wrapper': { px: 4 } }}>or</Divider>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Link href='/' passHref>
                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                  <Facebook sx={{ color: '#497ce2' }} />
                </IconButton>
              </Link>
              <Link href='/' passHref>
                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                  <Twitter sx={{ color: '#1da1f2' }} />
                </IconButton>
              </Link>
              <Link href='/' passHref>
                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                  <Github
                    sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : theme.palette.grey[300]) }}
                  />
                </IconButton>
              </Link>
              <Link href='/' passHref>
                <IconButton component='a' onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}>
                  <Google sx={{ color: '#db4437' }} />
                </IconButton>
              </Link>
            </Box>

          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Register.guestGuard = true

export default Register

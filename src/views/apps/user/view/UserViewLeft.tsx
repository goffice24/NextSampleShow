/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContentText from '@mui/material/DialogContentText'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import InputAdornment from '@mui/material/InputAdornment'
import LinearProgress from '@mui/material/LinearProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'

// ** Icons Imports
import Check from 'mdi-material-ui/Check'
import Circle from 'mdi-material-ui/Circle'
import StarOutline from 'mdi-material-ui/StarOutline'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import { UsersType } from 'src/types/apps/userTypes'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Third Party Components
import toast from 'react-hot-toast'

import ReactS3Client from 'react-aws-s3-typescript';
import { s3Config } from 'src/configs/aws-s3'
import { useRouter } from 'next/router'
import Badge from '@mui/material/Badge'

interface Props {
  data: UsersType
}

interface ColorsType {
  [key: string]: ThemeColor
}

// ** Styled <sup> component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Sup = styled('sup')(({ theme }) => ({
  top: '0.2rem',
  left: '-0.6rem',
  position: 'absolute',
  color: theme.palette.primary.main
}))

// ** Styled <sub> component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Sub = styled('sub')({
  fontWeight: 400,
  fontSize: '.875rem',
  lineHeight: '1.25rem',
  alignSelf: 'flex-end'
})

const roleColors: ColorsType = {
  admin: 'error',
  editor: 'info',
  author: 'warning',
  maintainer: 'success',
  subscriber: 'primary'
}

// const statusColors: ColorsType = {
//   active: 'success',
//   pending: 'warning',
//   inactive: 'secondary'
// }

const UserViewLeft = ({ data }: Props) => {
  // ** Hooks 
  const auth = useAuth()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter()

  // ** States
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openPlans, setOpenPlans] = useState<boolean>(false)

  const [user, setUser] = useState<UsersType>(data);

  // Handle Edit dialog
  const handleEditClickOpen = () => setOpenEdit(true)
  const handleEditClose = () => setOpenEdit(false)

  // Handle Upgrade Plan dialog
  // const handlePlansClickOpen = () => setOpenPlans(true)
  // const handlePlansClose = () => setOpenPlans(false)   

  useEffect(() => {
    // setUser(data)
  }, [data])

  const imageChangeMain = async (e: any) => {
    const s3 = new ReactS3Client(s3Config);
    const filename = Date.now().toString();
    try {
      const res = await s3.uploadFile(e[0], filename);
      const s = { ...user };
      s.avatar = res.location;
      handleEditSave(s);
    } catch (exception) {
      console.log(exception);
    }
  }

  const handleEditSave = (updateUser: any) => {

    const url = process.env.NEXT_PUBLIC_API_HOST + '/api/users/' + user._id;
    axios
      .patch(
        url,
        updateUser,
        {
          headers: {
            Authorization: window.localStorage.getItem(authConfig.storageTokenKeyName)!
          }
        })
      .then(async response => {
        const u = response.data;
        setOpenEdit(false)
        const user = {
          _id: u._id,
          role: u.role,
          email: u.email,
          name: u.name,
          password: u.password,
          avatar: u.avatar,
          history: u.history,
          token: "",
          online: true,
          other: ""
        }
        setUser(user)
        auth.setUser(user)
        window.localStorage.setItem('userData', JSON.stringify(user))
        if (response.status == 200) {
          toast.success('Successfully updated!')
        } else {
          toast.error('Faild update')
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((e) => {
        toast.error('Faild update')
        setOpenEdit(false)
      })
  }

  const renderUserAvatar = () => {
    if (user) {
      if (user.avatar.length) {
        return (
          <label htmlFor="main-image">
            <Badge badgeContent={'+'} color='primary' >
              <CustomAvatar alt='User Image' src={user.avatar} variant='rounded' sx={{ width: 120, height: 120, mb: 4 }} />
            </Badge>
          </label>

        )
      } else {
        return (
          <label htmlFor="main-image">
            <Badge badgeContent={'+'} color='primary' >
              <CustomAvatar
                skin='light'
                variant='rounded'
                color={user.avatarColor as ThemeColor}
                sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem' }}
              >
                {getInitials(user?.name)}
              </CustomAvatar>
            </Badge>
          </label>
        )
      }
    } else {
      return null
    }
  }

  if (user) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <input accept="image/*" type="file" onChange={(e) => imageChangeMain(e.target.files)} id="main-image" style={{ display: 'none' }} />

          <Card>
            <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {renderUserAvatar()}
              <Typography variant='h6' sx={{ mb: 4 }}>
                {user?.name}
              </Typography>
              <CustomChip
                skin='light'
                size='small'
                label={user.role}
                color={roleColors[user.role]}
                sx={{
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  textTransform: 'capitalize',
                  '& .MuiChip-label': { mt: -0.25 }
                }}
              />
            </CardContent>
            {/* 
            <CardContent sx={{ my: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ mr: 6, display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin='light' variant='rounded' sx={{ mr: 4, width: 44, height: 44 }}>
                    <Check />
                  </CustomAvatar>
                  <Box>
                    <Typography variant='h5' sx={{ lineHeight: 1.3 }}>
                      1.23k
                    </Typography>
                    <Typography variant='body2'>Task Done</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin='light' variant='rounded' sx={{ mr: 4, width: 44, height: 44 }}>
                    <StarOutline />
                  </CustomAvatar>
                  <Box>
                    <Typography variant='h5' sx={{ lineHeight: 1.3 }}>
                      568
                    </Typography>
                    <Typography variant='body2'>Project Done</Typography>
                  </Box>
                </Box> 
              </Box>
            </CardContent> */}

            <CardContent>
              <Typography variant='h6'>Details</Typography>
              <Divider sx={{ mt: 4 }} />
              <Box sx={{ pt: 2, pb: 1 }}>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                    Username:
                  </Typography>
                  <Typography variant='body2'>@{user.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                    Account Email:
                  </Typography>
                  <Typography variant='body2'>{user.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Role:</Typography>
                  <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                    {user.role}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Phone:</Typography>
                  <Typography variant='body2' sx={{ textTransform: 'capitalize' }}>
                    {user.other}
                  </Typography>
                </Box>
                {/* <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Tax ID:</Typography>
                  <Typography variant='body2'>Tax-8894</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Contact:</Typography>
                  <Typography variant='body2'>+1 {data.contact}</Typography>
                </Box> */}
                <Box sx={{ display: 'flex', mb: 2.7 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, fontSize: '0.875rem' }}>Language:</Typography>
                  <Typography variant='body2'>English</Typography>
                </Box>
              </Box>
            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
                Edit
              </Button>
              <Button color='error' variant='outlined'>
                Suspend
              </Button>
            </CardActions>

            <Dialog
              open={openEdit}
              onClose={handleEditClose}
              aria-labelledby='user-view-edit'
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650, p: [2, 10] } }}
              aria-describedby='user-view-edit-description'
            >
              <DialogTitle id='user-view-edit' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
                Edit User Information
              </DialogTitle>
              <DialogContent>
                <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
                  Updating user details will receive a privacy audit.
                </DialogContentText>

                <Grid container spacing={6}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Username'
                      defaultValue={user.name}
                      InputProps={{ startAdornment: <InputAdornment position='start'>@</InputAdornment> }}
                      onChange={(e) => setUser({
                        ...data, name: e.target.value
                      })}
                    />
                  </Grid>
                  {/* <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type='email'
                      label='Account Email'
                      defaultValue={user.email}
                      onChange={(e) => setUser({
                        ...data, email: e.target.value
                      })}
                    />
                  </Grid> */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Phone'
                      defaultValue={user.other}
                      onChange={(e) => setUser({
                        ...data, other: e.target.value
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                  </Grid>
                  {/* <Grid item xs={12}>
                      <FormControlLabel
                        label='Use as a billing address?'
                        control={<Switch defaultChecked />}
                        sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
                      />
                    </Grid> */}
                </Grid>

              </DialogContent>
              <DialogActions sx={{ justifyContent: 'center' }}>
                <Button variant='contained' sx={{ mr: 1 }} onClick={() => handleEditSave(user)}>
                  Save
                </Button>
                <Button variant='outlined' color='secondary' onClick={handleEditClose}>
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </Card>
        </Grid>

        {/* <Grid item xs={12}>
          <Card sx={{ boxShadow: 'none', border: theme => `2px solid ${theme.palette.primary.main}` }}>
            <CardContent
              sx={{ display: 'flex', flexWrap: 'wrap', pb: '0 !important', justifyContent: 'space-between' }}
            >
              <CustomChip
                skin='light'
                size='small'
                color='primary'
                label='Standard'
                sx={{ fontSize: '0.75rem', borderRadius: '4px' }}
              />
              <Box sx={{ display: 'flex', position: 'relative' }}>
                <Sup>$</Sup>
                <Typography
                  variant='h3'
                  sx={{
                    mb: -1.2,
                    lineHeight: 1,
                    color: 'primary.main'
                  }}
                >
                  99
                </Typography>
                <Sub>/ month</Sub>
              </Box>
            </CardContent>

            <CardContent>
              <Box sx={{ mt: 6, mb: 6 }}>
                <Box sx={{ display: 'flex', mb: 2.5, alignItems: 'center' }}>
                  <Circle sx={{ mr: 2, fontSize: '0.625rem', color: 'grey.300' }} />
                  <Typography component='span' variant='body2'>
                    10 Users
                  </Typography>
                </Box>
                <Box sx={{ mt: 3.5, display: 'flex', mb: 2.5, alignItems: 'center' }}>
                  <Circle sx={{ mr: 2, fontSize: '0.625rem', color: 'grey.300' }} />
                  <Typography component='span' variant='body2'>
                    Up to 10GB storage
                  </Typography>
                </Box>
                <Box sx={{ mt: 3.5, display: 'flex', mb: 2.5, alignItems: 'center' }}>
                  <Circle sx={{ mr: 2, fontSize: '0.625rem', color: 'grey.300' }} />
                  <Typography component='span' variant='body2'>
                    Basic Support
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', mb: 1.5, justifyContent: 'space-between' }}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Days
                </Typography>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  26 of 30 Days
                </Typography>
              </Box>
              <LinearProgress value={86.66} variant='determinate' sx={{ height: 8, borderRadius: '5px' }} />
              <Typography variant='caption' sx={{ mt: 1.5, mb: 6 }}>
                4 days remaining
              </Typography>
              <Button variant='contained' sx={{ width: '100%' }} onClick={handlePlansClickOpen}>
                Upgrade Plan
              </Button>
            </CardContent>

            <Dialog
              open={openPlans}
              onClose={handlePlansClose}
              aria-labelledby='user-view-plans'
              aria-describedby='user-view-plans-description'
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650, pt: 8, pb: 8 } }}
            >
              <DialogTitle id='user-view-plans' sx={{ textAlign: 'center', fontSize: '1.5rem !important' }}>
                Upgrade Plan
              </DialogTitle>

              <DialogContent>
                <DialogContentText variant='body2' sx={{ textAlign: 'center' }} id='user-view-plans-description'>
                  Choose the best plan for the user.
                </DialogContentText>
              </DialogContent>

              <DialogContent
                sx={{
                  display: 'flex',
                  pb: 8,
                  pl: [6, 15],
                  pr: [6, 15],
                  alignItems: 'center',
                  flexWrap: ['wrap', 'nowrap'],
                  pt: theme => `${theme.spacing(2)} !important`
                }}
              >
                <FormControl fullWidth size='small' sx={{ mr: [0, 3], mb: [3, 0] }}>
                  <InputLabel id='user-view-plans-select-label'>Choose Plan</InputLabel>
                  <Select
                    label='Choose Plan'
                    defaultValue='Standard'
                    id='user-view-plans-select'
                    labelId='user-view-plans-select-label'
                  >
                    <MenuItem value='Basic'>Basic - $0/month</MenuItem>
                    <MenuItem value='Standard'>Standard - $99/month</MenuItem>
                    <MenuItem value='Enterprise'>Enterprise - $499/month</MenuItem>
                    <MenuItem value='Company'>Company - $999/month</MenuItem>
                  </Select>
                </FormControl>
                <Button variant='contained' sx={{ minWidth: ['100%', 0] }}>
                  Upgrade
                </Button>
              </DialogContent>

              <Divider sx={{ m: 0 }} />

              <DialogContent sx={{ pt: 8, pl: [6, 15], pr: [6, 15] }}>
                <Typography sx={{ fontWeight: 500, mb: 2, fontSize: '0.875rem' }}>
                  User current plan is standard plan
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: ['wrap', 'nowrap'],
                    justifyContent: 'space-between'
                  }}
                >
                  <Box sx={{ mr: 3, display: 'flex', ml: 2.4, position: 'relative' }}>
                    <Sup>$</Sup>
                    <Typography
                      variant='h3'
                      sx={{
                        mb: -1.2,
                        lineHeight: 1,
                        color: 'primary.main',
                        fontSize: '3rem !important'
                      }}
                    >
                      99
                    </Typography>
                    <Sub>/ month</Sub>
                  </Box>
                  <Button color='error' variant='outlined' sx={{ mt: 2 }}>
                    Cancel Subscription
                  </Button>
                </Box>
              </DialogContent>
            </Dialog>
          </Card>
        </Grid> */}
      </Grid>
    )
  } else {
    return null
  }
}

export default UserViewLeft

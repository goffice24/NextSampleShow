// ** MUI Imports
import Avatar from '@mui/material/Avatar'
import CustomAvatar from 'src/@core/components/mui/avatar'


const RenderUserAvatar = (avtar: any, name: string) => {
  if (avtar && avtar != "") {
    return <CustomAvatar src={avtar} sx={{ mr: 3, ml: 3, width: 34, height: 34 }} variant="rounded" />
  } else {
    return (
      <Avatar alt={name} sx={{ width: 40, height: 40 }} src={name} />
    )
  }
}

export default RenderUserAvatar

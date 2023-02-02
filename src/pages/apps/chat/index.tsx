/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useContext, useState, SyntheticEvent } from 'react'
import { SocketContext } from 'src/context/SocketContext'
import { AuthContext } from 'src/context/AuthContext'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'

import Box, { BoxProps } from '@mui/material/Box'
import { useTheme } from '@mui/material/styles' 
import ScrollToBottom from 'react-scroll-to-bottom'
import SendIcon from '@mui/icons-material/Send'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Styled Components
const ChatFormWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  borderRadius: 8,
  alignItems: 'center',
  boxShadow: theme.shadows[1],
  padding: theme.spacing(1.25, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.paper
}))

const Form = styled('form')(({ theme }) => ({
  padding: theme.spacing(0, 5, 5),
  position: 'absolute',
  left: 0,
  bottom: 0,
  right: 0,
}))

const MessageBox = styled(ScrollToBottom)(({ theme }) => ({
  padding: theme.spacing(5),
  width: "100%",
  position: 'absolute',
  left: 0,
  top: 0,
  right: 0,
  marginBottom: "70px",
}))

const MyMessage = styled('p')(({ }) => ({
  listStyleType: "none",
  margin: "8px",
  minWidth: "200px",
  padding: "12px 8px",
  color: "white",
  width: "fit-content",
  borderRadius: "30px",
  paddingLeft: "1em",
  background: "#03a2ec",
  marginLeft: "auto",
}))

const OthersMessage = styled('p')(({ }) => ({
  listStyleType: "none",
  margin: "8px",
  minWidth: "200px",
  padding: "12px 8px",
  color: "white",
  width: "fit-content",
  borderRadius: "30px",
  paddingLeft: "1em",
  background: "#f67172",
  marginRight: "auto",
}))

const AppChat = () => {
  // ** States
  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const [messages, setMessages] = useState<any>([])
  const [newMessage, setNewMessage] = useState<string>('')
  const { socket } = useContext<any>(SocketContext)
  const { user } = useContext<any>(AuthContext)

  const { skin, appBar, footer, layout, navHidden } = settings

  const calculateAppHeight = () => {
    return `(${(appBar === 'hidden' ? 0 : (theme.mixins.toolbar.minHeight as number)) *
      (layout === 'horizontal' && !navHidden ? 2 : 1) +
      (footer === 'hidden' ? 0 : 56)
      }px + ${theme.spacing(6)} * 2)`
  }

  useEffect(() => {
    socket.emit("newjoin", { id: user._id, senderName: user.name })
    socket.on("newjoin", (msg: any) => {
      if (msg.id == user._id) {
        setMessages(msg.data)
      }else{
        // alert(msg.senderName + "Joined")
      }
    })

    socket.on("message", (msg: any) => {
      setMessages((prevMessages: any) => [...prevMessages, msg])
    })

  }, [])

  const handleSendMsg = (e: SyntheticEvent) => {
    e.preventDefault()
    if (newMessage !== "") {
      socket.emit("message", { body: newMessage, id: user._id, senderAvatar: user.avatar, senderName: user.name })
      setNewMessage('')
    }
  }

  const mappedMessages = messages.map((m: any, i: number) => (
    <div key={i}>
      {m.id == user._id ?
        <div style={{ display: "flex", alignItems: "center" }}>
          <MyMessage>
            {m.body}
          </MyMessage>
          <Avatar alt={m.senderName} sx={{ width: 40, height: 40 }} src={m.senderAvatar && m.senderAvatar != "" ? m.senderAvatar : m.senderName} />
          {/* <Avatar alt={m.senderName} sx={{ width: 40, height: 40 }} src={m.senderAvatar && m.senderAvatar != "" ? m.senderAvatar : "/images/avatars/1.png"} /> */}
        </div>
        :
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar alt={m.senderName} sx={{ width: 40, height: 40 }} src={m.senderAvatar && m.senderAvatar != "" ? m.senderAvatar : m.senderName} />
          <OthersMessage>
            {m.body}
          </OthersMessage>
        </div>
      }
    </div>
  ))

  return (
    <Box
      className='app-chat'
      sx={{
        width: '100%',
        display: 'flex',
        borderRadius: 1,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'background.paper',
        boxShadow: skin === 'bordered' ? 0 : 6,
        height: `calc(100vh - ${calculateAppHeight()})`,
        ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
      }}
    >
      <MessageBox>
        {mappedMessages}
      </MessageBox>
      <Form onSubmit={handleSendMsg}>
        <ChatFormWrapper>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              value={newMessage}
              size='small'
              placeholder='Type your message here…'
              onChange={e => setNewMessage(e.target.value)}
              sx={{ '& .MuiOutlinedInput-input': { pl: 0 }, '& fieldset': { border: '0 !important' } }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* <IconButton size='small' sx={{ mr: 1.5, color: 'text.primary' }}><Microphone sx={{ fontSize: '1.375rem' }} /></IconButton> */}
            {/* <IconButton size='small' component='label' htmlFor='upload-img' sx={{ mr: 2.75, color: 'text.primary' }}>
              <Paperclip sx={{ fontSize: '1.375rem' }} />
              <input hidden type='file' id='upload-img' />
            </IconButton> */}
            <Button type='submit' endIcon={<SendIcon/>} variant='contained'>Send</Button>
          </Box>
        </ChatFormWrapper>
      </Form>
    </Box>
  )
}

AppChat.acl = {
  action: 'manage',
  subject: 'customer-page'
}

export default AppChat

import { useState, useEffect, useContext } from 'react'
import toast from 'react-hot-toast'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Trophy from 'mdi-material-ui/Trophy'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import { ethers } from "ethers";
import Web3 from "web3";
import CardContent from '@mui/material/CardContent';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled, darken, lighten } from '@mui/material/styles'
import MUIDataTable from "mui-datatables";

import CustomChip from 'src/@core/components/mui/chip'
import coinFlipAbi from 'src/abi/coinFlip.json';
import tokenBUSDAbi from 'src/abi/tokenBUSD.json';
import { ThemeColor } from 'src/@core/layouts/types'
import useGlobalState from 'src/hooks/useGlobalState';
import RenderUserAvatar from 'src/views/components/avatars/RenderUserAvatar'
import { SocketContext } from 'src/context/SocketContext'
import { busd_address, flip_busd_address } from 'src/lib/consts'
import Badge from '@mui/material/Badge'

interface StatusObj { [key: string]: { color: ThemeColor } }

// Styled component for the trophy image
const TrophyImg = styled('img')(({ theme }) => ({
  right: 22,
  bottom: 0,
  width: 80,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    width: 60
  }
}))

const statusObj: StatusObj = { init: { color: 'secondary' }, wait: { color: 'warning' } }

const getBackgroundColor = (color: string, mode: string) => mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

const initSelect = {
  amount: "0.0",
  id: 0,
  index: "0",
  player1: { name: '', avatar: '', address: '0x0000000000000000000000000000000000000000' },
  player2: { name: '', avatar: '', address: '0x0000000000000000000000000000000000000000' },
  side: "1",
  status: "init",
  update: "1670485236",
  winner: "2"
}

const options: any = {
  search: false,
  download: false,
  print: false,
  viewColumns: false,
  filter: false,
  selectableRows: false,
  rowsPerPage: 5,
  rowsPerPageOptions:[ 3,4,5]
};

const CoinflipCard = (props: any) => {
  const { web3Provider, address } = useGlobalState();

  const { socket } = useContext<any>(SocketContext)
  const { roomList } = props
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedRoom, setSelectedRoom] = useState<any>(initSelect)
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [playingList, setPlayingList] = useState<any>([]);

  useEffect(() => {
    socket.on("flipMsgUSDC", (data: any) => {
      const res = JSON.parse(data);
      if (res.type == "flip_closed") {
        if (res.data == selectedRoom.index && loading) {
          toast.success('Flip closed!');
          socket.emit("flipClientMsg", { type: "end", data: selectedRoom.index })
          setLoading(false);
          setOpenConfirm(false)
          setSelectedRoom(initSelect)
        }
      }
    })

    socket.on("flipServerMsg", (res: any) => {
      if (res.type == "playing") {
        setPlayingList((prePlayingList: any) => ([...prePlayingList, res.data]))
      } else if (res.type == "end") {
        const updateList = playingList.filter((playingIndex: any) => { return playingIndex != res.data })
        setPlayingList(updateList)
      }
    })
  }, [])

  const columns = [
    {
      name: 'id',
      label: 'No',
      options: {
        customBodyRenderLite: (i: any) => {
          return (
            <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>{i + 1}</Typography>
          )
        }
      }
    },
    {
      name: 'side',
      label: 'Side',
      options: {
        customBodyRenderLite: (i: any) => {
          return (
            <div>
              {
                roomList[i].side == "0" ?
                  <img style={{ width: "36px" }} alt='coin_front' src='/images/icons/coin_front.png' />
                  :
                  <img style={{ width: "36px" }} alt='coin_back' src='/images/icons/coin_back.png' />
              }
            </div>
          )
        }
      }
    },
    {
      name: 'player',
      label: 'User',
      options: {
        customBodyRenderLite: (i: any) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {RenderUserAvatar(roomList[i].player1.avatar, roomList[i].player1.name)}
              <Typography variant='subtitle2' sx={{ color: 'text.primary', margin: "0 10px" }}>VS</Typography>
              {roomList[i].player2 && RenderUserAvatar(roomList[i].player2.avatar, roomList[i].player2.name)}
            </Box>
          )
        }
      }
    },
    {
      name: 'amount',
      label: 'Amount',
      options: {
        customBodyRenderLite: (i: any) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>$ {roomList[i].amount}</Typography>
            </Box>
          )
        }
      }
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        customBodyRenderLite: (i: any) => {
          return (
            roomList[i].winner != "2" ?
              <Box sx={{ display: 'flex', alignItems: 'center' }} id="ggg">
                {
                  roomList[i].winner == "0" ?
                    <Badge badgeContent={<Trophy  style={{color:'#facd66'}} />} >
                      {RenderUserAvatar(roomList[i].player1.avatar, roomList[i].player1.name)}
                    </Badge>
                    :
                    <Badge badgeContent={<Trophy style={{color:'#facd66'}}  />} >
                      {RenderUserAvatar(roomList[i].player2.avatar, roomList[i].player2.name)}
                    </Badge>
                }

              </Box>
              :
              playingList.includes(roomList[i].index) ?
                <CustomChip skin='light' size='small' label={"Playing"} color="info" sx={{ textTransform: 'capitalize', '& .MuiChip-label': { px: 2.5, lineHeight: 1.385 } }} />
                :
                <CustomChip skin='light' size='small' label={roomList[i].status} color={statusObj[roomList[i].status].color} sx={{ textTransform: 'capitalize', '& .MuiChip-label': { px: 2.5, lineHeight: 1.385 } }} />
          )
        }
      }
    },
    {
      name: 'update',
      label: 'Date',
      options: {
        customBodyRenderLite: (i: any) => {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ color: 'text.secondary', padding: '3px 10px', borderRadius: '5px', minWidth: '70px', textTransform: 'capitalize', textAlign: 'center' }}>
                {dateConverter(roomList[i].update)}
              </Typography>
            </Box>
          )
        }
      }
    },
    {
      name: 'winner',
      label: 'Actions',
      options: {
        customBodyRenderLite: (i: any) => {
          return (
            roomList[i].winner != "2" ?
              <Button fullWidth size='small' variant='contained' onClick={() => handleClickOpen(roomList[i])}>View Result</Button>
              :
              roomList[i].player1.address == address ?
                <Button fullWidth size='small' variant='contained' onClick={() => handleClickOpen(roomList[i])}>View</Button>
                :
                playingList.includes(roomList[i].index) ?
                  <LoadingButton loading={openConfirm} fullWidth size='small' variant='contained' onClick={() => handleJoinConfirm(roomList[i])}>Open</LoadingButton>
                  :
                  roomList[i].player1.address !== "0x0000000000000000000000000000000000000000" &&
                  <LoadingButton loading={openConfirm} fullWidth size='small' variant='contained' onClick={() => handleJoinConfirm(roomList[i])}>Open</LoadingButton>

          )
        }
      }
    }
  ]

  const handleClickOpen = (row: any) => {
    setSelectedRoom(row)
    setOpen(true)
  }

  const handleJoinConfirm = (row: any) => {
    setSelectedRoom(row)
    setOpenConfirm(true)
  }

  const handleClose = () => setOpen(false)

  const handleConfirmClose = () => setOpenConfirm(false)

  const handleJoinCFR = async (row: any) => {
    if (web3Provider) {

      const signer = web3Provider.getSigner();
      const usdcContract = new ethers.Contract(busd_address, tokenBUSDAbi, signer);
      let balance = await usdcContract.balanceOf(address);
      balance = Web3.utils.fromWei(balance.toString(), "ether")
      if (balance > parseFloat(row.amount)) {
        setLoading(true);
        try {
          const index = parseInt(row.index)
          const flipContract = new ethers.Contract(flip_busd_address, coinFlipAbi, signer);
          socket.emit("flipClientMsg", { type: "playing", data: row.index })
          const res_approve = await usdcContract.approve(flip_busd_address, Web3.utils.toWei(row.amount.toString(), "ether"));
          await res_approve.wait();
          const res_deposit = await flipContract.closeFlip(index, Web3.utils.toWei(row.amount.toString(), "ether"));
          await res_deposit.wait();
          setOpenConfirm(false)
          setLoading(false);
        } catch (error) {
          socket.emit("flipClientMsg", { type: "end", data: row.index })
          toast.error("Failed. Please check the network status and try again.");
          setLoading(false);
        }
      } else {
        toast.error("You do not have enough tokens in your wallet. Please check it and try again.");
      }
    } else {
      toast.error("Please connect your wallet")
      setOpenConfirm(false)
    }
  }

  const dateConverter = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    const dateFormat = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()

    return dateFormat;
  }

  return (
    <Card sx={{
      '& .super-app-theme--winner': {
        bgcolor: (theme) =>
          getBackgroundColor(theme.palette.error.main, theme.palette.mode),
      },
      '& .super-app-theme--playing': {
        bgcolor: (theme) =>
          getBackgroundColor(theme.palette.warning.main, theme.palette.mode),
      },
    }}>
      <Dialog
        open={open} disableEscapeKeyDown fullWidth maxWidth="sm"
        aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose()
          }
        }}
      >
        {selectedRoom.winner !== "2" && <TrophyImg alt='trophy' style={{width:"100px"}} src='/images/cards/trophy.png'  />}
        <Card>
          <CardHeader title={selectedRoom.winner !== "2" ? "Winner" : "CoinFlip"}></CardHeader> 
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-around" }}>
              {
                selectedRoom.winner !== "2" ?
                  (
                    selectedRoom.winner == "0" ?
                      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: "column" }}>
                        {RenderUserAvatar(selectedRoom.player1.avatar, selectedRoom.player1.name)}
                        <p>{selectedRoom.player1.name}</p>
                      </Box>
                      :
                      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: "column" }}>
                        {RenderUserAvatar(selectedRoom.player2.avatar, selectedRoom.player2.name)}
                        <p>{selectedRoom.player2.name}</p>
                      </Box>
                  )
                  :
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: "column" }}>
                      {RenderUserAvatar(selectedRoom.player1.avatar, selectedRoom.player1.name)}
                      <p>{selectedRoom.player1.name}</p>
                    </Box>
                    < Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                      vs
                    </Typography>
                  </>
              }
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-around", marginTop: "20px" }}>
              <Button size='small' variant='contained' onClick={handleClose}>OK</Button>
            </Box>
          </CardContent>
        </Card>
      </Dialog >

      <MUIDataTable
        title={"CoinFlip Room List"}
        data={roomList}
        columns={columns}
        options={options}
      />
      <Dialog
        open={openConfirm} disableEscapeKeyDown fullWidth maxWidth="sm"
        aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'
        onClose={handleConfirmClose}
      >
        <Card>
          <CardHeader title="Are you really playing with this user?"></CardHeader>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-around" }}>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: "column" }}>
                {
                  selectedRoom.side == "1" ?
                    <img style={{ width: "120px" }} alt='coin_front' src='/images/icons/coin_front.png' />
                    :
                    <img style={{ width: "120px" }} alt='coin_back' src='/images/icons/coin_back.png' />
                }
                <p>Your coin side</p>
              </div>
              <p>Amount: {selectedRoom.amount}</p>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "end", marginTop: "20px" }}>
              
              <LoadingButton loading={loading} variant="outlined" size='small' onClick={() => handleJoinCFR(selectedRoom)}>Agree</LoadingButton> 
              {loading ? <></> : <LoadingButton loading={loading} variant="outlined" size='small' onClick={handleConfirmClose} style={{ marginLeft: '10px' }}>Disagree</LoadingButton>}
            </Box>
          </CardContent>
        </Card>
      </Dialog >
    </Card >
  )
}

export default CoinflipCard

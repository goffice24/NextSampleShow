// ** MUI Imports
import { useState, useEffect, useContext, SyntheticEvent } from 'react'
import { AuthContext } from 'src/context/AuthContext'
import { SocketContext } from 'src/context/SocketContext'

import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import CoinflipCard from 'src/views/coinflip/CoinflipCard';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import toast from 'react-hot-toast'

import { ethers } from "ethers";
import Web3 from "web3";
import useGlobalState from 'src/hooks/useGlobalState';
import tokenBUSDAbi from 'src/abi/tokenBUSD.json';
import coinFlipAbi from 'src/abi/coinFlip.json';
import { busd_address, flip_busd_address, filpAmount } from 'src/lib/consts'


const CoinflipPage = () => {
  const { web3Provider, address } = useGlobalState();

  const { socket } = useContext<any>(SocketContext)
  const { user } = useContext<any>(AuthContext)
  const [open, setOpen] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(false)
  const [amountCFR, setAmountCFR] = useState<any>(filpAmount)
  const [side, setSide] = useState<any>(true)
  const [roomList, setRoomList] = useState<any>([])

  useEffect(() => {
    socket.emit("joinFlipUSDC", { id: user._id, senderName: user.name })
    socket.on("flipMsgUSDC", (data: any) => {
      const res = JSON.parse(data);
      switch (res.type) {
        case "player_list":
          if (res.data !== "" && res.data.length > 0) {
            const p: any = [];
            res.data.forEach((i: any, index: any) => {
              const temp: any = i;
              temp.id = index;
              p.push(temp);
            })
            setRoomList(p);
          } else {
            setRoomList([]);
          }
          break;
        case "flip_inited":
          toast.success('Flip inited!');
          break;
        case "flip_created":
          toast.success('Flip created!');
          break;
        default:
          break;
      }
    })
  }, [])

  const handleClickOpen = () => {
    setOpen(true)
    if (web3Provider) {
      setOpen(true)
    } else {
      toast.error("Please connect your wallet")
    }
  }

  const handleNewCFR = async (e: SyntheticEvent) => {
    e.preventDefault()
    if (amountCFR >= filpAmount) {
      const signer = web3Provider.getSigner();
      const usdcContract = new ethers.Contract(busd_address, tokenBUSDAbi, signer);
      let balance = await usdcContract.balanceOf(address);
      balance = Web3.utils.fromWei(balance.toString(), "ether")
      if (balance > amountCFR) {
        setLoading(true);
        try {
          const coinSide = side ? 0 : 1
          const flipContract = new ethers.Contract(flip_busd_address, coinFlipAbi, signer);
          const res_approve = await usdcContract.approve(flip_busd_address, Web3.utils.toWei(amountCFR.toString(), "ether"));
          await res_approve.wait();
          const res_deposit = await flipContract.openFlip(coinSide, Web3.utils.toWei(amountCFR.toString(), "ether"));
          await res_deposit.wait();
          setLoading(false);
          setOpen(false)
          setAmountCFR(filpAmount)
        } catch (error) {
          setLoading(false);
          toast.error("Failed. Please check the network status and try again.");
        }
      } else {
        toast.error("You do not have enough tokens in your wallet. Please check it and try again.");
      }
    } else {
      toast.error(`The minimum amount for game is $${filpAmount}.`);
    }
  }

  const handleClose = () => {
    if (!loading) {
      setAmountCFR(0)
      setOpen(false)
    }
  }

  const sideHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSide(event.target.checked)
  }

  return (

    <Grid container spacing={6}>
      <Grid item xs={12}>
        <span style={{ display: 'flex', alignItems: 'center' }}>We support &nbsp;<a style={{ height: '25px' }} href='https://www.binance.com/en' target="blank"><img style={{ width: "25px" }} src='/images/icons/busd.png' alt="betting4u coin" /></a>(BUSD) as a game coin.</span>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardHeader title='Coinflip summary 🙌'></CardHeader>
              <CardContent>
                <Grid container spacing={6}>
                  <Grid item xs={6} sm={3}>
                    <Typography sx={{ mb: 2 }}>Total value</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography sx={{ mb: 2 }}>${roomList.map((item: any) => item.amount).reduce((prev: any, curr: any) => parseFloat(prev) + parseFloat(curr), 0)}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography sx={{ mb: 2 }}>Total flips</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography sx={{ mb: 2 }}>{roomList.length}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardHeader title='Coinflip status'></CardHeader>
              <CardContent>
                <Grid container spacing={6}>
                  <Grid item xs={6} sm={6}>
                    <Typography sx={{ mb: 2 }}>Your placed</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <LoadingButton loading={loading} fullWidth variant='contained' onClick={handleClickOpen}>+ Create coinflip</LoadingButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <CoinflipCard roomList={roomList} />
      </Grid>

      <Dialog
        open={open} disableEscapeKeyDown fullWidth maxWidth="sm" onClose={handleClose}
        aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'
      >
        <Card >
          <CardHeader title="Please select the favourite side and enter your amount."></CardHeader>
          <CardContent sx={{ display: "flex", justifyContent: "space-evenly" }}>
            <div style={{ display: "flex", alignItems: "center", flexDirection: "column", justifyContent: 'center' }}>
              {
                side ?
                  <img style={{ width: "120px" }} alt='coin_front' src='/images/icons/coin_front.png' />
                  :
                  <img style={{ width: "120px" }} alt='coin_back' src='/images/icons/coin_back.png' />
              }
              <FormControlLabel sx={{ margin: '0 !important', marginTop: '10px !important' }} control={<Switch checked={side} onChange={sideHandler} />} label={side ? 'Front' : 'Back'} />
            </div>
            <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
              <TextField sx={{ maxWidth: '220px' }} type="number" disabled={loading} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: filpAmount }} value={amountCFR} onChange={(e) => setAmountCFR(Number(e.target.value))} InputLabelProps={{ shrink: false }} size='small' />
              <Typography sx={{ display: "flex", justifyContent: "end", marginTop: "20px" }}>
                <LoadingButton loading={loading} variant="outlined" onClick={handleNewCFR} >Agree</LoadingButton>
                {loading ? <></> : <LoadingButton loading={loading} variant="outlined" onClick={handleClose} style={{ marginLeft: '10px' }}>Disagree</LoadingButton>}
              </Typography>
            </div>


          </CardContent>
        </Card>
      </Dialog>
    </Grid>
  )
}

CoinflipPage.acl = {
  action: 'manage',
  subject: 'customer-page'
}
export default CoinflipPage

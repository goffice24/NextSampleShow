import { useState, useEffect, useContext } from 'react'
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { styled } from '@mui/material/styles'
import Send from 'mdi-material-ui/Send'
import toast from 'react-hot-toast'
import { ethers } from "ethers";

import Web3 from "web3";
import SpinWheel from 'src/views/spin/SpinWheel';
import SpinPlayerCard from 'src/views/spin/SpinPlayerCard';
import { AuthContext } from 'src/context/AuthContext'
import SpinPlayHistory from 'src/views/spin/SpinPlayHistory';
import RenderUserAvatar from 'src/views/components/avatars/RenderUserAvatar'
import { SocketContext } from 'src/context/SocketContext'
import { SpinPlayerType, SpinPlayHistoryType } from 'src/types/apps/spinTypes';
import useGlobalState from 'src/hooks/useGlobalState';
import tokenBUSDAbi from 'src/abi/tokenBUSD.json';
import spinUSDCAbi from 'src/abi/spinUSDC.json';
import { busd_address, spin_busd_address, spinAmount } from 'src/lib/consts'

const sampleColor = [
    "#fc0362",
    "#03adfc",
    "#fcb103",
    "#8c03fc",
    "#228f5e",
    "#22518f",
    "#c70808",
    "#94c708",
    "#0828c7",
    "#f373fa",
    "#7127f2",
    "#00d157",
    "#a11010",
    "#7ab8ff",
    "#ad2bc4",
    "#008f1f",
]

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

const SpinPage = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { provider, web3Provider, chainId, address } = useGlobalState();
    const { socket } = useContext<any>(SocketContext)
    const { user } = useContext<any>(AuthContext)
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [resloading, setResLoading] = useState<boolean>(false)
    const [disableJoin, setDisableJoin] = useState<boolean>(false)

    const [winner, setWinner] = useState<number>(-1)
    const [player, setPlayer] = useState<SpinPlayerType[]>([])
    const [winnerData, setWinnerData] = useState<any>({})
    const [history, setHistory] = useState<SpinPlayHistoryType[]>([])

    const [inAmount, setInAmount] = useState<number>(spinAmount)
    const [timer, setTimer] = useState<number>(180)

    useEffect(() => {
        socket.on("spinMsgUSDC", (data: any) => {
            const res = JSON.parse(data);

            switch (res.type) {
                case "history":
                    if (res.data) {
                        const p: any = [];
                        res.data.forEach((i: any, index: any) => {
                            const temp: any = i;
                            temp.id = index;
                            p.push(temp);
                        })
                        setHistory(p);
                    } else {
                        setHistory([]);
                    }
                    break;
                case "player_list":
                    if (res.data) {
                        const p: any = [];
                        res.data.forEach((i: any, index: any) => {
                            const temp: any = i;
                            temp.id = index;
                            temp.color = sampleColor[index];
                            p.push(temp);
                        })
                        setPlayer(p);
                    } else {
                        setPlayer([]);
                    }
                    break;
                case "game_created":
                    toast.success('Game created!');
                    setTimer(180);
                    break;
                case "game_started":
                    toast.success('Game started!');
                    break;
                case "timer": let time = 180;
                    if (res.data < 180) {
                        time = 180 - res.data;
                        if (time < 10) {
                            setDisableJoin(true);
                        }
                    } else {
                        setResLoading(true);
                        setLoading(true);
                        time = 0;
                    }
                    setTimer(time);
                    break;
                case "winner":
                    setResLoading(false);
                    setLoading(false);
                    setWinner(parseInt(res.data));
                    break;
                case "game_inited":
                    toast.success('Game inited!');
                    setTimer(180);
                    setWinner(-1);
                    setOpen(false);
                    setDisableJoin(false);
                    setPlayer([]);
                    setWinnerData({})
                    break;
                default:
                    break;
            }
        })
        socket.emit("joinSpinUSDC", { id: user._id, senderName: user.name })
    }, [])

    useEffect(() => {
        if (winner >= 0) {
            if (player[winner].address == address) {
                setWinnerData(player[winner])
                setOpen(true);
            }
        }
    }, [player, winner])

    const handleInput = (a: number) => {
        let c = inAmount;
        c = c * 1 + a;
        if (a === 0) {
            c = spinAmount;
        }
        setInAmount(c);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const PlusButton = (props: any) => {
        return (
            <Button disabled={disableJoin || loading} variant='outlined' onClick={() => handleInput(props.val)} color='secondary' sx={{ transform: 'skew(-10deg)', marginLeft: '3px' }}>
                {props.amount}
            </Button>
        )
    }

    const handlePlay = async () => {
        if(!web3Provider){
            toast.error("Please connect your wallet")
            
            return
        }
        if (inAmount >= spinAmount) {
            const signer = web3Provider.getSigner();
            const usdcContract = new ethers.Contract(busd_address, tokenBUSDAbi, signer);
            let balance = await usdcContract.balanceOf(address);
            balance = Web3.utils.fromWei(balance.toString(), "ether")
            if (balance > inAmount) {
                setLoading(true);
                try {
                    const spinContract = new ethers.Contract(spin_busd_address, spinUSDCAbi, signer);
                    const res_approve = await usdcContract.approve(spin_busd_address, Web3.utils.toWei(inAmount.toString(), "ether"));
                    await res_approve.wait();
                    const res_deposit = await spinContract.depositMoney(Web3.utils.toWei(inAmount.toString(), "ether"));
                    await res_deposit.wait();
                    setLoading(false);
                    setInAmount(spinAmount);
                } catch (error) {
                    setLoading(false);
                    toast.error("Failed. Please check the network status and try again.");
                }
            } else {
                toast.error("You do not have enough tokens in your wallet. Please check it and try again.");
            }
        } else {
            toast.error(`The minimum amount for game is $${spinAmount}.`);
        }
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <span style={{ display: 'flex', alignItems: 'center' }}>We support &nbsp;<a style={{height:'25px'}} href='https://www.binance.com/en' target="blank"><img style={{width:"25px"}} src='/images/icons/busd.png' alt="betting4u coin" /></a>(BUSD) as a game coin.</span>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={6}>
                    <Grid item xs={12} sm={6}>
                        <SpinWheel row={player} timer={timer} loading={resloading} />
                        <Card sx={{ marginTop: '10px', padding: '10px 5px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography sx={{ marginTop: '15px', marginBottom: '10px', fontStyle: 'italic' }}>The minimum amount for game is ${spinAmount}</Typography>
                            <Typography sx={{ display: 'flex', padding: '5px', }}>
                                <TextField type="number" disabled={disableJoin || loading} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: spinAmount }} value={inAmount} onChange={(e) => setInAmount(Number(e.target.value))} InputLabelProps={{ shrink: false }} sx={{ mr: 4, transform: 'skew(-10deg)', marginLeft: '3px' }} size='small' />
                                <LoadingButton loading={loading} onClick={handlePlay} disabled={disableJoin} variant='contained' sx={{ transform: 'skew(-10deg)', marginLeft: '3px' }} startIcon={<Send />}>
                                    Play
                                </LoadingButton>
                            </Typography>
                            <Typography sx={{ display: 'flex', padding: '5px' }}>
                                <PlusButton amount={'+10'} val={10} />
                                <PlusButton amount={'+50'} val={50} />
                                <PlusButton amount={'+100'} val={100} />
                                <PlusButton amount={'+500'} val={500} />
                                <PlusButton amount={'Clear'} val={0} />
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <SpinPlayerCard row={player} winner={winner} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <SpinPlayHistory row={history} />
            </Grid>

            <Dialog
                open={open} disableEscapeKeyDown fullWidth maxWidth="sm"
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
                onClose={handleClose}
            >
                <DialogContent sx={{ minHeight: "150px", display: "flex", justifyContent: "center", flexDirection: "column" }}>
                    <div style={{ alignItems: "center", display: "flex", justifyContent: "center", flexDirection:"column" }}>
                        <h2>Congratulations!</h2>
                        <div>{RenderUserAvatar(winnerData?.avatar, winnerData?.name)}</div> 
                        <p>{winnerData?.name}</p> 
                    </div> 
                    <TrophyImg alt='trophy' style={{width:"100px"}} src='/images/cards/trophy.png' />
                </DialogContent>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button size='small' variant='contained' onClick={handleClose}>OK</Button>
                </DialogActions>
            </Dialog >
        </Grid >
    )
}

SpinPage.acl = {
    action: 'manage',
    subject: 'customer-page'
}

export default SpinPage

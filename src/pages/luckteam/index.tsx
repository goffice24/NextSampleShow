import { useState, useEffect, useContext } from 'react'
import { SocketContext } from 'src/context/SocketContext'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog'
import LinearProgress from '@mui/material/LinearProgress'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Plus from 'mdi-material-ui/Plus'
import LoadingButton from '@mui/lab/LoadingButton';
import Badge from '@mui/material/Badge'

// ** Custom Components Imports
import toast from 'react-hot-toast'
import { ethers } from "ethers";
import Web3 from "web3";
import CustomAvatar from 'src/@core/components/mui/avatar'
import useGlobalState from 'src/hooks/useGlobalState';
import luckTeamAbi from 'src/abi/luckteam.json';
import tokenBUSDAbi from 'src/abi/tokenBUSD.json';
import { busd_address, luck_busd_address, luckTeamAmount } from 'src/lib/consts'
import RenderUserAvatar from 'src/views/components/avatars/RenderUserAvatar'
import { useTheme } from '@mui/material/styles'

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

const LuckTeamPage = () => {

    const theme = useTheme()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { provider, web3Provider, chainId, address } = useGlobalState();
    const { socket } = useContext<any>(SocketContext)
    const [inAmount, setInAmount] = useState<number>(luckTeamAmount)
    const [loading, setLoading] = useState<boolean>(false)
    const [playerNumner, setPlayerNumber] = useState<number>(0)
    const [rate, setRate] = useState<number>(1)
    const [disableGame, setDisableGame] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [running, setRunning] = useState<string>("")
    const [timer, setTimer] = useState<number>(600)
    const [winner, setWinner] = useState<string>("2")
    const [winnerData, setWinnerData] = useState<any>({})
    const [playList, setPlayList] = useState<any>([])

    useEffect(() => {
        socket.on("luckMsgUSDC", (data: any) => {
            const res = JSON.parse(data);
            if (res.type == ("game_data" || "game_inited")) {
                setDisableGame(false);
                setOpen(false);
                setPlayList([])
                setLoading(false);
                setPlayerNumber(Number(res.data.num) * 1.0)
                setRate(res.data.rate / 100 * 1.0 / (1 + res.data.rate / 100 * 1.0) * 100);
                setRunning(res.data.running)
                setWinner("2")
            }

            switch (res.type) {
                case "player_number":
                    setPlayerNumber(res.data)
                    break;
                case "amount_rate":
                    setRate(res.data / 100 * 1.0 / (1 + res.data / 100 * 1.0) * 100);
                    break;
                case "timer":
                    const s = (600 - res.data * 1) > 0 ? (600 - res.data * 1) : 0
                    if (s < 10) {
                        setDisableGame(true);
                    } else if (s == 0) {
                        setLoading(true);
                    }
                    setTimer(s)
                    break;
                case "game_result":
                    setWinner(res.data.winner)
                    setDisableGame(true);
                    setLoading(false);
                    break;
                case "player_list":
                    setPlayList(res.data)
                    break;
                default:
                    break;
            }
        })
        socket.emit("joinLuckUSDC", 'connect')
    }, [])

    useEffect(() => {
        if (winner != "2" && playList.length > 0) {
            const updateList = playList.filter((playerInfo: any) => { return playerInfo.team == winner && playerInfo.player.address == address })
            if (updateList.length > 0) {
                setWinnerData(updateList[0])
                setOpen(true);
            }
        }
    }, [playList, winner])

    const handleInput = (a: number) => {
        let c = inAmount;
        c = c * 1 + a;
        if (a === 0) {
            c = luckTeamAmount;
        }
        setInAmount(c);
    }

    const PlusButton = (props: any) => {
        return (
            <Button variant='outlined' disabled={loading || disableGame} onClick={() => handleInput(props.val)} color='secondary' sx={{ marginLeft: '3px' }}>
                {props.amount}
            </Button>
        )
    }

    const handleEnterMoney = async (side: number) => {
        if (!web3Provider) {
            toast.error("Please connect your wallet")

            return
        }
        if (inAmount >= luckTeamAmount) {
            if (web3Provider) {
                const signer = web3Provider.getSigner();
                const usdcContract = new ethers.Contract(busd_address, tokenBUSDAbi, signer);
                let balance = await usdcContract.balanceOf(address);
                balance = Web3.utils.fromWei(balance.toString(), "ether")
                if (balance > inAmount) {
                    setLoading(true);
                    try {
                        const luckTeamContract = new ethers.Contract(luck_busd_address, luckTeamAbi, signer);
                        const res_approve = await usdcContract.approve(luck_busd_address, Web3.utils.toWei(inAmount.toString(), "ether"));
                        await res_approve.wait();
                        const res_deposit = await luckTeamContract.depositMoney(Web3.utils.toWei(inAmount.toString(), "ether"), side);
                        await res_deposit.wait();
                        setLoading(false);
                        setInAmount(luckTeamAmount);
                    } catch (error) {
                        setLoading(false);
                        toast.error("Failed. Please check the network status and try again.");
                    }
                } else {
                    toast.error("You do not have enough tokens in your wallet. Please check it and try again.");
                }
            } else {
                toast.error("Please connect your wallet")
            }
        } else {
            toast.error(`The minimum amount for game is $${luckTeamAmount}.`);
        }
    }

    const handleClose = () => {
        setOpen(false);
    }

    return (
        < >
            <p>
                <span style={{ display: 'flex', alignItems: 'center' }}>We support &nbsp;<a style={{ height: '25px' }} href='https://www.binance.com/en' target="blank"><img style={{ width: "25px" }} src='/images/icons/busd.png' alt="betting4u coin" /></a>(BUSD) as a game coin.</span>
            </p>
            <Card >
                <CardContent>
                    <Box sx={{ mb: 6.5, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography variant='body2'>Total Player</Typography>
                            <Typography variant='h6'>{playerNumner}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant='subtitle2' sx={{ color: 'success.main' }}>
                                The fewer your teammates, the better your chances of <span style={{ color: theme.palette.mode == "light" ? '#275bcf' : '#ffffaa' }}>WINNING!  </span><br></br>
                                The team with the larger amount is more likely to win. <br></br>
                                We will update chart every 5 players entering.
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center' }}>
                                <CustomAvatar
                                    variant='rounded'
                                    sx={{ mr: 1.5, height: 54, width: 54, borderRadius: '6px', background: '#ffffff' }}
                                >
                                    <img src={'/images/clovers/red_clover.png'} alt="red_team" height={54} />
                                </CustomAvatar>
                                <Typography variant='body2'> </Typography>
                            </Box>
                            <LoadingButton loading={loading} disabled={disableGame} variant='outlined' color='error' size='small' sx={{ marginTop: '10px' }} onClick={() => handleEnterMoney(0)}>
                                Enter MONEY
                            </LoadingButton>
                            <br></br>
                            <Typography sx={{ fontSize: '14px' }} >
                                {winner == "0" ? "WINNER 🎉 " : ""}
                            </Typography>
                        </Box>
                        <Divider flexItem sx={{ m: 0 }} orientation='vertical'>
                            <Badge badgeContent={timer} max={600} color='primary'>
                                <CustomAvatar
                                    skin='light'
                                    color='secondary'
                                    sx={{ height: 54, width: 54, fontSize: '1rem', color: 'text.secondary', }}
                                >
                                    VS
                                </CustomAvatar>
                            </Badge>

                        </Divider>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
                            <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ mr: 1.5 }} variant='body2'>
                                </Typography>
                                <CustomAvatar
                                    variant='rounded'
                                    sx={{ mr: 1.5, height: 54, width: 54, borderRadius: '6px', background: '#ffffff' }}
                                >
                                    <img src={'/images/clovers/blue_clover.png'} alt="red_team" height={54} />
                                </CustomAvatar>
                            </Box>
                            <Typography sx={{ display: 'flex' }}>
                                <LoadingButton loading={loading} disabled={disableGame} variant='outlined' color='info' size='small' sx={{ marginTop: '10px' }} onClick={() => handleEnterMoney(1)}>
                                    ENTER MONEY
                                </LoadingButton>
                            </Typography>
                            <br></br>
                            <Typography sx={{ fontSize: '14px' }} >
                                {winner == "1" ? "WINNER 🎉 " : ""}
                            </Typography>
                        </Box>
                    </Box>
                    <LinearProgress
                        value={rate}
                        variant='determinate'
                        sx={{
                            height: 10,
                            '&.MuiLinearProgress-colorPrimary': { backgroundColor: '#2d5bff' },
                            '& .MuiLinearProgress-bar': {
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                                backgroundColor: '#ff3727'
                            }
                        }}
                    />
                    <Typography sx={{ marginTop: '10px', padding: '10px 5px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography sx={{ marginTop: '15px', marginBottom: '10px' }}>The minimum amount to participate in the game is ${luckTeamAmount}.</Typography>
                        <Typography sx={{ display: 'flex', }}>
                            <TextField value={inAmount} disabled={loading || disableGame} onChange={(e) => setInAmount(Number(e.target.value))} type="number" inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: luckTeamAmount }} InputLabelProps={{ shrink: false }} sx={{ mr: 4, marginLeft: '3px' }} size='small' />

                        </Typography>
                        <Typography sx={{ display: 'flex', padding: '5px' }}>
                            <PlusButton amount={'+10'} val={10} />
                            <PlusButton amount={'+50'} val={50} />
                            <PlusButton amount={'+100'} val={100} />
                            <PlusButton amount={'Clear'} val={0} />
                        </Typography>
                    </Typography>
                </CardContent>

                <Dialog
                    open={open} disableEscapeKeyDown fullWidth maxWidth="sm"
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                    onClose={handleClose}
                >
                    <DialogContent sx={{ minHeight: "150px", display: "flex", justifyContent: "center", flexDirection: "column" }}>
                        <div style={{ alignItems: "center", display: "flex", justifyContent: "center", flexDirection: "column" }}>
                            <h2>Congratulations!</h2>
                            <div>{RenderUserAvatar(winnerData?.avatar, winnerData?.name)}</div>
                            <p>{winnerData?.name}</p>
                        </div>
                        <TrophyImg alt='trophy' style={{ width: "100px" }} src='/images/cards/trophy.png' />
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: "center" }}>
                        <Button size='small' variant='contained' onClick={handleClose}>OK</Button>
                    </DialogActions>
                </Dialog >
            </Card>
        </ >
    )
}

LuckTeamPage.acl = {
    action: 'manage',
    subject: 'customer-page'
}

export default LuckTeamPage

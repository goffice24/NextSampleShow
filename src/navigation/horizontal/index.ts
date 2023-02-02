// ** Icon imports
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import EmailOutline from 'mdi-material-ui/EmailOutline'
// import ShieldOutline from 'mdi-material-ui/ShieldOutline'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import GamesIcon from '@mui/icons-material/Games';

// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline';

const navigation = (): HorizontalNavItemsType => [
  
  {
    title: 'Spin',
    icon: GamesIcon,
    path: '/spin'
  },
  {
    title: 'Coinflip',
    icon: CurrencyExchangeIcon,
    path: '/coinflip'
  },
  {
    title: 'LuckTeam',
    icon: Diversity2Icon,
    path: '/luckteam'
  }, 
  {
    title: 'Help Center',
    icon: HelpCircleOutline,
    path: '/help-center'
  },
]

export default navigation

// ** Icon imports
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import GamesIcon from '@mui/icons-material/Games';

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { HelpCircleOutline } from 'mdi-material-ui';

const navigation = (): VerticalNavItemsType => {
  return [ 
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
      path: '/help-center',
      action: 'read',
    },

    // {
    //   title: 'Access Control',
    //   icon: ShieldOutline,
    //   path: '/acl',
    //   action: 'read',
    //   subject: 'acl-page'
    // }
  ]
}

export default navigation

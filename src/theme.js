import { createMuiTheme } from '@material-ui/core';

export default createMuiTheme({
  overrides: {
    MuiCard: {
      root: {
        padding: '8px 16px',
      },
    },
    MuiCardHeader: {
      root: {
        padding: '8px 16px',
      },
    },
    MuiCardContent: {
      root: {
        padding: '8px 16px',
        display: 'inline-block',
      },
    },
    MuiCardActions: {
      root: {
        display: 'inline-block',
        float: 'right',
      },
    },
    MuiIconButton: {
      root: {
        padding: '0px',
      },
    },
  },
});

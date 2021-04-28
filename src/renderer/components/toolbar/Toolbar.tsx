import { makeStyles, Typography } from '@material-ui/core';
import { CloseSharp, CropLandscapeSharp, CropSquareSharp, LandscapeSharp, MinimizeSharp, RemoveSharp, FilterNoneSharp } from '@material-ui/icons';
import React, { useEffect, useRef } from 'react';
import YMLogoSrc from '../../assets/ymlogo.png';
import { ipcRenderer } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { setMaximized } from '../../redux/toolbar';
import { Ipc } from '../../utils/Ipc';

const TOOLBAR_HEIGHT = 30;

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: TOOLBAR_HEIGHT,
    position: 'relative',
    '-webkit-app-region': 'drag'
  },
  logo: {
    position: 'absolute',
    left: 0,
    zIndex: 10,
    top: 0,
    height: TOOLBAR_HEIGHT,
    padding: '7px 10px',
    width: 48,
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    '& img': {
      height: '100%',
      '-webkit-user-drag': 'none'
    },
    userSelect: 'none',
  },
  windowControls: {
    display: 'flex',
    height: '100%',
    justifyContent: 'flex-end',
    alignContent: 'center',
  },
  control: {
    '-webkit-app-region': 'no-drag',
    height: '100%',
    padding: '5px 10px',
    zIndex: 10,
    '& svg': {
      height: '100%',
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    },
    '&:active': {
      backgroundColor: theme.palette.action.selected
    }
  },
  maximize: {
    padding: '7px 10px',
    display: 'flex'
  },
  maximized: {
    padding: '9px 10px',
  },
  close: {
    '&:hover': {
      backgroundColor: theme.palette.error.main
    },
    '&:active': {
      backgroundColor: theme.palette.error.dark
    }
  },
  title: {
    position: 'absolute',
    left: 44,
    top: 0,
    zIndex: 10,
    userSelect: 'none',
    height: TOOLBAR_HEIGHT,
    padding: '7px 10px',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    '& span': {
      lineHeight: 1.4
    }
  }
}));

const Toolbar = () => {
  const classes = useStyles();
  const ipc = useRef(new Ipc()); 
  const webview = useRef(null);
  const maximized = useSelector((state: RootState) => state.toolbar.maximized);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    ipc.current.invoke('main:isMaximized').then(maximized => {
      dispatch(setMaximized(maximized));
    });

    ipc.current.on('main:maximized', () => {
      dispatch(setMaximized(true));
    });

    ipc.current.on('main:unmaximized', () => {
      dispatch(setMaximized(false));
    });

    return () => ipc.current.dispose();
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.logo} >
        <img src={YMLogoSrc} />
      </div>
      <div className={classes.title}>
        <Typography variant="caption" >Yandex Music</Typography>
      </div>
      <div className={classes.windowControls}>
        <div className={classes.control} onClick={(e) => {
          ipcRenderer.send('main:minimize');
        }}>
          <RemoveSharp />
        </div>
        <div className={`${classes.control} ${classes.maximize} ${maximized ? classes.maximized : ''}`} onClick={() => ipcRenderer.send('main:maximize')}>
          { !maximized ? <CropSquareSharp /> : <FilterNoneSharp /> }
        </div>
        <div className={`${classes.control} ${classes.close}`} onClick={() => ipcRenderer.send('main:close')}>
          <CloseSharp />
        </div>
      </div>
    </div>
  )
};

export default Toolbar;
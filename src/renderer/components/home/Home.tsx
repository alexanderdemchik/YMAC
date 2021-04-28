import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core';
import { Search } from '../search/Search';
import { PageContent } from '../common/PageContent';
import { useDispatch, useSelector } from 'react-redux';
import { getHomeData } from '../../redux/home';
import { RootState } from '../../redux/store';
import { PlaylistsBlock } from './PlaylistsBlock';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1, 
  },
}));

export const Home = () => {
  const classes = useStyles();
  const { blocks } = useSelector((state: RootState) => state.home);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getHomeData());
  }, []);

  return (
    <div className={classes.root}>
      <Search />
      <PageContent>
        <>
          {blocks.map((block) => {
            if (['personal-playlists', 'playlists'].includes(block.type)) {
              return (
                <PlaylistsBlock block={block} />
              );
            }
            return null;
          })}
        </>
       
      </PageContent>
    </div>
  );
};
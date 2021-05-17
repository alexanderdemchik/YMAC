import { Grid, GridSize, makeStyles } from '@material-ui/core';
import { WatchLaterOutlined as ClockIcon } from '@material-ui/icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getScrollParent } from '../../utils/getScrollParant';
import { List, WindowScroller } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once
const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative'
  },
  header: {
    padding: '10px 0',
    background: theme.palette.background.default
  }
}));

export interface ColumnDescription {
  title: string | JSX.Element,
  field: string,
  size: GridSize,
}

interface HeaderProps {
  columns: ColumnDescription[]
}

export const Header = ({ columns }: HeaderProps) => {
  const classes = useStyles();
  return <Grid container className={classes.header}>
    {
      columns.map((col) => (
        <Grid item xs={col.size}>
          {col.title}
        </Grid>
      ))
    }
  </Grid>
}

interface TableProps {
  columns: ColumnDescription[];
  data: any[]
}

export const Table = ({ columns, data = [] }: TableProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const headerSpacer = useRef<HTMLDivElement | null>(null);
  const [scrollParentRef, setScrollParentRef] = useState<HTMLElement | null>(null);
  const classes = useStyles();

  const onScroll = useCallback(() => {
    if (scrollParentRef != null) {
      const scrollParent = scrollParentRef!;
      const scrollTop = scrollParent.scrollTop;
      
      const tableRect = ref.current!.getBoundingClientRect();
      const scrollParentRect = scrollParent.getBoundingClientRect();
  
      const offset = ref.current!.offsetTop - scrollParentRect.top - scrollTop; // 80 - header height x2
      console.log(ref.current!.offsetTop)
      console.log( scrollParentRect.top)
      console.log(scrollTop)
      console.log(offset)
      if (offset < 0) {
        headerRef.current!.style.position = 'fixed';
        headerRef.current!.style.top = `150px`;
        headerRef.current!.style.left = `${tableRect.x}px`;
        headerRef.current!.style.right = `${window.innerWidth - tableRect.x - tableRect.width}px`;
        headerSpacer.current!.style.display = 'inherit';
        
      } else {
        headerRef.current!.style.position = 'relative';
        headerRef.current!.style.top = '0px';
        headerRef.current!.style.left = '0px';
        headerRef.current!.style.right = '0px';
        headerSpacer.current!.style.display = 'none';
      }
    }
  }, [ref, scrollParentRef, headerRef]);

  useEffect(() => {
    const node = ref.current!;
    const scrollParent = getScrollParent(node);

    setScrollParentRef(scrollParent)

    scrollParent.addEventListener('scroll', onScroll);
    
    return () => {
      scrollParent.removeEventListener('scroll', onScroll);
    };
  }, [ref, onScroll]);
  return (
    <div ref={ref} className={classes.root}>
      <div ref={headerRef}>
        <Header columns={columns} />
      </div>
      <div ref={headerSpacer} style={{height: 40, display: 'none'}}/>
        {
            scrollParentRef != null && (
              <WindowScroller scrollElement={scrollParentRef}>
              {({ height, isScrolling, onChildScroll, scrollTop }) => (
                <List
                  autoHeight
                  height={height}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  rowCount={data.length}
                  rowHeight={20}
                  rowRenderer={({index, key, style}) => <div key={key} style={style}>{index}</div>}
                  scrollTop={scrollTop}
                  width={100}
                  overscanRowCount={100}
                />
              )}
           </WindowScroller>
            )
          }
    </div>
  );
}

interface ItemProps {
  data: any,
  columns: ColumnDescription[]
}

export const Item = ({data, columns}: ItemProps) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <Grid container>
      {
        columns.map(col => {
          return (
            <Grid item xs={col.size}>
              {col.field(data)}
            </Grid>
          );
        })
      }
    </Grid>
  )
}
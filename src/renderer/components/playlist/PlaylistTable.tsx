import { Grid, GridSize, makeStyles } from '@material-ui/core';
import { WatchLaterOutlined as ClockIcon } from '@material-ui/icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getScrollParent } from '../../utils/getScrollParant';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';
const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  header: {
    padding: '10px 0',
    background: theme.palette.background.default
  }
}));

export interface ColumnDescription<T> {
  title: JSX.Element | string,
  fieldRenderer: (row: T) => JSX.Element | string | undefined,
  size: GridSize,
}

interface HeaderProps<T> {
  columns: ColumnDescription<T>[]
}

export const Header = <T, >({ columns }: HeaderProps<T>) => {
  const classes = useStyles();
  return <Grid container className={classes.header}>
    {
      columns.map((col) => (
        <Grid item xs={col.size}>
          { col.title }
        </Grid>
      ))
    }
  </Grid>
}

interface RowRendererProps<T> {
  row: T,
  index: number,
  key: any,
  style: any,
  columns: ColumnDescription<T>[]
}
interface TableProps<T> {
  columns: ColumnDescription<T>[],
  data: T[],
  rowRenderer?: ({row, index, key, style, columns}: RowRendererProps<T>) => JSX.Element
}

const TableFC = <T,>({ columns, data = [] }: TableProps<T>) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const headerSpacer = useRef<HTMLDivElement | null>(null);
  const [scrollParentRef, setScrollParentRef] = useState<HTMLElement | null>(null);
  const classes = useStyles();

  const rowRenderer = useCallback(({ key, index, style }) => <Item key={key} index={index} style={style} columns={columns} row={data[index]}/>, [])

  const onScroll = useCallback(() => {
    if (scrollParentRef != null) {
      const scrollParent = scrollParentRef!;
      const scrollTop = scrollParent.scrollTop;
      
      const tableRect = ref.current!.getBoundingClientRect();
      const scrollParentRect = scrollParent.getBoundingClientRect();
  
      const offset = ref.current!.offsetTop - scrollParentRect.top - scrollTop;
  
      if (offset < 0) {
        headerRef.current!.style.position = 'fixed';
        headerRef.current!.style.top = `150px`;
        headerRef.current!.style.left = `${tableRect.x}px`;
        headerRef.current!.style.right = `${window.innerWidth - tableRect.x - tableRect.width}px`;
        headerSpacer.current!.style.display = 'inherit';
        
      } else {
        headerRef.current!.style.position = 'unset';
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

  useEffect(() => {
    console.log('data')
  }, [data])
  console.log('table')
  return (
    <div ref={ref} className={classes.root}>
      <div ref={headerRef} style={{zIndex: 2}}>
        <Header columns={columns} />
      </div>
      <div ref={headerSpacer} style={{height: 40, display: 'none'}} />
        {
            scrollParentRef != null && (
              <WindowScroller scrollElement={scrollParentRef}>
                {({ height, isScrolling, onChildScroll, scrollTop }) => (
                  <AutoSizer disableHeight>
                    {({ width }) => (
                      <List
                        autoHeight
                        height={height}
                        isScrolling={isScrolling}
                        onScroll={onChildScroll}
                        rowCount={data.length}
                        rowHeight={20}
                        scrollTop={scrollTop}
                        width={width}
                      >
                        {rowRenderer}
                      </List>
                    )}
                  </AutoSizer>
                )}
            </WindowScroller>
            )
          }
    </div>
  );
}

export const Table = React.memo(TableFC) as typeof TableFC;

interface ItemProps<T> {
  row: any,
  key: any,
  index: number,
  style: any,
  columns: ColumnDescription<T>[]
}

export const Item = <T, >({ row, key, index, style, columns }: ItemProps<T>) => {
  return (
    <div style={style} key={key}>
      <Grid container >
        {
          columns.map((col, i) => {
            return (
              <Grid item xs={col.size} key={i}>
                {col.fieldRenderer(row)}
              </Grid>
            );
          })
        }
      </Grid>
    </div>
  )
}
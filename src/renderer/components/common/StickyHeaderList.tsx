import { GridSize, makeStyles } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FixedSizeList as List} from 'react-window';
import { getScrollParent } from '../../utils/getScrollParant';

export interface RowRendererProps<T, R, F> {
  index: number,
  style: any,
  data: R & { columns: ColumnDescription<F>[], items: T[] }
}

export interface ColumnDescription<T> {
  title: JSX.Element | string,
  fieldRenderer: ({}: T) => JSX.Element | string,
  size: GridSize,
}

interface TableProps<T, R, F> {
  data: T[],
  scrollOffset: number,
  rowRenderer: ({ index, style, data }: RowRendererProps<T, R, F>) => JSX.Element,
  headerRenderer: (cols: ColumnDescription<F>[]) => JSX.Element,
  rowHeight?: number,
  rowData: R,
  columns: ColumnDescription<F>[]
}

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  }
}));

const StickyHeaderListFC = <T, R, F>({ data = [], scrollOffset = 0, rowRenderer, headerRenderer, rowHeight = 40, rowData, columns }: TableProps<T, R, F>) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<List<any> | null>(null);
  const headerSpacer = useRef<HTMLDivElement | null>(null);
  const [scrollParentRef, setScrollParentRef] = useState<HTMLElement | null>(null);
  const classes = useStyles();

  const onScroll = useCallback(() => {
    if (scrollParentRef != null) {
      const scrollParent = scrollParentRef!;
      const scrollTop = scrollParent.scrollTop;

      const tableRect = ref.current!.getBoundingClientRect();
      const scrollParentRect = scrollParent.getBoundingClientRect();
  
      const offset = ref.current!.offsetTop - scrollParentRect.top - scrollTop;
      if (offset < 0) {
        headerRef.current!.style.position = 'fixed';
        headerRef.current!.style.top = `${scrollOffset}px`;
        headerRef.current!.style.left = `${tableRect.x}px`;
        headerRef.current!.style.right = `${window.innerWidth - tableRect.x - tableRect.width}px`;
        headerSpacer.current!.style.display = 'inherit';
        listRef.current?.scrollTo(scrollTop - (scrollOffset * 2));
      } else {
        listRef.current?.scrollTo(0);
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

  const itemData = useMemo(() => ({ items: data, columns, ...rowData }), [data, rowData, columns]);

  return (
    <div ref={ref} className={classes.root}>
      <div ref={headerRef} style={{zIndex: 2}}>
        { headerRenderer(columns) }
      </div>
      <div ref={headerSpacer} style={{height: 40, display: 'none'}} />
      {
          scrollParentRef != null && (
            <List ref={listRef}
              itemCount={data.length}
              // @ts-ignore
              itemData={itemData}
              itemSize={rowHeight}
              height={window.innerHeight}
              width={'100%'}
              style={{ height: '100% !important', overflow: 'hidden' }}
            >
              { rowRenderer }
            </List> 
          )
        }
    </div>
  );
}

export const StickyHeaderList = React.memo(StickyHeaderListFC) as typeof StickyHeaderListFC;
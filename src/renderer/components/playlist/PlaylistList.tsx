import {
  ButtonBase,
  ButtonBaseProps,
  Grid,
  makeStyles,
} from "@material-ui/core";
import {
  FavoriteBorder,
  FavoriteOutlined,
  FavoriteRounded,
  MoreHoriz,
  PauseSharp,
  PlayArrowSharp,
  ScheduleOutlined,
} from "@material-ui/icons";
import React, { useCallback, useMemo, useState } from "react";
import { areEqual } from "react-window";
import { msToTime } from "../../utils/formatting";
import {
  StickyHeaderList,
  RowRendererProps,
  ColumnDescription,
} from "../common/StickyHeaderList";
import { IconButton, IconButtonProps } from "../common/IconButton";
import { PLAYLIST_TOP_BACKGROUND_COLLAPSED_HEIGHT } from "./Playlist";
import { Image } from "../common/Image";
import { convertUri } from "../../api/yandex";
import { TrackPlaceholder } from "../placeholders/TrackPlaceholder";
import { FadeTransition } from "../common/FadeTransition";
import { CircleWaveSpinner } from "../spinners/CircleWaveSpinner";

const ROW_HEIGHT = 60;

const useStyles = makeStyles((theme) => ({
  header: {
    padding: "10px 0",
    background: theme.palette.background.default,
    "& div": {
      fontSize: "0.9em",
      color: theme.palette.text.secondary,
      fill: theme.palette.text.secondary,
    },
    "& svg": {
      height: "0.9em",
    },
  },
  playlistListItem: {
    fontSize: "0.9em",
    padding: 2,
    overflow: "hidden",
    position: "relative",
    transition: "transform .2s ease-out",
  },
  playlistListItemHovered: {
    background: theme.palette.action.hover,
  },
  playlistListItemPressed: {
    transform: "scale(0.98)",
  },
  trackImage: {
    width: ROW_HEIGHT - 10,
    height: ROW_HEIGHT - 10,
  },
  trackImageOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  playBtn: {
    borderRadius: "50%",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    color: theme.palette.primary.contrastText,
    background: theme.palette.primary.main,
    "& svg": {
      width: "60%",
      height: "auto",
    },
  },
  artistsField: {
    textAlign: "start",
  },
  albumsField: {
    textAlign: "start",
    color: theme.palette.text.secondary,
  },
  actionButton: {
    padding: 11,
    "& svg": {
      width: "0.9em",
      height: "0.9em",
    },
  },
  liked: {
    "& svg": {
      fill: theme.palette.error.main,
    },
  },
}));

interface PlaylistFieldRendererProps {
  row: Yandex.Track;
  hovered: boolean;
  isCurrent: boolean;
  isPlaying: boolean;
  liked: boolean;
  onLikeClick: (track: Yandex.Track, liked: boolean) => void
}

interface PlaylistListHeaderProps {
  columns: ColumnDescription<PlaylistFieldRendererProps>[];
}

export const PlaylistListHeader = ({ columns }: PlaylistListHeaderProps) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.header}>
      {columns.map((col, i) => (
        <Grid item xs={col.size} key={i}>
          {col.title}
        </Grid>
      ))}
    </Grid>
  );
};

interface RowAdditionalData {
  onRowClick: any,
  current: Yandex.Track | null,
  playing: boolean,
  liked: (track: Yandex.Track) => boolean,
  onLikeClick: (track: Yandex.Track, liked: boolean) => void
}

interface PlaylistListItemProps
  extends RowRendererProps<
    Yandex.Track,
    RowAdditionalData,
    PlaylistFieldRendererProps
  > {}

export const PlaylistListItem = React.memo(
  ({
    index,
    style,
    data: { items, columns, onRowClick, current, playing, liked, onLikeClick },
  }: PlaylistListItemProps) => {
    const [hovered, setHovered] = useState(false);
    const [pressed, setPressed] = useState(false);
    const classes = useStyles();

    const isCurrent = items[index].id === current?.id;
    return (
      <Grid
        container
        style={style}
        alignItems={"center"}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setPressed(false);
        }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onClick={() => onRowClick(items[index])}
        component={ButtonBase}
        className={`${classes.playlistListItem}
          ${hovered || isCurrent ? classes.playlistListItemHovered : ""}
          ${pressed ? classes.playlistListItemPressed : ""}`}
      >
        {columns.map((col, i) => {
          return (
            <Grid item xs={col.size} key={i}>
              {col.fieldRenderer({
                row: items[index],
                hovered,
                isCurrent: items[index].id === current?.id,
                isPlaying: playing,
                liked: liked(items[index]),
                onLikeClick
              })}
            </Grid>
          );
        })}
      </Grid>
    );
  },
  areEqual
);

interface PlaylistListProps extends RowAdditionalData {
  data: Yandex.Track[];
}

export const PlaylistList = ({
  data,
  onRowClick,
  current,
  playing,
  liked,
  onLikeClick
}: PlaylistListProps) => {
  const classes = useStyles();

  const columns: ColumnDescription<PlaylistFieldRendererProps>[] = useMemo(
    () => [
      {
        title: <div style={{ paddingLeft: ROW_HEIGHT + 8 }}>TRACK</div>,
        size: 6,
        fieldRenderer: ({ row, hovered, isCurrent, isPlaying }) => (
          <Grid container spacing={2} direction={"row"} alignItems={"center"}>
            <Grid item>
              <div style={{ position: "relative" }}>
                <Image
                  src={convertUri(row.coverUri)}
                  placeholder={<TrackPlaceholder />}
                  className={classes.trackImage}
                />
                <FadeTransition
                  open={hovered || (isCurrent && isPlaying)}
                  className={classes.trackImageOverlay}
                >
                  {isPlaying && isCurrent && hovered ? (
                    <div className={classes.playBtn}>
                      <PauseSharp />
                    </div>
                  ) : isPlaying && isCurrent ? (
                    <CircleWaveSpinner size={"100%"} />
                  ) : (
                    <div className={classes.playBtn}>
                      <PlayArrowSharp />
                    </div>
                  )}
                </FadeTransition>
              </div>
            </Grid>
            <Grid item>{row.title}</Grid>
          </Grid>
        ),
      },
      {
        title: <div>ARTIST</div>,
        size: 2,
        fieldRenderer: ({ row }) => (
          <div className={classes.artistsField}>
            {row.artists!.map((el) => el.name).join(",")}
          </div>
        ),
      },
      {
        title: <div>ALBUM</div>,
        size: 2,
        fieldRenderer: ({ row }) => {
          return (
            <div className={classes.albumsField}>
              {row.albums!.map((el) => el.title).join(",")}
            </div>
          );
        },
      },
      {
        title: (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <ScheduleOutlined fontSize="small" />
          </div>
        ),
        size: 2,
        fieldRenderer: ({ row, hovered, liked, onLikeClick }) => (
          <>
            <Grid
              container
              wrap="nowrap"
              alignItems="center"
              justify="flex-end"
            >
              <Grid item>
                <PlaylistActionButton
                  className={`${classes.actionButton} ${
                    hovered && liked ? classes.liked : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onLikeClick(row, liked);
                  }}
                >
                  {liked ? <FavoriteRounded /> : <FavoriteBorder />}
                </PlaylistActionButton>
              </Grid>
              <Grid item>
                {hovered ? (
                  <PlaylistActionButton className={classes.actionButton}>
                    <MoreHoriz />
                  </PlaylistActionButton>
                ) : (
                  <div style={{ padding: 6}}>{msToTime(row.durationMs)}</div>
                )}
              </Grid>
            </Grid>
          </>
        ),
      },
    ],
    [classes]
  );

  const rowData = useMemo(
    () => ({
      onRowClick,
      current,
      playing,
      liked,
      onLikeClick
    }),
    [onRowClick, current, playing, liked, onLikeClick]
  );
  const rowRenderer = useCallback(
    ({ data, index, style }) => (
      <PlaylistListItem data={data} index={index} style={style} />
    ),
    []
  );
  const headerRenderer = useCallback(
    (columns) => <PlaylistListHeader columns={columns} />,
    []
  );

  return (
    <StickyHeaderList
      data={data}
      scrollOffset={PLAYLIST_TOP_BACKGROUND_COLLAPSED_HEIGHT}
      rowRenderer={rowRenderer}
      headerRenderer={headerRenderer}
      rowHeight={ROW_HEIGHT}
      columns={columns}
      rowData={rowData}
    />
  );
};

export const PlaylistActionButton = ({
  children,
  ...props
}: IconButtonProps) => {
  return (
    <IconButton
      circle
      {...props}
      component="div"
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseUp={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {children}
    </IconButton>
  );
};

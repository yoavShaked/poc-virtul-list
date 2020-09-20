import React from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

export default function App() {
  let page = 1;
  const LOADING = 1;
  const LOADED = 2;
  let itemStatusMap = {};

  const isItemLoaded = (index) => !!itemStatusMap[index];

  const loadMoreItems = (startIndex, stopIndex) => {
    for (let index = startIndex; index <= stopIndex; index++) {
      itemStatusMap[index] = { loading: LOADING };
    }
    return new Promise((resolve) =>
      setTimeout(() => {
        page++;
        for (let index = startIndex; index <= stopIndex; index++) {
          itemStatusMap[index].loading = LOADED;
          itemStatusMap[index].page = page;
        }
        resolve();
      }, 2500)
    );
  };

  const Row = ({ index, style }) => {
    let label;
    if (itemStatusMap[index]?.loading === LOADED) {
        console.log('page', itemStatusMap[index])
        console.log('index', index)
       updateUrl(index);
      label = `Row ${index} Page ${itemStatusMap[index]?.page}`;
    } else {
      label = "Loading...";
    }
    return (
      <div
        id={`${itemStatusMap[index]?.page}-${index}`}
        className="ListItem"
        style={style}
      >
        {label}
      </div>
    );
  };

  const onScroll = (e) => {};

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={1000}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <List
          onScroll={onScroll}
          className="List"
          height={150}
          itemCount={1000}
          itemSize={30}
          onItemsRendered={onItemsRendered}
          ref={ref}
          width={300}
        >
          {Row}
        </List>
      )}
    </InfiniteLoader>
  );

    function updateUrl(index) {
        const { search, pathname, origin } = window.location;
        if (!search) {
            history.pushState(
                { path: `${origin}${pathname}?page=1` },
                "",
                `${origin}${pathname}?page=1`
            );
        } else {
            history.pushState(
                { path: `${origin}${pathname}?page=${itemStatusMap[index]?.page}` },
                "",
                `${origin}${pathname}?page=${itemStatusMap[index]?.page}`
            );
        }
    }
}

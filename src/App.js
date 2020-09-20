import React from "react";
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { debounce } from "lodash";

export default function App() {
  const [minPage, setMinPage] = React.useState(null);
  let page = 1;
  const LOADING = 1;
  const LOADED = 2;
  let itemStatusMap = {};

  React.useEffect(() => {
    const { pathname, origin } = window.location;

    minPage &&
      window.history.pushState(
        { path: `${origin}${pathname}?page=${minPage.pageNumber}` },
        "",
        `${origin}${pathname}?page=${minPage.pageNumber}`
      );
  }, [minPage]);

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
      }, 500)
    );
  };

  const createRow = ({ index, style }) => {
    const rowRef = React.useRef();
    let label;
    if (itemStatusMap[index]?.loading === LOADED) {
      label = `Row ${index} Page ${itemStatusMap[index]?.page}`;
    //  updateUrl(itemStatusMap, index);
    } else {
      label = "Loading...";
    }
    const positionY = rowRef?.current?.getBoundingClientRect().y;
    if (!minPage) {
      setMinPage({positionY, pageNumber: itemStatusMap[index]?.page});
    } else if (positionY < minPage.positionY) {
      setMinPage({positionY, pageNumber: itemStatusMap[index]?.page});
    }
    return (
      <div
        key={`${itemStatusMap[index]?.page}-${index}`}
        id={`${itemStatusMap[index]?.page}-${index}`}
        className="ListItem"
        style={style}
        ref={rowRef}
      >
        {label}
      </div>
    );
  };

  const listComponent = ({ onItemsRendered, ref }) => {
    return (
      <List
        // onScroll={debounce(onScroll, 200)}
        className="List"
        height={300}
        itemCount={1000}
        itemSize={50}
        onItemsRendered={onItemsRendered}
        ref={ref}
        width={500}
      >
        {createRow}
      </List>
    );
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={1000}
      loadMoreItems={loadMoreItems}
    >
      {listComponent}
    </InfiniteLoader>
  );
}

// TODO: spy list children in order to know wich is the first one
function updateUrl(itemStatusMap, index) {
  const { pathname, origin } = window.location;

  window.history.pushState(
    { path: `${origin}${pathname}?page=${itemStatusMap[index]?.page}` },
    "",
    `${origin}${pathname}?page=${itemStatusMap[index]?.page}`
  );
  console.log("page", itemStatusMap[index]);
  console.log("index", index);
}

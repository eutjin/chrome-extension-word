import { useEffect, useState } from "react";
const { v4: uuidv4 } = require("uuid");
import useStore from "./store";

import styles from "./App.module.css";
import Detail from "./Detail";
import Home from "./Home";
import Group from "./Group";
import Label from "./Label";
import DetailText from "./DetailText";
import { Toaster } from "react-hot-toast";
import CollectionView from "./CollectionView";

const App = () => {
  const { page, setPage, resetPage } = useStore();

  return (
    <main className={styles.main}>
      {page == "home" && <Home />}
      {page == "detail"  && <Detail />}
      {page == "edit"  && <Detail />}
      {page == "group" && <Group />}
      {page == "collectionView" && <CollectionView />}
      {page == "label" && <Label />}
      {page == "detailText" && <DetailText/>}
      <Toaster position="bottom-center"/>
    </main>
  );
};
export default App;

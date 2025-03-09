import { useEffect, useState } from "react";
const { v4: uuidv4 } = require("uuid");
import useStore from "./store";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem as MenuItemInner,
  SubMenu as SubMenuInner,
} from "@szhsin/react-menu";
import "react-responsive-modal/styles.css";
import { Modal } from 'react-responsive-modal';

import styles from "./App.module.css";
import CreateGroup from "./CreateGroup";
import CreateLabel from "./CreateLabel";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";

const Label = () => {
    const [open, setOpen] = useState<boolean>(false);

    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);

  const { page, setPage, resetPage, getSavedTexts, textList, groupList, getGroup, getLabel, labelList, getGroupCount } =
    useStore();

    const navigateHome=()=>{
        setPage("home")
    }

    useEffect(()=>{
      getLabel()
    }, [])

    // useEffect(()=>{
    //   const getGroupInfo = async()=>{
    //     await getSavedTexts()
    //     await getGroup()
    //     await getGroupCount()
    //   }

    //   getGroupInfo()
   
    // }, [])
  return (
    <div className={styles.groupMain}>

      <CreateLabel open={open} onCloseModal={onCloseModal} />
      <div className={styles.groupTopNav}>
        <button className={styles.navButton} onClick={navigateHome}><ArrowLeftOutlined /></button>
        <span>Label</span>

        <button className={styles.navButton} onClick={onOpenModal}>
        <PlusOutlined />
        </button>
      </div>
      
      <div className={styles.groupContent}>
        {labelList.length > 0 ? (
          labelList.map((item) => <div className={styles.groupDefault}>{item.title}</div>)
        ) : (
          <div  className={styles.groupDefault} onClick={onOpenModal}>create</div>
        )}
      </div>
    </div>
  );
};

export default Label;

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
import CreateGroup, {Group as GroupType} from "./CreateGroup";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";

const Group = () => {
    const [open, setOpen] = useState<boolean>(false);

    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);

  const { page, setPage, resetPage, getSavedTexts, textList, groupList, getGroup, getGroupCount, setSelectedGroup, setFilterGroup, filterGroup, setTextListOnFilterChange} =
    useStore();

    const navigateHome=()=>{
        setPage("home")
    }

    useEffect(()=>{
      // const getGroupInfo = async()=>{
      //   await getSavedTexts()
      //   await getGroup()
      //   await getGroupCount()
      // }

      // getGroupInfo()
      getGroupCount()
   
    }, [])

    const handleClickGroup =async(item: GroupType)=>{

      
      await setPage("collectionView")
      await setSelectedGroup(item)
    await setFilterGroup([item])
    }

  return (
    <div className={styles.groupMain}>
        {/* <Modal open={open} onClose={onCloseModal} >
        <h2>Simple centered modal</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet
          hendrerit risus, sed porttitor quam.
        </p>
      </Modal> */}
      <CreateGroup open={open} onCloseModal={onCloseModal} />
      <div className={styles.groupTopNav}>
        <button className={styles.navButton} onClick={navigateHome}><ArrowLeftOutlined /></button>
        <span>Group</span>

        <button className={styles.navButton} onClick={onOpenModal}> <PlusOutlined /></button>
      </div>
      
      <div className={styles.groupContent}>
        
        {groupList.length > 0 ? (
          groupList.map((item) => <div className={styles.groupDefault} onClick={()=>handleClickGroup(item)}>
            <span>
            {item.title}</span> <span> {item.count ?? 0} words total</span></div>)
        ) : (
          <div  className={styles.groupDefault} onClick={onOpenModal}>create</div>
        )}
      </div>
    </div>
  );
};

export default Group;

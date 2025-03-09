import React, { useEffect, useState } from "react";
import styles from "./App.module.css";
import { ArrowLeftOutlined, CopyOutlined, DeleteOutlined, EditOutlined, EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import useStore from "./store";
import { TextForm } from "./Detail";
import { Group } from "./CreateGroup";
import CreateText from "./CreateText";

interface CollectionViewProps {
  type?: 'list' | 'grid';
}

const CollectionView = ({type = "list"} : CollectionViewProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const [hoverTextId, setHoverTextId]= useState<string | null>(null)

  const {
    page,
    setPage,
    resetPage,
    getSavedTexts,
    textList,
    groupList,
    getGroup,
    getGroupCount,
    selectedGroup,
    setSelectedText,
    setFilterGroup,
    setTextListOnFilterChange,
    filterGroup,
  } = useStore();

  const navigateBack = () => {
    setPage("group");
  };

  const handleClickText = (item: TextForm) => {
    setPage("detailText");
    setSelectedText(item);
  };

  useEffect(() => {
    setTextListOnFilterChange();
  }, []);

  useEffect(() => {
    console.log("GGG");
    setTextListOnFilterChange();
  }, [filterGroup]);

  const showTextCardOption = (text : TextForm) =>{
    setHoverTextId(text.id)
  }

  console.log("EWW")

  const basicView = () => {
    return (
      <div className={styles.homeContentMain}>
        {textList.length > 0 &&
          textList.map((item) => (
            <div
              className={styles.homeTextCard}
              onClick={() => handleClickText(item)}
            >
              {item.title}
            </div>
          ))}
      </div>
    );
  };

  const onHoverCard =(text : TextForm)=>{
    if(text.id == hoverTextId){
      return true
    }else{
      return false
    }
  }

  const listView = () => {
    return (
      <div className={styles.collectionViewList}>
        {textList.length > 0 &&
          textList.map((item) => (
            <div
              className={styles.textCardList}
              onClick={() => handleClickText(item)}
              onMouseEnter={()=>showTextCardOption(item)}
              onMouseLeave={()=>setHoverTextId(null)}
            >
              <div className={styles.textCardTop}>
                <div className={styles.textCardTitle}>{item.title}</div>
                {/* <div className={styles.textCardLabel}>
                  {item.labels.length >0 ? item.labels.map((label) => (<div className={styles.label_basic_s} style={{backgroundColor: label.color? label.color : 'gray'}}>{label.title}</div>)): null}
                </div> */}

                {onHoverCard(item) &&
                <div className={styles.textCardHoverOptContainer}>
                <DeleteOutlined /><EditOutlined /><CopyOutlined /></div>
                }
                
              </div>
              <div className={styles.textCardBottom}>{item.description}</div>
              <div className={styles.textCardLabel}>
                {item.labels.length > 0
                  ? item.labels.map((label) => (
                      <div
                        className={styles.label_basic_s}
                        style={{
                          backgroundColor: label.color ? label.color : "gray",
                        }}
                      >
                        {label.title}
                      </div>
                    ))
                  : null}
              </div>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className={styles.collectionViewMain}>
      <CreateText open={open} onCloseModal={onCloseModal} />
      <div className={styles.groupTopNav}>
        <button className={styles.navButton} onClick={navigateBack}>
          <ArrowLeftOutlined />
        </button>
        <span>{selectedGroup?.title}</span>

        <button className={styles.navButton} onClick={onOpenModal}>
          {" "}
          <PlusOutlined />
        </button>
      </div>
      <div className={styles.homeContent}>
        {/* <div className={styles.homeContentTop}>

        </div> */}
        {/* {basicView()} */}
        {type=='list'? listView(): basicView()}
      </div>
    </div>
  );
};

export default CollectionView;

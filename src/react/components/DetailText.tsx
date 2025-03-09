import { useEffect, useState } from "react";
const { v4: uuidv4 } = require("uuid");
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuItem as MenuItemInner,
  SubMenu as SubMenuInner,
} from "@szhsin/react-menu";
import useStore from "./store";

import styles from "./App.module.css";
import { Group } from "./CreateGroup";
import { Label } from "./CreateLabel";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  PlusOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import toast from "react-hot-toast";

const DetailText = () => {
  const { selectedText, getSavedTexts, deleteText, setPage, moveCard } =
    useStore();

  const navigateHome = () => {
    setPage("home");
  };

  const prevCard = () => {
    moveCard("prev");
  };

  const nextCard = () => {
    moveCard("next");
  };

  const handleEditText = () => {
    setPage("edit");
  };

  const handleDeleteText = () => {
    deleteAction();
  };

  const deleteAction = async () => {
    await deleteText();
    await moveCard("next");
    // toast.success("Card registered");
  };

  // MENU
  const menuClassName = ({ state }: any) =>
    state === "opening"
      ? styles.menuOpening
      : state === "closing"
      ? styles.menuClosing
      : styles.menu;

  const menuItemClassName = ({ hover, disabled }: any) =>
    disabled
      ? styles.menuItemDisabled
      : hover
      ? styles.menuItemHover
      : styles.menuItem;

  const submenuItemClassName = (modifiers: any) =>
    `${styles.submenuItem} ${menuItemClassName(modifiers)}`;

  const MenuItem = (props: any) => (
    <MenuItemInner {...props} className={menuItemClassName} />
  );

  const SubMenu = (props: any) => (
    <SubMenuInner
      {...props}
      menuClassName={menuClassName}
      itemProps={{ className: submenuItemClassName }}
      offsetY={-7}
    />
  );

  // main text content section
  const renderTextDetail = () => {
    return (
      <div className={`${styles.content} ${styles.detailText_content}`}>
        <div className={styles.detailText_section}>
          <div className={styles.textCard}>
            <div className={styles.textCard_option}>
              {selectedText?.group?.title && (
                <div className={styles.label_basic_s}>
                  {selectedText?.group?.title}
                </div>
              )}

              <Menu
                menuButton={
                  <button className={styles.button_basic_s}>
                    <EllipsisOutlined />
                  </button>
                }
                menuClassName={menuClassName}
                transition
              >
                <MenuItem onClick={handleEditText}>Edit</MenuItem>
                <MenuItem onClick={handleDeleteText}>Delete</MenuItem>
                <MenuItem>Settings</MenuItem>
              </Menu>
            </div>
            <div className={styles.textCard_text_title}>
              {selectedText?.title}
            </div>
            <hr className={styles.textCard_divider} />
            {selectedText?.description? 
            <span>{selectedText?.description} </span>
            : <span style={{color : "gray", display: 'flex', justifyContent: 'center', alignItems: 'center'}}>No description available. </span>
          }
            {/* <span>{selectedText?.description? selectedText?.description : "No description available." }</span> */}
            <hr className={styles.textCard_divider} />
            <div className={styles.textCard_label_section}>
              {selectedText?.labels.map((item) => (
                <div
                  className={styles.label_basic_s}
                  style={{ backgroundColor: item.color ? item.color : "gray" }}
                >
                  {item.title}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.detailText_footer}>
          <button className={styles.button_basic} onClick={prevCard}>
            <ArrowLeftOutlined />
          </button>
          <button className={styles.button_basic} onClick={nextCard}>
            <ArrowRightOutlined />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.main1}>
      <div className={`${styles.header} ${styles.header_detail}`}>
        <button className={styles.button_basic} onClick={navigateHome}>
          <ArrowLeftOutlined />
        </button>
        <span>Detail</span>

        <button className={styles.button_basic}>
          {" "}
          <PlusOutlined />
        </button>
      </div>

      {selectedText ? renderTextDetail() : null}
    </div>
  );
};

export default DetailText;

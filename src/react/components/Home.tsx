import { useEffect, useState } from "react";
const { v4: uuidv4 } = require("uuid");
import useStore from "./store";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuHeader,
  MenuItem as MenuItemInner,
  SubMenu as SubMenuInner,
} from "@szhsin/react-menu";

import styles from "./App.module.css";
import { TextForm } from "./Detail";
import { Group } from "./CreateGroup";
import {
  AppstoreOutlined,
  BarsOutlined,
  CheckOutlined,
  EllipsisOutlined,
  FileAddOutlined,
  FolderOutlined,
  MenuOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  PlusCircleTwoTone,
  PlusOutlined,
  SearchOutlined,
  TagOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import CollectionView from "./CollectionView";
import CollectionViewMain from "./CollectionViewMain";

const Home = () => {
  const {
    page,
    setPage,
    resetPage,
    getSavedTexts,
    textList,
    getGroup,
    groupList,
    setSelectedText,
    filterGroup,
    setFilterGroup,
    setTextListOnFilterChange,
  } = useStore();

  useEffect(() => {
    getSavedTexts();
    setSelectedText(null);
    console.log("v");
    getGroup();
  }, []);

  const handleClickOpt = (e: any) => {
    let selection = e.target.getAttribute("data-name");
    if (selection) {
      console.log(selection);
      setPage(selection);
    }
  };

  const handleClickCreateBtn = (opt: string) => {
    setPage(opt);
  };

  const handleClickTextHome = (item: TextForm) => {
    setPage("detailText");
    setSelectedText(item);
  };

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

  const onSelectGroupFilter = (e: any) => {
    console.log(e.value);

    let clickedGroup = e.value;

    let groupPosInFilter = filterGroup.findIndex(
      (item) => item.id == clickedGroup.id
    );
    if (groupPosInFilter > -1) {
      setFilterGroup(filterGroup.filter((item) => item.id != clickedGroup.id));
    } else {
      setFilterGroup([...filterGroup, clickedGroup]);
    }
  };

  const groupIsSelected = (group: Group) => {
    let index = filterGroup.findIndex((item) => item.id == group.id);
    if (index > -1) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    console.log("GGG");
    setTextListOnFilterChange();
  }, [filterGroup]);

  return (
    <>
      <div className={styles.homeMain}>
        {/* <div className={styles.homeTop}>
        <div className={styles.homeTopNav}>WordKeeper</div>
        <div className={styles.homeTopMain} onClick={(e) => handleClickOpt(e)}>
          <div data-name="group" className={styles.homeTopMainOpt}>
            <PlusCircleOutlined/> Deck
          </div>
          <div data-name="detail" className={styles.homeTopMainOpt}>
          <PlusCircleOutlined/> <span>Word</span> 
          </div>
          <div data-name="label" className={styles.homeTopMainOpt}>
          <PlusCircleOutlined/> <span>Label</span>
          </div>
        </div>
      </div> */}

        <div className={styles.homeTop}>
          <div className={styles.homeTopNav}>
            <div className={styles.homeTopNavLeft}>
              <div>WordKeeper</div>
              <div>
                <SearchOutlined />
              </div>
            </div>
            <div className={styles.homeTopNavRight}>
              <Menu
                menuButton={
                  <MenuButton className={styles.btnBasic01}>
                    <div style={{ fontSize: "0.8rem" }}>
                      <PlusOutlined />
                    </div>
                    <div>Create</div>
                  </MenuButton>
                }
                menuClassName={menuClassName}
                
                transition
              >
                <MenuItem
                  value="group"
                  onClick={() => handleClickCreateBtn("group")}
                >
                  <div style={{display:'flex', gap: '1rem', alignItems: 'center'}}><FolderOutlined /><span>Deck</span></div>
                  </MenuItem>
                <MenuItem
                  value="detail"
                  onClick={() => handleClickCreateBtn("detail")}
                >
                  <div style={{display:'flex', gap: '1rem', alignItems: 'center'}}><FileAddOutlined /><span>Word</span></div>
                  </MenuItem>
                <MenuItem
                  value="label"
                  onClick={() => handleClickCreateBtn("label")}
                
                >
                  <div style={{display:'flex', gap: '1rem', alignItems: 'center'}}><TagOutlined /><span>Label</span></div>

                </MenuItem>
              </Menu>
            </div>
          </div>
          {/* <div
            className={styles.homeTopMain}
            onClick={(e) => handleClickOpt(e)}
          >
            <div data-name="group" className={styles.homeTopMainOpt}>
              <PlusCircleOutlined /> Deck
            </div>
            <div data-name="detail" className={styles.homeTopMainOpt}>
              <PlusCircleOutlined /> <span>Word</span>
            </div>
            <div data-name="label" className={styles.homeTopMainOpt}>
              <PlusCircleOutlined /> <span>Label</span>
            </div>
          </div> */}
        </div>

        {/* <EllipsisOutlined />
        <MenuOutlined />
        <MoreOutlined />
        <TagsOutlined />
        <FileAddOutlined />
        <FolderOutlined />
        
        <PlusOutlined /> */}

        <div className={styles.homeContent}>
          <div className={styles.homeContentTop}>
            <Menu
              menuButton={
                // <div className={styles.homeContentTopSelector}>SELECTORR</div>
                <MenuButton className={styles.btnBasic01}>Filter</MenuButton>
              }
              menuClassName={menuClassName}
              transition
            >
              <MenuItem className={styles.menuHeader} disabled>
                Group
              </MenuItem>
              <MenuDivider />
              <MenuDivider />
              {groupList.length > 0 &&
                groupList.map((item) => (
                  <MenuItem
                    value={item}
                    onClick={(e: any) => onSelectGroupFilter(e)}
                  >
                    {" "}
                    <div>{item.title}</div>
                    <div>{groupIsSelected(item) && <CheckOutlined />}</div>
                  </MenuItem>
                ))}
              <MenuDivider className={styles.menuDivider} />
              <MenuItem className={styles.menuHeader} disabled>
                Label
              </MenuItem>
              <MenuItem>Reset</MenuItem>
              {/* <MenuItem>Copy</MenuItem>
            <MenuItem>Paste</MenuItem> */}
            </Menu>

            <div className={styles.viewTypeGroup}>
              <BarsOutlined />
              <AppstoreOutlined />
            </div>
          </div>
          <CollectionViewMain type="list" />
          {/* <div className={styles.homeContentMain}>
          {textList.length > 0 &&
            textList.map((item) => (
              <div
                className={styles.homeTextCard}
                onClick={() => handleClickTextHome(item)}
              >
                {item.title}
              </div>
            ))}
        </div> */}
        </div>
        <button className={styles.addTodoButton}>➕ Add Todo</button>
      </div>
    </>
  );
};

export default Home;

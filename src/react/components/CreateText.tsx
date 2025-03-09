import { useEffect, useState } from "react";
const { v4: uuidv4 } = require("uuid");
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem as MenuItemInner,
  SubMenu as SubMenuInner,
} from "@szhsin/react-menu";
import useStore from "./store";

import styles from "./App.module.css";
import CreateGroup, { Group } from "./CreateGroup";
import CreateLabel, { Label } from "./CreateLabel";
import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import Modal from "react-responsive-modal";

export interface TextForm {
  id: string;
  title: string;
  description: string;
  links: string[];
  createDate: Date | number | null;
  updateDate: Date | number | null;
  labels: Label[];
  difficulty: null;
  group: Group | null;
}

type Props = {
  open: boolean;
  onCloseModal: () => void;
};

const CreateText = ({ open, onCloseModal }: Props) => {
  const [selectedTextLocal, setSelectedTextLocal] = useState<string>("");
  const [selected, setSelected] = useState<Label[]>([]);

  const [openCreateGroupModal, setOpenCreateGroupModal] = useState<boolean>(false);
  const [openCreateLabelModal, setOpenCreateLabelModal] = useState<boolean>(false);

  const onOpenCreateGroupModal = () => setOpenCreateGroupModal(true);
  const onCloseCreateGroupModal = () => setOpenCreateGroupModal(false);
  
  const onOpenCreateLabelModal = () => setOpenCreateLabelModal(true);
  const onCloseCreateLabelModal = () => setOpenCreateLabelModal(false);

  const {
    page,
    setPage,
    putText,
    setText,
    resetPage,
    getSavedTexts,
    textList,
    groupList,
    labelList,
    getLabel,
    getGroup,
    selectedText, setSelectedText, selectedGroup
  } = useStore();

  const initializeTextForm =()=>{
    if(selectedText){
      return selectedText
    }else if(selectedGroup){
      return {
        id: uuidv4(),
        title: "",
        description: "",
        links: [],
        createDate: null,
        updateDate: null,
        labels: [],
        difficulty: null,
        group: selectedGroup,
      }
    }
      else{
      return {
        id: uuidv4(),
        title: "",
        description: "",
        links: [],
        createDate: null,
        updateDate: null,
        labels: [],
        difficulty: null,
        group: null,
      }
    }
  }

  const [textForm, setTextForm] = useState<TextForm>(initializeTextForm);

  useEffect(() => {
    chrome.storage.local.get("savedText", (result) => {
      console.log("result: ", result);
    });
    getGroup();
    getLabel();

    console.log("dd", page)
    console.log("dd2", selectedGroup)

    if(selectedText && page == "edit"){
      console.log("FF", selectedText)
      setTextForm(selectedText)
      setSelected(selectedText.labels)
    }

    setTextForm({ ...textForm, group: selectedGroup })
  }, []);

  useEffect(()=>{
    setTextForm({ ...textForm, group: selectedGroup })
  }, [selectedGroup])

  useEffect(()=>{
console.log("textform", textForm)
  }, [textForm])

  const formChange = (e: any) => {
    console.log("eeee", e.target.value, " ", e.target.name);
    setTextForm({ ...textForm, [e.target.name]: e.target.value });
  };

  const saveText = async () => {
    if (!textForm.title || textForm.title.trim() === "") {
      toast.error("Front of card cannot be empty");
      return;
    }

    if(page == "edit"){
      await putText(textForm)
    }else{
      await setText(textForm);
    }


    await resetTextForm();
    if(page == "edit"){
      toast.success("Card updated");
      // to move to prev page
      setPage('detailText')
      setSelectedText(textForm)
    }else{
      toast.success("Card registered");
    }

    
  };

  const resetTextForm = () => {
    console.log("reset");
    setTextForm({
      id: uuidv4(),
      title: "",
      description: "",
      links: [],
      createDate: null,
      updateDate: null,
      labels: [],
      difficulty: null,
      group: null,
    });
  };

  const navigateHome = () => {
    setPage("home");
  };



  const onSelectGroup = (item: Group) => {
    console.log(item);
    setTextForm({ ...textForm, group: item });
  };

  const onSelectLabel = (e: any) => {
    console.log("E", e);
    let clickedLabel: Label = e.value;

    let labelPos = selected.findIndex((item) => item.id == clickedLabel.id);
    if (labelPos > -1) {
      setSelected(selected.filter((item) => item.id != clickedLabel.id));
    } else {
      setSelected([...selected, clickedLabel]);
    }
  };

  const labelIsSelected = (label: Label) => {
    let index = selected.findIndex((item) => item.id == label.id);
    if (index > -1) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    setTextForm({ ...textForm, labels: selected });
  }, [selected]);

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

  return (
    <Modal open={open} onClose={onCloseModal}  classNames={{
      overlay: styles.customOverlay,
      modal: styles.customModal,
      modalContainer: styles.customModalContainer
    }}>
    <div className={styles.main1}>
      <div className={styles.detail}>
        <div className={styles.textInputMainModal}>
          <div>
            <label>Text</label>
            <input
              type="text"
              name="title"
              value={textForm.title}
              className={styles.saveTitle}
              onChange={(e) => formChange(e)}
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              name="description"
              value={textForm.description}
              className={styles.saveDesc}
              onChange={(e) => formChange(e)}
            />
          </div>

          <div className={styles.textOptionMain}>
            <Menu
              menuButton={
                // <div className={styles.homeContentTopSelector}>SELECTORR</div>
                <MenuButton className={styles.menuButtonText}>
                  {textForm.group ? textForm.group?.title : "Group"}
                </MenuButton>
              }
              menuClassName={menuClassName}
              transition
            >
              {groupList.length > 0 &&
                groupList.map((item) => (
                  <MenuItem onClick={() => onSelectGroup(item)}>
                    {item.title}
                  </MenuItem>
                ))}
              <MenuItem onClick={()=>onOpenCreateGroupModal()}>Create Deck</MenuItem>
            </Menu>

            <Menu
              menuButton={
                // <div className={styles.homeContentTopSelector}>SELECTORR</div>
                <MenuButton className={styles.menuButtonText}>Label</MenuButton>
              }
              menuClassName={menuClassName}
              transition
            >
              {labelList.length > 0 &&
                labelList.map((item) => (
                  <MenuItem
                    // name="description"
                    value={item}
                    onClick={(e: any) => onSelectLabel(e)}
                  >
                    <div>{item.title}</div>
                    <div>{labelIsSelected(item) && <CheckOutlined />}</div>
                  </MenuItem>
                ))}
              <MenuItem onClick={()=>onOpenCreateLabelModal()}>Create Label</MenuItem>

            </Menu>
          </div>
        </div>

        <div className={styles.displayBtnGroupModal}>
          <button className={styles.saveBtn} onClick={saveText}>
            Save
          </button>
          <button className={styles.saveBtn} onClick={navigateHome}>
            Back
          </button>
          {/* <button className={styles.saveBtn} onClick={resetPage}>
          RESET
        </button> */}
        </div>
      </div>

      {/* <textarea>dddd</textarea> */}
      {/* <div>{selectedText}</div> */}
      {/* <button onClick={generateDogGif}>Generate Dog Gif</button> */}
    </div></Modal>
  );
};
export default CreateText;

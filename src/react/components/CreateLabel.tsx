import { useEffect, useState } from "react";
const { v4: uuidv4 } = require("uuid");
import useStore from "./store";

import styles from "./App.module.css";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { HexColorPicker, RgbaColorPicker, HexColorInput } from "react-colorful";
import "./styles.css";
import toast from "react-hot-toast";

export interface Label {
  id: string;
  title: string;
  description: string | null;
  color: string | null;
  createDate: Date | null;
  updateDate: Date | null;
}

type Props = {
  open: boolean;
  onCloseModal: () => void;
};

const CreateLabel = ({ open, onCloseModal }: Props) => {
  const [color, setColor] = useState<string>("#aabbcc");
  const [labelForm, setLabelForm] = useState<Label>({
    id: uuidv4(),
    title: "",
    description: "",
    color: "",
    createDate: null,
    updateDate: null,
  });

  const {
    page,
    setPage,
    resetPage,
    getSavedTexts,
    textList,
    groupList,
    getGroup,
    getLabel,
  } = useStore();

  useEffect(() => {
    chrome.storage.local.get("group", (result) => {
      // const savedTextList = document.getElementById('savedTextList');
      // savedTextList.innerHTML = result.savedText
      //   ? result.savedText.map(text => `<li>${text}</li>`).join('')
      //   : 'No saved text';
      console.log("result: ", result);
    });
  }, []);

  const formChange = (e: any) => {
    console.log("eeee", e.target.value, " ", e.target.name);
    setLabelForm({ ...labelForm, [e.target.name]: e.target.value });
  };

  const saveLabel = () => {
    console.log("saveeee", color);

    if(!labelForm.title || labelForm.title.trim()===""){
      // setInputError(true)
      toast.error('Front of card cannot be empty')
      return
    }

    let data = { ...labelForm, color: color, createDate: Date.now(), updateDate: Date.now() };
    console.log("DARA", data);
    chrome.storage.local.get("label", (result) => {
      const label = result.label || [];
      label.push(data);

      // savedText.push(request.selectedText);
      chrome.storage.local.set({ label });
      setLabelForm({
        id: uuidv4(),
        title: "",
        description: "",
        color: "",
        createDate: null,
        updateDate: null,
      });
      onCloseModal();
      getLabel();
    });
  };

  const closeModal = () => {
    onCloseModal();
  };

  useEffect(()=>{
console.log("COLOR", color)
  }), [color]

  return (
    <Modal open={open} onClose={onCloseModal} classNames={{
      overlay: styles.customOverlay,
      modal: styles.customModal,
      modalContainer: styles.customModalContainer
    }}>
      <div className={styles.main1}>
        {/* <h1 className={styles.header}>Word Helper111</h1> */}
        <div className={styles.saveComponent}>
          <div>
            <label>Text</label>
            <input
              type="text"
              name="title"
              className={styles.saveTitle}
              onChange={(e) => formChange(e)}
            />
          </div>

          {/* <div>
            <label>Description</label>
            <textarea
              name="description"
              className={styles.saveDesc}
              onChange={(e) => formChange(e)}
            />
          </div> */}

          <div>
            <label>Description</label>
            <HexColorPicker
              color={color}
              onChange={setColor}
              style={{ width: "100%", height: "8rem" }}
            />
            <HexColorInput color={color} onChange={setColor} className={styles.hexColorInput} />
          </div>
          <button className={styles.saveBtn} onClick={saveLabel}>
            save
          </button>
          <button className={styles.saveBtn} onClick={closeModal}>
            close
          </button>
          {/* <button className={styles.saveBtn} onClick={resetPage}>
            RESET
          </button> */}
        </div>
      </div>
    </Modal>
  );
};
export default CreateLabel;

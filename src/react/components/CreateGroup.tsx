import { useEffect, useState } from "react";
const { v4: uuidv4 } = require("uuid");
import useStore from "./store";

import styles from "./App.module.css";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import toast from "react-hot-toast";

export interface Group {
  id: string;
  title: string;
  description: string | null;
  createDate: Date | null;
  updateDate: Date | null;
  count: number | null;
}

type Props = {
  open: boolean;
  onCloseModal: () => void;
};

const CreateGroup = ({ open, onCloseModal }: Props) => {
  const [selectedText, setSelectedText] = useState<string>("");
  const [inputError, setInputError] = useState<Boolean>(false)
  const [groupForm, setGroupForm] = useState<Group>({
    id: uuidv4(),
    title: "",
    description: "",
    createDate: null,
    updateDate: null,
    count: null,
  });

  const { page, setPage, resetPage, getSavedTexts, textList, groupList, getGroup, getGroupCount, selectedGroup} =
  useStore();

  useEffect(() => {
    // chrome.storage.local.get("group", (result) => {
    //   // const savedTextList = document.getElementById('savedTextList');
    //   // savedTextList.innerHTML = result.savedText
    //   //   ? result.savedText.map(text => `<li>${text}</li>`).join('')
    //   //   : 'No saved text';
    //   console.log("result: ", result);
    // });
    // getGroupCount()
  }, []);

  useEffect(()=>{
    if(inputError){

    }
  }, [inputError])

  const formChange = (e: any) => {
    console.log("eeee", e.target.value, " ", e.target.name);

    if(e.target.name == "title"){
      setInputError(false)
    }
    setGroupForm({ ...groupForm, [e.target.name]: e.target.value });
  };

  const saveGroup = () => {
    console.log("saveeee");
    // setTextForm({...textForm, ["createDate"]: new Date(Date.now()), ["updateDate"]: new Date(Date.now()) })

    // validate form
    if(!groupForm.title || groupForm.title.trim()===""){
      // setInputError(true)
      toast.error('Front of card cannot be empty')
      return
    }

    let data = { ...groupForm, createDate: Date.now(), updateDate: Date.now() };
    console.log("DARA", data);
    chrome.storage.local.get("group", (result) => {
      const group = result.group || [];
      group.push(data);

      // savedText.push(request.selectedText);
      chrome.storage.local.set({ group }); //todo: save logic to be stored in store in the future
      setGroupForm({
        id: uuidv4(),
        title: "",
        description: "",

        createDate: null,
        updateDate: null,
        count: null
      });
      onCloseModal();
      toast.success("Deck created!")
      getGroup()
    });
  };

  const closeModal =()=>{
    onCloseModal()
    setInputError(false)
  }



  return (
    <Modal open={open} onClose={onCloseModal}  classNames={{
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
              className={`${styles.saveTitle} ${inputError && styles.formBorderRequired}`}
              onChange={(e) => formChange(e)}
            />
            {inputError && <span className={styles.formTextRequired} >required</span>}
            
          </div>

          <div>
            <label>Description</label>
            <textarea
              name="description"
              className={styles.saveDesc}
              onChange={(e) => formChange(e)}
            />
          </div>
          <button className={styles.saveBtn} onClick={saveGroup}>
            save
          </button>
          <button className={styles.saveBtn} onClick={closeModal}>
            close
          </button>
          {/* <button className={styles.saveBtn} onClick={resetPage}>
            RESET
          </button> */}
        </div>

        {/* <textarea>dddd</textarea> */}
        <div>{selectedText}</div>
        {/* <button onClick={generateDogGif}>Generate Dog Gif</button> */}
      </div>
    </Modal>
  );
};
export default CreateGroup;

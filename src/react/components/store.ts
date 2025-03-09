import { create } from "zustand";
import { TextForm } from "./Detail";
import { Group } from "./CreateGroup";
import { Label } from "./CreateLabel";
import toast from "react-hot-toast";

interface Store {
  page: string;
  textList: Array<TextForm>;
  groupList: Array<Group>;
  labelList: Array<Label>;
  selectedText: TextForm | null;
  selectedGroup: Group | null;
  filterGroup: Array<Group>;
  filterLabel: Array<Group>;
  moveCard: (data: "next" | "prev") => void;
  setSelectedText: (text: TextForm | null) => void;
  setPage: (page: string) => void;
  setText: (text: TextForm) => void;
  putText: (text: TextForm) => void;
  deleteText: () => void;
  resetPage: () => void;
  getSavedTexts: () => void;
  getGroup: () => void;
  getLabel: () => void;
  getGroupCount: () => void;
  setFilterGroup: (data: Array<Group>) => void;
  setTextListOnFilterChange: () => void;
  setSelectedGroup: (group: Group) => void;
}

const useStore = create<Store>((set, get) => ({
  page: "home",
  textList: [],
  groupList: [],
  labelList: [],
  filterGroup: [],
  filterLabel: [],
  selectedText: null,
  selectedGroup: null,
  setPage: (page: string) => set((state) => ({ page: page })),
  setText: async (text: TextForm) => {
    let data = { ...text, createDate: Date.now(), updateDate: Date.now() };

    await chrome.storage.local.get("savedText", (result) => {
      const savedText = result.savedText || [];
      savedText.push(data);
      chrome.storage.local.set({ savedText });
    });
  },
  putText: async (text: TextForm) => {
    let data = { ...text, updateDate: Date.now() };

    await chrome.storage.local.get("savedText", (result) => {
      let savedText = result.savedText;

      const index = savedText.findIndex((item) => item.id == text.id);
      if (index > -1) {
        savedText.splice(index, 1, data);
      } else {
        console.log("edit fail");
      }

      console.log("EDITED", savedText);
      chrome.storage.local.set({ savedText });
    });
  },

  deleteText: async () => {
  //   console.log("DEL", get().selectedText);

  //   let text = await get().selectedText

  // await chrome.storage.local.get("savedText", (result)=>{
  //     let savedText = result.savedText;

  //     console.log("TEXT", text)

  //     const index = savedText.findIndex((item) => item.id == text.id);
      
  //     if (index > -1) {
  //       savedText.splice(index, 1);
  //     } else {
  //       console.log("delete fail fail");
  //     }

  //     console.log("deleted", savedText);
  //    chrome.storage.local.set({ savedText });

  //    //
  //    set(()=>({textList: savedText}))
  //    toast.success("Card deleted");
  //   })

  console.log("DEL", get().selectedText);

  let text = get().selectedText;

  // Get storage data
  const { savedText } = await chrome.storage.local.get("savedText");

  console.log("TEXT", text);

  const index = savedText.findIndex((item) => item.id == text.id);
  if (index > -1) {
    savedText.splice(index, 1);
  } else {
    console.log("delete fail fail");
    return;
  }

  console.log("deleted", savedText);

  // Set updated storage data
  await chrome.storage.local.set({ savedText });

  // Update Zustand store state
  set(() => ({ textList: savedText }));

  // Show success message
  toast.success("Card deleted");

  },

  resetPage() {
    set(() => ({ page: "home" }));
  },
  getSavedTexts: async () => {
    console.log("get text");
    await chrome.storage.local.get("savedText", (result) => {
      if (result.savedText) {
        set(() => ({ textList: result.savedText }));
        console.log("RES from zustabd1", result.savedText);
      }
    });
  },
  getGroup: async () => {
    console.log("get group");
    // let group = await chrome.storage.sync.get("group")
    // if(group){
    //     console.log("HHH", group)
    // }

    return new Promise<void>((resolve) => {
      chrome.storage.local.get("group", (result) => {
        if (result.group) {
          // set(()=>({textList: result.savedText}))
          console.log("RES from gr", result);
          set(() => ({ groupList: result.group }));
        }
        resolve();
      });
    });
  },
  getLabel() {
    chrome.storage.local.get("label", (result) => {
      if (result.label) {
        set(() => ({ labelList: result.label }));
      }
    });
  },
  getGroupCount: async () => {
    console.log("groupList: ", get().groupList);

    await get().getSavedTexts();
    await get().getGroup();

    let texts = get().textList;
    let groupList = get().groupList;
    console.log("text and list", texts, "/", groupList);
    for (let i = 0; i < texts.length; i++) {
      console.log("index: ", i, "text", texts[i]);
      let groupType = texts[i].group?.id || null;

      if (groupType) {
        let modifyIndex = groupList.findIndex((item) => item.id == groupType);
        let group = groupList.find((item) => item.id == groupType);

        if (group) {
          group.count = (group.count || 0) + 1;
          groupList.splice(modifyIndex, 1, group);
        }
      }
    }
    console.log("counter", groupList);
    set(() => ({ groupList: groupList }));
  },
  setSelectedText: (data) => {
    set(() => ({ selectedText: data }));
  },
  moveCard: (data) => {
    const currCard = get().selectedText;
    const textList = get().textList;
    console.log("1", currCard)
    console.log("2", textList)
    if (currCard) {
      let index = textList.findIndex((item) => item.id === currCard.id);
      console.log("3", index)
      if (data === "next") {
        if(index == -1){
          index = 0
        }else{
          index = index == textList.length - 1 ? 0 : index + 1;

        }
      } else {
        index = index == 0 ? textList.length - 1 : index - 1;
      }

      console.log("!!", index)


      set(() => ({ selectedText: textList[index] }));
      // if(index > 0){
      //   set(() => ({ selectedText: textList[index] }));
      // }else{
      //   set(() => ({selectedText: null}))
      // }
      
    }
  },
  setFilterGroup: (groupList: Array<Group>)=>{
      set(()=>({filterGroup: groupList}))
  },
  setTextListOnFilterChange: () =>{
    
    let filter = get().filterGroup
    if(get().filterGroup.length > 0){

      chrome.storage.local.get("savedText", (result) => {
        if (result.savedText) {
          let texts = result.savedText
          let data = texts.filter(item => filter.some(group => group.id == item.group?.id))

          set(() => ({ textList: data }));
          console.log("123",data);
        }
      });

    
    
    }else{
     get().getSavedTexts();
    }
  },
  setSelectedGroup: (group: Group) => {
    set(()=> ({selectedGroup: group}))
  }
}));

export default useStore;

import { useEffect, useState } from "react";
import MainSection from "../components/MainSection";
import Sidebar from "../components/Sidebar";
import "./App.css";
import Header from "../components/Header";
import uuid from "react-uuid";
import TagModal from "../components/TagModal";
import * as utils from "./utils";
import { formatISO } from "date-fns";

function App() {
  const [notes, setNotes] = useState([
    {
      id: uuid(),
      title: "About foxes and dogs",
      body: "Quick brown fox jumps over the lazy dog.",
      date: formatISO(new Date(), { representation: "date" }),
      tagList: ["0", "1"],
    },
    {
      id: uuid(),
      title: "About foxes and dogs",
      body: "Quick brown fox jumps over the lazy dog.",
      date: formatISO(new Date(), { representation: "date" }),
      tagList: ["0"],
    },
    {
      id: uuid(),
      title: "About foxes and dogs",
      body: "Quick brown fox jumps over the lazy dog.",
      date: "2023-01-30",
      tagList: ["0", "1"],
    },
    {
      id: uuid(),
      title: "About foxes and dogs",
      body: "Quick brown fox jumps over the lazy dog.",
      date: "2023-01-21",
      tagList: ["1"],
    },
    {
      id: uuid(),
      title: "Big dump",
      body: "Dear diary. Today I went to the bathroom and took a major shit. Damn, that was intense! Even my neighbours came down to...",
      date: "2022-12-31",
      tagList: ["0"],
    },
    {
      id: uuid(),
      title: "Big dump",
      body: "Dear diary. Today I went to the bathroom and took a major shit. Damn, that was intense! Even my neighbours came down to...",
      date: "2022-12-16",
      tagList: ["1"],
    },
  ]);

  const handleNoteOpen = function (noteId) {
    setActiveNote(noteId);
  }

  const getNote = function(id) {
    return notes.find(note => note.id === id)
  }

  const getTitle = function () {
    if (activeTag) return getTag(activeTag).name;
    return "All notes";
  };

  const getTag = function (id) {
    return tags.find((tag) => tag.id === id);
  };

  const [tags, setTags] = useState(
    localStorage.tags
      ? JSON.parse(localStorage.tags)
      : [
          { name: "Journal", id: "0" },
          { name: "Notes", id: "1" },
        ]
  );

  const [activeNote, setActiveNote] = useState(null);
  const [activeTag, setActiveTag] = useState(null);

  useEffect(() => {
    localStorage.setItem("tags", JSON.stringify(tags));
  }, [tags]);

  const [tagModalActive, setTagModalActive] = useState(false);

  const handleAddTag = (newTag) => {
    if (!newTag.name) return;
    newTag.id = uuid();
    const tagsUpdated = [...tags, newTag].sort(utils.sortTags);
    setTags(tagsUpdated);
  };

  const handleDeleteTag = function (idToDelete) {
    if (idToDelete === activeTag) {
      setActiveTag(null);
    }
    setTags(tags.filter((tag) => tag.id !== idToDelete));
    const notesUpdated = notes.map((note) => {
      note.tagList = note.tagList.filter(id => id !== idToDelete);
      return note;
    });
    setNotes(notesUpdated)
  };

  const handleUpdateTag = function (tagUpdated) {
    const tagsUpdated = tags.map((tag) => {
      if (tag.id === tagUpdated.id) {
        return tagUpdated;
      } else {
        return tag;
      }
    });
    tagsUpdated.sort(utils.sortTags);
    setTags(tagsUpdated);
  };

  return (
    <div className="App">
      <Header title={getTitle()} />
      <Sidebar
        tags={tags}
        setTagModalActive={setTagModalActive}
        activeTag={activeTag}
        setActiveTag={setActiveTag}
        setActiveNote={setActiveNote}
      />
      <div className="main-section">
        <MainSection
          activeNote={getNote(activeNote)}
          activeTag={activeTag}
          notes={notes}
          tags={tags}
          onNoteOpen={handleNoteOpen}
        />
      </div>
      <TagModal
        onDeleteTag={handleDeleteTag}
        tags={tags}
        isActive={tagModalActive}
        onClose={() => setTagModalActive(false)}
        onAddTag={handleAddTag}
        onUpdateTag={handleUpdateTag}
      />
    </div>
  );
}

export default App;

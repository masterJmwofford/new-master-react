import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Index from "./components/Index";
import Note from "./components/Note";

function App() {
  const [notes, setNotes] = useState([]);
  const [createForm, setCreateForm] = useState({
    title: "",
    body: "",
  });

  const [updateForm, setUpdateForm] = useState({
    _id: null,
    title: "",
    body: "",
  });
  // --------------------[State]

  // -------------------------------------[CREATE]
  const createNote = async (e) => {
    e.preventDefault();
    // 1. Create Note
    const res = await axios.post("http://localhost:3001/notes", createForm);
    // 1a.) Add 2nd arg to pass data , {}
    console.log("CreatedNote : ", res);

    // 2. Update State
    setNotes(() => [res.data.note, ...notes]);
    // adds note to notes array in state.
    // ------------------------------------------
    // Clear Form state
    setCreateForm(() => ({
      title: "",
      body: "",
    }));
  };

  // -------------------------------------[READ]
  const fetchNotes = async () => {
    //  1.Make Request
    const response = await axios({
      method: "get",
      url: "/notes",
    });
    const info = await response.data;
    // 2. Save as State
    await setNotes(info.notes);
    console.log("Notes FETCHED");
  };
  // -------------------------------------[UPDATE]
  const updateCreateFormField = (e) => {
    const { name, value } = e.target;
    console.log({ name, value });
    // Destructure Values from event target
    setCreateForm(() => ({
      ...createForm,
      [name]: value,
      //[whatever var name is equal to ]: value is reassigned
    }));
    // update State
  };

  const handleUpdateFieldChange = (e) => {
    const { value, name } = e.target;
    // Destructure Values from event target
    setUpdateForm(() => ({
      ...updateForm,
      [name]: value,
      //[whatever var name is equal to ]: value is reassigned
    }));
  };

  const toggleUpdate = (note) => {
    // 1. Get the current note (_id) vals
    console.log("Current Note : ", note);
    // 2. Set state on update form
    setUpdateForm({
      _id: note._id,
      title: note.title,
      body: note.body,
    });
  };

  const updateNote = async (e) => {
    e.preventDefault();
    // Destructure Note
    const { title, body } = updateForm;
    // Send the update request by using the updateForm state
    const res = await axios.put(
      `http://localhost:3001/notes/${updateForm._id}`,
      { title, body }
    );
    console.log(res);

    // Update State
    const newNotes = [...notes];

    const noteIndex = notes.findIndex((note) => {
      return note._id === updateForm._id;
      // Find Note by Index in Arr by seeing if they match
    });

    newNotes[noteIndex] = res.data.note;
    // reassigning value of Note
    setNotes(newNotes);

    setUpdateForm({
      _id: null,
      title: "",
      body: "",
    });
    // Clear Form so form_reuse
  };
  // -------------------------------------[DELETE]
  const deleteNote = async (_id) => {
    // 1. Delete Note
    const res = await axios.delete(`http://localhost:3001/notes/${_id}`);
    console.log(res);
    // 2. UpdateState

    const newNotes = [...notes].filter((note) => {
      return note._id !== _id;
      // return all notes EXCEPT this one with :current _id
    });
    setNotes(newNotes);
    // update Notes in state
  };
  // ----------------------------------------{{useEffect}}
  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="App">
      <h1 className="noteTitle">Notes DashBoard</h1>
      <div className="formAdmin">
        <div className="formContainer">
          <h2> + New Note</h2>
          <form onSubmit={createNote}>
            <input
              name="title"
              value={createForm.title}
              onChange={updateCreateFormField}
            />
            <textarea
              name="body"
              value={createForm.body}
              onChange={updateCreateFormField}
            />
            <button>CreateNote </button>
          </form>
        </div>
        <hr />
        {/* -------> {form_split: } */}

        {/* update Ternary -> if form is active, display updateForm component */}
        {updateForm._id && (
          <>
            <div className="formContainer">
              <h2> Update Note</h2>
              <form onSubmit={updateNote}>
                <input
                  name="title"
                  value={updateForm.title}
                  onChange={handleUpdateFieldChange}
                />
                <textarea
                  name="body"
                  value={updateForm.body}
                  onChange={handleUpdateFieldChange}
                />
                <button> UpdateNote </button>
              </form>
            </div>
          </>
        )}
      </div>
      
      {/* Notes ternary -> [IF] notes = true, [THEN] render Index,[ELSE] render Note component */}
      {notes ? (
        <Index info={notes} deleteFunc={deleteNote} editFunc={toggleUpdate} />
      ) : (
        <Note />
      )}
      <hr />
    </div>
  );
}

export default App;

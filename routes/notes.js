const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

//Route 1 fetch all notes form the database using : GET "/api/notes/fetchallnotes"  login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//Route 2 Add a new note  using : Post "/api/notes/addnote"  login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid name").isLength({ min: 3 }),
    body("description", "description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      //if there are errors ,return bad req
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({ title, description, tag, user: req.user.id });
      const savenote = await note.save();
      res.json(savenote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//Route 3 Update an existing note note  using : put "/api/notes/updatenote"  login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //find the note to be update and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    res.json({ note });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

//Route 4 Delete an existing note note  using : delete "/api/notes/updatenote"  login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //find the note to be delete and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }

    //Allow deletion only if user owns it
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);

    res.json({ success: "Note has been deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});
module.exports = router;

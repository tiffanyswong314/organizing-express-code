const path = require("path");
const notes = require(path.resolve("src/data/notes-data"));

function noteExists(req, res, next) {
    const noteId = Number(req.params.noteId);
    const foundNote = notes.find((note) => note.id === noteId);
    if (foundNote) {
        return next();
    } else {
        return next({
            status: 404,
            message: `Note id not found: ${req.params.noteId}`,
        });
    }
}

function hasText(req, res, next) {
    const { data: { text } = {} } = req.body;
    if (text) {
        return next();
    }
    return next({
        status: 400,
        message: "A 'text' property is required.",
    });
};

// export list
function list(req, res) {
    res.status(200).json({ data: notes });
}

// export read
function read(req, res) {
    const { noteId } = req.params;
    const foundNote = notes.find((note) => note.id === Number(noteId));
    res.json({ data: foundNote });
};

// export create
function create(req, res, next) {
    const { data: { text } = {} } = req.body;
    const newNote = {
        id: notes.length + 1, // Assign the next ID
        text,
    };
    notes.push(newNote);
    res.status(201).json({ data: newNote });
}

// 1. ability to update a note
function update(req, res) {
    const { noteId } = req.params;
    const foundNote = notes.find((note) => note.id === Number(noteId));
    const { data: { text } = {} } = req.body;

    // update the note
    foundNote.text = text;

    res.json({ data: foundNote });
}

// 2. ability to delete a note
function destroy(req, res) {
    const { noteId } = req.params;
    const index = notes.findIndex((note) => note.id === Number(noteId));
    // 'splice()' returns an array of the deleted elements, even if it is one element
    const deletedNotes = notes.splice(index, 1);
    res.sendStatus(204);
}

module.exports = {
    list,
    create: [hasText, create],
    read: [noteExists, read],
    update: [hasText, noteExists, update],
    delete: [noteExists, destroy],
};
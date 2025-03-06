const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { readData, writeData } = require("./file");

const app = express();
const PORT = 3000;

app.use(express.json());

// Add a new document
app.post("/documents", (req, res) => {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required" });

    const data = readData();
    const id = uuidv4();
    data.documents[id] = content;
    writeData(data);

    res.json({ id, content });
});

// Retrieve a document by ID
app.get("/documents/:id", (req, res) => {
    const ID = req.params.id;
    const data = readData();
    const content = data.documents[req.params.id];

    content ? res.json({ id: ID, content }) : res.status(404).json({ error: "Document not found" });
});

// Submit a search query
app.post("/searches", (req, res) => {
    const { documentId, term } = req.body;
    const data = readData();

    if (!data.documents[documentId]) return res.status(404).json({ error: "Document not found" });

    const searchId = uuidv4();
    data.searches[searchId] = { documentId, term };
    writeData(data);

    res.json({ id: searchId, documentId, term });
});

// Retrieve search results
app.get("/searches/:id/solve", (req, res) => {
    const data = readData();
    const search = data.searches[req.params.id];

    if (!search) return res.status(404).json({ error: "Search query not found" });

    const { documentId, term } = search;
    const content = data.documents[documentId] || "";

    let positions = [];
    let index = content.indexOf(term);

    while (index !== -1) {
        positions.push(index);
        index = content.indexOf(term, index + 1);
    }

    res.json({ term, positions });
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

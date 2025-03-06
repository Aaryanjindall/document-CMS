const fs = require("fs");

const DATA_FILE = "data.json";

// Read data from JSON file
function readData() {
    if (!fs.existsSync(DATA_FILE)) return { documents: {}, searches: {} };
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

// Write data to JSON file
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

module.exports = { readData, writeData };

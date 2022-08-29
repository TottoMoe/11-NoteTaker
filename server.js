const express = require('express');
const path = require('path');

const apiRoutes = require("./routes/apiRoutes")
const homeRoutes = require("./routes/homeRoutes")


const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use("/api/notes", apiRoutes);
app.use("/", homeRoutes);


app.listen(PORT, () => {
  console.log(`App listening on port  http://localhost:${PORT}`);
})
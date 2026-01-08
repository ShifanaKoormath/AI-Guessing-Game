const express = require("express");
const cors = require("cors");
const gameRoutes = require("./routes/gameRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/game", gameRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

require("dotenv").config()
const app = require("./app.js")
const connectToDB = require("./config/database.js")

connectToDB()

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
})
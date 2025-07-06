const express = require("express")
const { authRouter } = require("./routes/authRoutes")
const { connection } = require("./database/db")
const cors = require("cors")

const app = express() // get (READ),post (CREATE),put(Update),delete(Delete),listen (Port)
app.use(cors())
connection();

app.use(express.json())
app.use("/api/auth", authRouter)

app.listen(3000, ()=> {
    console.log("Port is running on 3000")
})

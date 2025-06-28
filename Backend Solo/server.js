const express = require("express")
const { authRouter } = require("./routes/authRoutes")
const { connection } = require("./database/db")

const app = express() // get (READ),post (CREATE),put(Update),delete(Delete),listen (Port)

connection();

app.use(express.json())
app.use("/auth", authRouter)

app.listen(3000, ()=> {
    console.log("Port is running on 3000")
})

const express = require("express")

const app = express() // get (READ),post (CREATE),put(Update),delete(Delete),listen (Port)
app.get("/", (request,response)=>{
    // data 
    //request.body (private)
    //request.header (public)
})
app.listen(3000, ()=> {
    console.log("Port is running on 3000")
})

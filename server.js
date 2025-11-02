const express = require("express")
const cors = require("cors")
require('dotenv').config()

const backendPort = process.env.BACKEND_PORT;


const app = express()

app.get("/health" , (req , res) => {
    res.status(200).send("everything working fine!")
})


app.listen(backendPort , (err) => {
    if (err) console.log("error :-" , err)
    console.log(`server running on the port ${backendPort}`)
})
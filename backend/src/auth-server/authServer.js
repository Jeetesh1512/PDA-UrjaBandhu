const express = require("express");
const app = express();
const cors = require("cors");
const authRoute = require("./routes/auth");

app.get("/", (req, res) => {
    res.json("Hello")
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use("/api/user", authRoute);

app.listen(8081, () => {
    console.log("Server listening on port http://localhost:8081");
})
const express = require("express");
const app = express();
const cors = require("cors");
const householdRoute = require("./routes/household");
const localityRoute = require("./routes/locality");

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use("/api/locality",localityRoute);
app.use("/api/household",householdRoute);

app.listen(8080, () => {
    console.log("Server running on http://localhost:8080")
})

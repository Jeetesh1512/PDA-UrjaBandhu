const express = require("express");
const app = express();
const cors = require("cors");
const householdRoute = require("./routes/household");
const localityRoute = require("./routes/locality");
const otpRoute = require("./routes/otpverification");
const incidentRoute = require("./routes/incident");
const uploadRoute = require("./routes/upload");

//middlewares
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use("/api/locality", localityRoute);
app.use("/api/household", householdRoute);
app.use("/api/otp", otpRoute);
app.use("/api/photos",uploadRoute)
app.use("/api/incident",incidentRoute);

app.listen(8080, () => {
    console.log("Server running on http://localhost:8080")
})

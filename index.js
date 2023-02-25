const express= require("express");
const app = express();
const fileupload = require('express-fileupload');
const cors = require("cors")

// //for parsing data-> body-parser is better than express.json()
// const bodyparser= require("body-parser");
require('dotenv').config();

//mongodb connection
const connectDB = require("./config/connection");
connectDB();
const allowedOrigins = ["http://localhost:3001", "http://localhost:3000","https://teacher-admin-student.vercel.app/"]
app.use(cors(
    {
        origin: allowedOrigins,
    }
))
//json to parse data
app.use(express.json());

// //for parsing data-> body-parser is better than express.json()
// app.use(bodyparser());

app.get("/", (req, res) => {
    res.send("Hello World");
});

//Allow static files
app.use(express.static(__dirname + "/uploads"));


// Enable file upload using express-fileupload
app.use(fileupload({createParentPath: true }));

//routes
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/admin/auth"));
app.use("/api", require("./routes/teacher/teacher"));
app.use("/api", require("./routes/student_list"));
app.use("/api/image_upload", require("./routes/file_upload"));
app.use("/api", require("./routes/logout"))

// app.use("/api", require("./routes/category"));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
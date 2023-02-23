const express= require('express');
const router = express.Router();
const image_upload = require('./../models/file_upload');
const {getauthuser} = require("./../config/authorize");
require("dotenv").config();
const path = require('path');
const fs = require('fs');


router.post('/upload',getauthuser, async(req, res) => {
    try {
      const user = req.user;
      const user_id= user._id;
      console.log(req.files == null);
        if (req.files == null) {
            res.send({
                status: false,
                message: 'No file uploaded'    
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.avatar;
          
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv('./uploads/' + avatar.name);

            //send response
            // res.send({
            //   avatar: req.protocol+"://"+req.get("host")+"/"+avatar.name,
            //     status: true,
            //     message: 'File is uploaded',
            // });
            
            //save to database
            const image = new image_upload({
                name: req.body.name,
                user: user_id,
                avatar: req.protocol+"://"+req.get("host")+"/"+avatar.name,
            });
            await image.save();
            res.send({
                status: true,
                message: 'File is uploaded',
            });


   
        }
    } catch (err) {
        res
            .status(500)
            .send(err);
    }
});

//get all files where status is pending
router.get('/getall',getauthuser, async(req, res) => {
    try {
        const user = req.user;
        const user_id= user._id;  
        const image = await image_upload.find({user: user_id, status: 'pending'});
        res.send(image);
    } catch (err) {
        res
            .status(500)
            .send(err);
    }
});

//get all files where status is reviewed
router.get('/getallreviewed',getauthuser, async(req, res) => {
    try { 
        const user = req.user;
        const user_id= user._id;
        const image = await image_upload.find({user: user_id, status: 'reviewed'});
        res.send(image);
    } catch (err) {
        res
            .status(500)
            .send(err);
    }
});

//update status of file 
router.put('/updatestatus/:id',getauthuser, async(req, res) => {
    try {
        const user = req.user;
        const user_id= user._id;
        const image = await image_upload.findOneAndUpdate({_id: req.params.id, user: user_id}, {status: req.body.status});
        res.send(image);
    } catch (err) {
        res
            .status(500)
            .send(err);
    }
});





//Static file
router.use("/", express.static("files"));
 
//Get File directly
router.get("/dir", (req, res) => {
    res.json({ files_Path: "http://localhost" + "/" });
  });

  //Get All files
router.get("/uploaded_files", (req, res) => {
    try {
      const directoryPath = path.join(__dirname, "../uploads");
  
      fs.readdir(directoryPath, function (err, files) {
        res.send(
          files.map((file) => {
            return {
              id: Buffer.from(file).toString("base64"),
              name: file,
              path: "https://news.dauqu.com" + "/" + file,
              size: fs.statSync(path.join(directoryPath, file)).size,
              file_extension: path.extname(file),
              date: fs.statSync(path.join(directoryPath, file)).mtime,
            };
          })
        );
      });
    } catch (error) {
      res.status(500).json({ message: error.message, status: "error" });
    }
  });


//Delete files
router.post("/delete", delete_file, (req, res) => {
  try {
    const name = req.body.name;
    const directoryPath = path.join(__dirname, "../uploads");
    fs.unlink(`${directoryPath}/${name}`, (error) => {
      if (error) {
        res.status(500).json({ message: error.message, status: "error" });
      }
    });
    res.send({
      status: "success",
      message: "File successfully deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

//Middleware for upload files
async function upload_file(req, res, next) {
    try {
      const decoded = JWT.verify(req.cookies.token, process.env.JWT_SECRET);
      const user = await User_Model.findById(decoded.id);
      //Check if user is logged in
      if (req.cookies.token === undefined) {
        return res.status(401).json({
          message: "You are not logged in",
          status: "warning",
        });
      }
  
      //CHeck if user is admin
      if (user.role !== "admin") {
        return res.status(401).json({
          message: "You are not authorized to upload files",
          status: "warning",
        });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: error.message, status: "error" });
    }
  }
  
  //Middleware for delete files
  async function delete_file(req, res, next) {
    //Check user have token or not
    const token = req.cookies.auth_token || req.body.token || req.headers["x-auth-token"];
  
    try {
      //Check if user is logged in
      if (token === undefined || token === null || token === "") {
        return res.status(401).json({
          message: "You are not logged in",
          status: "warning",
        });
      }
  
      //Check if user is admin
      const decoded = JWT.verify(token, process.env.JWT_SECRET);
      //Get id from token
      const id = decoded.id;
      //Get user role by id
      const user = await User_Model.findById(id);
      if (user.role !== "admin") {
        return res.status(401).json({
          message: "You are not authorized to delete files",
          status: "warning",
        });
      }
  
      //Check if file exists
      const name = req.body.name;
      const directoryPath = path.join(__dirname, "../files");
  
      if (!fs.existsSync(`${directoryPath}/${name}`)) {
        res.status(404).json({ message: "File not found", status: "error" });
      }
  
      next();
    } catch (error) {
      res.status(500).json({ message: error.message, status: "error" });
    }
  }
          



module.exports = router;    
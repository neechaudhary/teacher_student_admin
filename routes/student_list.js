const express = require("express");
const router = express.Router();
const userSchema = require("../models/user");
const jwt = require("jsonwebtoken");
const paperSchema = require("../models/scholar_paper");
const { getauthuser } = require("../config/authorize");

//get students when role=student
router.get("/student-list", (req, res) => {
    userSchema.find({ role: "user" })
        .exec((error, students) => {
            if (error) return res.status(400).json({ error });
            if (students) {
                res.status(200).json({ students });
            }
        });
});

//get papers when role=teacher
router.get("/paper_list", async (req, res) => {
    try {
        const papers = await paperSchema.find({ role: "teacher" })
            .populate("teacher", "_id firstName lastName")
            .populate("student", "_id firstName lastName");
        res.json(papers);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }

});

//get by status and teacher
router.get("/paper_list/:status", getauthuser, async (req, res) => {
    try {
        const status = req.params.status;
        const teacher = req.user;
        const papers = await paperSchema.find({ status: status, teacher: teacher._id });
        res.json(papers);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;

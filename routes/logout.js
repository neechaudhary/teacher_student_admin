const express= require("express")
const router= express.Router();

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logout Success!", status: "success" });
  });
  module.exports= router;
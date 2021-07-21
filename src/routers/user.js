const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const sharp = require("sharp");
// const bcrpyt = require("bcryptjs");
const auth = require("../middlewares/auth");
const {sendWelcomeMail, sendGoodbyeMail} = require("../emails/account")

// configure multer for upload
const multer = require("multer");
const upload = multer({
  limits: {
    filesize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  },
});

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeMail(user.email, user.name)
    const token = await user.genAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.genAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

// logout a user from all devices
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

// get a particular user profile
router.get("/users/me", auth, (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  isValidUpdate = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidUpdate) {
    return res.status(400).send("invalid update");
  }
  try {
    const user = req.user;
    updates.forEach((update) => {
      user[update] = req.body[update];
    });
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendGoodbyeMail(req.user.email, req.user.name)
    res.send(req.user);
  } catch (error) {
    res.status(500).send("Server error, try later");
  }
});

// upload avatar
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// delete avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send()
})
// user avatar url 
router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user || !user.avatar) {
      throw new Error()
    }
    res.set({"Content-Type":"image/png"})
    res.send(user.avatar)
  } catch (error) {
    res.status(404).send()
  }
})

module.exports = router;

import express from "express";
const router = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

// generate token
const secret = process.env.SECRET_KEY;

function generateToken(payload: any): string {
  if (!secret) {
    throw new Error("The secret key is not defined.");
  }

  return jwt.sign(payload, secret, { expiresIn: "1h" });
}

router.get("/", async (req, res) => {
  const users = await User.find();
  if (!users) {
    res.status(500).json({ success: false });
  }
  res.json({ data: users });
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");

  if (!user) {
    res
      .status(500)
      .json({ message: "The user with the given ID was not found." });
  }
  res.status(200).send(user);
});

router.post("/register", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
    phone: req.body.phone,
    isVendor: req.body.isVendor,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();

  if (!user) return res.status(400).send("the user cannot be created!");

  res.send(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("The user not found");
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    // Generate token
    const token = generateToken({ userId: user.id, isVendor: user.isVendor });

    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send("password is wrong!");
  }
}); 

router.delete('/:id', (req, res)=>{
  User.findByIdAndRemove(req.params.id).then(user =>{
      if(user) {
          return res.status(200).json({success: true, message: 'the user is deleted!'})
      } else {
          return res.status(404).json({success: false , message: "user not found!"})
      }
  }).catch(err=>{
     return res.status(500).json({success: false, error: err}) 
  })
})

router.get(`/get/count`, async (req, res) =>{
  let userCount;
  try {
      userCount = await User.countDocuments();
  } catch (err : any) {
      return res.status(500).json({success: false, error: err.message});
  }

  res.send({
      userCount: userCount
})
})

export default router;

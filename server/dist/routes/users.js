"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const validator_1 = __importDefault(require("../validator"));
// generate token
const secret = process.env.SECRET_KEY;
function generateToken(payload) {
    if (!secret) {
        throw new Error("The secret key is not defined.");
    }
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: "1d" });
}
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.User.find();
    if (!users) {
        res.status(500).json({ success: false });
    }
    res.json({ data: users });
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.User.findById(req.params.id).select("-passwordHash");
    if (!user) {
        res
            .status(500)
            .json({ message: "The user with the given ID was not found." });
    }
    res.status(200).send(user);
}));
router.post("/register", validator_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = new user_1.User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcryptjs_1.default.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    });
    user = yield user.save();
    if (!user)
        return res.status(400).send("the user cannot be created!");
    res.send(user);
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send("The user not found");
    }
    if (user && bcryptjs_1.default.compareSync(req.body.password, user.passwordHash)) {
        // Generate token
        const token = generateToken({ userId: user.id, isAdmin: user.isAdmin });
        res.cookie('t', token);
        const { _id, name, email, isAdmin } = user;
        res.status(200).send({ user: { email, name, isAdmin }, token: token });
    }
    else {
        res.status(400).send("password is wrong!");
    }
}));
router.get("/signout", (req, res) => {
    res.clearCookie('t');
    res.json({ message: 'Signout success' });
});
router.delete('/:id', (req, res) => {
    user_1.User.findByIdAndRemove(req.params.id).then(user => {
        if (user) {
            return res.status(200).json({ success: true, message: 'the user is deleted!' });
        }
        else {
            return res.status(404).json({ success: false, message: "user not found!" });
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err });
    });
});
router.get(`/get/count`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userCount;
    try {
        userCount = yield user_1.User.countDocuments();
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
    res.send({
        userCount: userCount
    });
}));
exports.default = router;

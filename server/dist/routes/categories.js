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
const category_1 = require("../models/category");
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_1.Category.find();
    if (!categories) {
        res.status(500).json({ success: false });
    }
    res.json({ data: categories });
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_1.Category.findById(req.params.id);
    if (!category) {
        res.status(500).json({ message: 'The category with the given ID was not found.' });
    }
    res.status(200).send(category);
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let category = new category_1.Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    });
    category = yield category.save();
    if (!category)
        return res.status(400).send('the category cannot be created!');
    res.send(category);
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_1.Category.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
    }, { new: true } // return the updated category
    );
    if (!category)
        return res.status(400).send('the category cannot be updated!');
    res.send(category);
}));
router.delete('/:id', (req, res) => {
    category_1.Category.findByIdAndRemove(req.params.id).then(category => {
        if (category) {
            return res.status(200).json({ success: true, message: 'the category is deleted!' });
        }
        else {
            return res.status(404).json({ success: false, message: "category not found!" });
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err });
    });
});
exports.default = router;

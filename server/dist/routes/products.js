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
const product_1 = require("../models/product");
const category_1 = require("../models/category");
const mongoose_1 = __importDefault(require("mongoose"));
const multer_1 = __importDefault(require("multer"));
const FILE_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
};
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError;
        if (!isValid) {
            uploadError = new Error("invalid image type");
        }
        else {
            uploadError = null;
        }
        cb(uploadError, "public/uploads");
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(" ").join("-");
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});
const uploadOptions = (0, multer_1.default)({ storage: storage });
router.get(`/`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // localhost:3000/api/v1/products?categories=2342342,234234
    let filter = {};
    if (req.query.categories && typeof req.query.categories === "string") {
        filter = { category: req.query.categories.split(",") };
    }
    const productList = yield product_1.Product.find(filter).populate("category");
    if (!productList) {
        res.status(500).json({ success: false });
    }
    res.send(productList);
}));
router.get(`/:id`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_1.Product.findById(req.params.id).populate("category");
    if (!product) {
        res.status(500).json({ success: false });
    }
    res.send(product);
}));
router.post(`/`, uploadOptions.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_1.Category.findById(req.body.category);
    if (!category)
        return res.status(400).send("Invalid Category");
    const file = req.file;
    if (!file)
        return res.status(400).send("No image in the request");
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    let product = new product_1.Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: `${basePath}${fileName}`,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    });
    product = yield product.save();
    if (!product)
        return res.status(500).send("The product cannot be created");
    res.send(product);
}));
router.put("/:id", uploadOptions.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.isValidObjectId(req.params.id)) {
        return res.status(400).send("Invalid Product Id");
    }
    const category = yield category_1.Category.findById(req.body.category);
    if (!category)
        return res.status(400).send("Invalid Category");
    const product = yield product_1.Product.findById(req.params.id);
    if (!product)
        return res.status(400).send('Invalid Product!');
    const file = req.file;
    let imagepath;
    if (file) {
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    }
    else {
        imagepath = product.image;
    }
    const updatedProduct = yield product_1.Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: imagepath,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    }, { new: true });
    if (!updatedProduct)
        return res.status(500).send("the product cannot be updated!");
    res.send(updatedProduct);
}));
router.delete("/:id", (req, res) => {
    product_1.Product.findByIdAndRemove(req.params.id)
        .then((product) => {
        if (product) {
            return res
                .status(200)
                .json({ success: true, message: "the product is deleted!" });
        }
        else {
            return res
                .status(404)
                .json({ success: false, message: "product not found!" });
        }
    })
        .catch((err) => {
        return res.status(500).json({ success: false, error: err });
    });
});
router.get(`/get/count`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let productCount;
    try {
        productCount = yield product_1.Product.countDocuments();
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
    res.send({
        productCount: productCount,
    });
}));
router.get(`/get/featured/:count`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const count = req.params.count ? req.params.count : 0;
    const products = yield product_1.Product.find({ isFeatured: true }).limit(+count);
    if (!products) {
        res.status(500).json({ success: false });
    }
    res.send(products);
}));
router.put('/gallery-images/:id', uploadOptions.array('images', 10), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id');
    }
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    if (Array.isArray(files)) {
        files.map((file) => {
            imagesPaths.push(`${basePath}${file.filename}`);
        });
    }
    const product = yield product_1.Product.findByIdAndUpdate(req.params.id, {
        images: imagesPaths,
    }, { new: true });
    if (!product)
        return res.status(500).send('the gallery cannot be updated!');
    res.send(product);
}));
exports.default = router;

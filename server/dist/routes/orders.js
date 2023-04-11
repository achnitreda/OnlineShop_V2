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
const order_1 = require("../models/order");
const orderItem_1 = require("../models/orderItem");
const product_1 = require("../models/product");
router.get(`/`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderList = yield order_1.Order.find()
        .populate("user", "name")
        .sort({ dateOrdered: -1 });
    if (!orderList) {
        res.status(500).json({ success: false });
    }
    res.send(orderList);
}));
router.get(`/:id`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_1.Order.findById(req.params.id)
        .populate("user", "name")
        .populate({
        path: "orderItems",
        populate: {
            path: "product",
            populate: "category",
        },
    });
    if (!order) {
        res.status(500).json({ success: false });
    }
    res.send(order);
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderItemsIds = Promise.all(req.body.orderItems.map((orderItem) => __awaiter(void 0, void 0, void 0, function* () {
        let newOrderItem = new orderItem_1.OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product,
        });
        newOrderItem = yield newOrderItem.save();
        return newOrderItem._id;
    })));
    const orderItemsIdsResolved = yield orderItemsIds;
    const totalPrices = yield Promise.all(orderItemsIdsResolved.map((orderItemId) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const orderItem = yield orderItem_1.OrderItem.findById(orderItemId).populate({
            path: "product",
            select: "price",
            model: product_1.Product,
        });
        const totalPrice = ((_a = orderItem.product) === null || _a === void 0 ? void 0 : _a.price) * orderItem.quantity;
        return totalPrice;
    })));
    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
    let order = new order_1.Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    });
    order = yield order.save();
    if (!order)
        return res.status(400).send("the order cannot be created!");
    res.send(order);
}));
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_1.Order.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
    }, { new: true });
    if (!order)
        return res.status(400).send("the order cannot be update!");
    res.send(order);
}));
router.delete("/:id", (req, res) => {
    order_1.Order.findByIdAndRemove(req.params.id)
        .then((order) => __awaiter(void 0, void 0, void 0, function* () {
        if (order) {
            yield order.orderItems.map((orderItem) => __awaiter(void 0, void 0, void 0, function* () {
                yield orderItem_1.OrderItem.findByIdAndRemove(orderItem);
            }));
            return res
                .status(200)
                .json({ success: true, message: "the order is deleted!" });
        }
        else {
            return res
                .status(404)
                .json({ success: false, message: "order not found!" });
        }
    }))
        .catch((err) => {
        return res.status(500).json({ success: false, error: err });
    });
});
router.get("/get/totalsales", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const totalSales = yield order_1.Order.aggregate([
        { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
    ]);
    if (!totalSales) {
        return res.status(400).send("The order sales cannot be generated");
    }
    res.send({ totalsales: totalSales.pop().totalsales });
}));
router.get(`/get/count`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let orderCount;
    try {
        orderCount = yield order_1.Order.countDocuments();
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
    res.send({
        orderCount: orderCount,
    });
}));
router.get(`/get/userorders/:userid`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userOrderList = yield order_1.Order.find({ user: req.params.userid })
        .populate({
        path: "orderItems",
        populate: {
            path: "product",
            populate: "category",
        },
    })
        .sort({ dateOrdered: -1 });
    if (!userOrderList) {
        res.status(500).json({ success: false });
    }
    res.send(userOrderList);
}));
exports.default = router;

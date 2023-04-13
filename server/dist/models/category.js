"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
});
categorySchema.virtual("id").get(function () {
    return this._id.toHexString();
});
categorySchema.set("toJSON", {
    virtuals: true,
});
exports.Category = mongoose_1.default.model("Category", categorySchema);

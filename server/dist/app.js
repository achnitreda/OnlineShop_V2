"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const jwt_1 = require("./helpers/jwt");
const errorHandler_1 = require("./helpers/errorHandler");
const path_1 = __importDefault(require("path"));
const express_validator_1 = __importDefault(require("express-validator"));
const port = process.env.PORT || 8000;
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.dqn8fht.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const api = process.env.API_URL;
// middlewares
app.use((0, express_validator_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("tiny"));
app.use((0, jwt_1.authJwt)());
app.use('/public/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'public', 'uploads')));
app.use(errorHandler_1.errorHandler);
// Routes
const products_1 = __importDefault(require("./routes/products"));
const orders_1 = __importDefault(require("./routes/orders"));
const users_1 = __importDefault(require("./routes/users"));
const categories_1 = __importDefault(require("./routes/categories"));
app.use(`${api}/products`, products_1.default);
app.use(`${api}/orders`, orders_1.default);
app.use(`${api}/users`, users_1.default);
app.use(`${api}/categories`, categories_1.default);
// Database connection
mongoose_1.default.set('strictQuery', false);
mongoose_1.default
    .connect(uri)
    .then(() => {
    console.log("[MongoDB]: Connected");
})
    .catch((err) => {
    console.log(err);
});
// Server
app.listen(port, () => {
    console.log(`[Server]: I am running at http://localhost:${port}`);
    console.log(path_1.default.join(__dirname, '..', 'public', 'uploads'));
});

import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  color: { // example we need it in frontend #000000
    type: String,
  },
});

export const Category = mongoose.model("Category", categorySchema);

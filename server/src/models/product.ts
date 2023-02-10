import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    images: [{
        type: String
    }],
    brand: {
        type: String,
        default: ''
    },
    price : {
        type: Number,
        default:0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:true
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    }
});

/* This is a virtual property that is not stored in the database. It is used to get the id of the
product in the hexadecimal format. */
productSchema.virtual('id').get(function () {
    return this._id.toHexString(); // .toHexString() is a method of the ObjectId type.
});

/* Telling mongoose to include virtual properties when converting the object to JSON. */
productSchema.set('toJSON', {
    virtuals: true,
});


export const Product = mongoose.model('Product', productSchema);

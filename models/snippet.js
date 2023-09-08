const mongoose = require("mongoose")
const Schema = mongoose.Schema

const postSchema = new Schema({
    title: {
      type: String,
      required: [true, 'Votre titre est requis !']
    },
    url: {
      type: String,
      required: false,
      unique: true
    },
    content: {
      type: String,
      required: false
    },
    tags: {
      type: [String],
      default: []
    }
},
{ timestamps: true }
);



module.exports = mongoose.model('products', postSchema);

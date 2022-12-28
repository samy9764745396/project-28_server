const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addBlogsSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: String,
  userid: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" }  // user - that one user that we have generated using email by this user we r fetching the record
},{timestamps:true})                                                            //Users - collection 
const addBlogModel = mongoose.model("Blogs", addBlogsSchema);
module.exports = addBlogModel;
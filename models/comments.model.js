const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    userName: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    date: {
      type: Date,
    },
    comment: {
      type: String,
    },
    // task id pending 
  },
  {
    timestamps: true,
  }
);

const CommentModel = mongoose.model("auto_comment", CommentSchema);

module.exports = CommentModel;

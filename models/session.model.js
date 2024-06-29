const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SessionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user"
        },
        session: {
            type: String
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const SessionModel = mongoose.model("session", SessionSchema);

module.exports = SessionModel;
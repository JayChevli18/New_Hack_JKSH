const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SMSresponseSchema = new Schema(
    {
        smsresponse: {
            type: Object
        },
        messageUUID: {
            type: String
        },
        messageTopic: {
            type: String
        },
        messageStatus: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);

const SMSResponseModel = mongoose.model("auto_SMSresponse", SMSresponseSchema);

module.exports = SMSResponseModel;

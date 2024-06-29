const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require("../utils/constants");

const TasksSchema = new Schema(
    {
        taskName: {
            type: String
        },
        taskDesc: {
            type: String
        },
        status: {
            type: String,
            enum: constants.taskStatus.status
        },
        startDate: {
            type: Date
        },
        dueDate: {
            type: Date
        },
        attachments: {
            type: Object
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "project"
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const TaskModel = mongoose.model("task", TasksSchema);

module.exports = TaskModel;
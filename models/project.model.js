const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema(
    {
        projectName: {
            type: String
        },
        projectDesc: {
            type: String
        },
        creatorId: {
            type: Schema.Types.ObjectId,
            ref: "user"
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const ProjectModel = mongoose.model("project", ProjectSchema);

module.exports = ProjectModel;
const ProjectModel = require("../models/project.model");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");
const environment = require("../utils/environment");
const dayjs = require("dayjs");
const UserModel = require("../models/user.model");

exports.createProject = async (req, res) => {
  try {
    const { _id } = req.user;
    const { projectName, projectDesc } = req.body;

    const project = new ProjectModel({
      projectName,
      projectDesc,
      creatorId: _id,
    });
    const savedProject = await project.save();
    console.log(savedProject, "abc");
    const updatedUser = await UserModel.findByIdAndUpdate(
      _id,
      { projectId: savedProject?._id },
      { new: true }
    ).lean();
    sendSuccessResponse(res, {
      data: { Projects: savedProject, Users: updatedUser },
    });
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

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
      data: { Projects: savedProject, Users: updatedUser }
    }, 201);
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

exports.getUserProjects = async (req, res) => {
  try {
    const { _id } = req.user;

    const project = await ProjectModel.find({
      creatorId: _id,
    });

    sendSuccessResponse(res, {
      data: project,
    });
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

exports.getAllCreatorsProjects = async (req, res) => {
  try {
    const allProjects = await ProjectModel.find();
    sendSuccessResponse(res, {
      data: allProjects,
    });
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { _id } = req.user;
    const { projectId } = req.params;
    const { projectName, projectDesc } = req.body;

    const allProjects = await ProjectModel.findByIdAndUpdate(projectId, {
      projectName: projectName,
      projectDesc: projectDesc,
    }).lean();

    sendSuccessResponse(res, {
      data: allProjects,
    });
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { _id } = req.user;
    const { projectId } = req.params;

    const deletedProject = await ProjectModel.findOneAndDelete(
      {
        _id: projectId,
        creatorId: _id,
      },
      {
        new: true,
      }
    );

    console.log(deletedProject, "deleted");
    sendSuccessResponse(res, {
      message: "Project Deleted successfully!"
    });
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

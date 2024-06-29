const TaskModel = require("../models/tasks.model");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");
const environment = require("../utils/environment");
const dayjs = require("dayjs");
const UserModel = require("../models/user.model");

exports.createTasks = async (req, res) => {
  try {
    const { _id } = req.user;
    const { projectId } = req.params;
    const { taskName, taskDesc, status, startDate, dueDate } = req.body;

    const [task] = req.files.task;
    const pathE = task?.path;
    const npathE = pathE.replaceAll("\\", "/");
    policy.path = npathE.replace("public/", "");

    if (!req.files) {
      return sendErrorResponse(res, "File is missing", 400);
    }

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
    sendSuccessResponse(
      res,
      {
        data: { Projects: savedProject, Users: updatedUser },
      },
      201
    );
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

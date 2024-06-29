const TaskModel = require("../models/tasks.model");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");
const environment = require("../utils/environment");
const dayjs = require("dayjs");
const UserModel = require("../models/user.model");
const ProjectModel = require("../models/project.model");

exports.createTasks = async (req, res) => {
  try {
    const { _id } = req.user;
    const { projectId } = req.params;
    const { taskName, taskDesc, status, startDate, dueDate } = req.body;

    if (!req.files) {
      return sendErrorResponse(res, "File is missing", 400);
    }

    const [task] = req.files.task;
    const pathE = task?.path;
    const npathE = pathE.replaceAll("\\", "/");
    task.path = npathE.replace("public/", "");

    const project = await TaskModel.find({ projectId: projectId });

    const tasks = new TaskModel({
      taskName,
      taskDesc,
      status,
      startDate: startDate || new Date(),
      dueDate: dueDate || new Date(),
      projectId: projectId,
      attachments: task,
    });
    const savedTask = await tasks.save();
    console.log(savedTask, "All tasks");

    await ProjectModel.findByIdAndUpdate(
      projectId,
      {
        $push: {
          taskId: savedTask._id,
        },
      },
      {
        new: true,
      }
    );
    sendSuccessResponse(
      res,
      {
        data: savedTask,
      },
      201
    );
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const { _id } = req.user;
    const { projectId } = req.params;
    const allTasks = await TaskModel.find({
      projectId: projectId,
    });

    sendSuccessResponse(res, {
      data: allTasks,
    });
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

exports.getParticularTask = async (req, res) => {
  try {
    const { _id } = req.user;
    const { taskId } = req.params;
    const task = await TaskModel.findById(taskId);

    sendSuccessResponse(res, {
      data: task,
    });
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

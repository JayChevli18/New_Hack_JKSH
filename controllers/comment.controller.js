const dayjs = require("dayjs");
const {
  getPagination,
  getPaginationData,
  getCountA,
  sleep,
  getCount,
} = require("../utils/fn");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");
const commentModel = require("../models/comments.model");
const UserModel = require("../models/user.model");
const TaskModel = require("../models/tasks.model");

exports.getComments = async (req, res) => {
  try {
    const { _id } = req.user;
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const count = await getCount(commentModel, { userId: _id });
    const comments = await commentModel
      .find({ userId: _id })
      .skip(offset)
      .limit(limit);
    sendSuccessResponse(
      res,
      getPaginationData({ count, docs: comments }, page, limit)
    );
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

exports.createComment = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { taskId } = req.params;
    const { comment } = req.body;
    const user = await UserModel.findById(userId);
    const task = await TaskModel.findById(taskId);

    const projectId = task?.projectId;
    const dt = new Date();
    const newComment = new commentModel({
      userId: userId,
      userName: user?.fullName,
      date: dt,
      taskId: taskId,
      projectId: projectId,
      comment,
    });
    const saveComment = await newComment.save();

    sendSuccessResponse(res, { data: saveComment });
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

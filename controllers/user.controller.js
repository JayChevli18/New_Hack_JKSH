const UserModel = require("../models/user.model");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");
const environment = require("../utils/environment");
const dayjs = require("dayjs");
const SessionModel = require("../models/session.model");

exports.me = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const user = await UserModel.findById(userId).lean();
    sendSuccessResponse(res, { data: user });
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", { domain: `.${environment.domain}` });
    sendSuccessResponse(res, "User Logged out successfully!");
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { password, newPassword } = req.body;
    const user = await UserModel.findById(userId).select("+password");
    if (!user) {
      return sendErrorResponse(res, "We are not aware of this user.");
    }
    if (user) {
      user.comparePassword(password, async (err, isMatch) => {
        if (err) {
          return sendErrorResponse(res, "Invalid password");
        }
        if (isMatch) {
          user.password = newPassword;
          await user.save();
          await SessionModel.deleteMany({ userId: userId });
          sendSuccessResponse(res, { data: user });
        } else {
          sendErrorResponse(res, "Invalid password");
        }
      });
    }
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

exports.personalUsers = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const user = await UserModel.findById(userId).populate({
      path: "subUsersId",
      match: { isDeleted: false },
    });
    sendSuccessResponse(res, { data: user });
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");
const environment = require("../utils/environment");
const { generateRandomString } = require("../utils/fn");
const dayjs = require("dayjs");
const mailwizzApi = require("../services/mailwizz-api-service");

// const { sendHtmlEmail } = require("../helpers/email.helper");
const smsCountryAPI = require("../services/smscountry-api-service");
const SMSResponseModel = require("../models/smsresponse.model");

exports.signup = async (req, res) => {
  try {
    const { email, password, role, fullName, mobileNumber } = req.body;
    const existingUser = await UserModel.findOne({ email: email });
    if (!existingUser) {
      const user = new UserModel({
        fullName,
        email,
        role,
        password,
        mobileNumber,
      });
      const savedUser = await user.save();
      sendSuccessResponse(res, { data: savedUser });
    } else {
      return sendErrorResponse(
        res,
        "Account with that email address already exists.",
        400
      );
    }
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

exports.signupwithotp = async (req, res) => {
  try {
    const { email, mobileNumber } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return sendErrorResponse(
        res,
        "Account with that email address already exists.",
        400
      );
    } else {
      const user = new UserModel({
        email,
        mobileNumber,
      });
      const savedUser = await user.save();
      sendSuccessResponse(res, { data: savedUser });
    }
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

exports.sendOtp = (module) => async (req, res) => {
  try {
    const { email, mobileNumber, fullName } = req.body;
    //   if (email) {
    //     const isEmailBlacklisted = await BlackListModel.findOne({
    //       email: email,
    //     });
    //     if (isEmailBlacklisted) {
    //       sendErrorResponse(
    //         res,
    //         "Sorry, you can not proceed further, please contact us for more info."
    //       );
    //     }
    //   }
    //   if (mobileNumber) {
    //     const isMobileNumberBlacklisted = await BlackListModel.findOne({
    //       mobileNumber: mobileNumber,
    //     });

    //     if (isMobileNumberBlacklisted) {
    //       sendErrorResponse(
    //         res,
    //         "Sorry, you can not proceed further, please contact us for more info."
    //       );
    //     }
    //   }

    const otp = generateRandomString(6, {
      alphabets: false,
      upperCase: false,
    });
    const otpExpiredAt = dayjs().add(10, "minute").toDate();
    const otpRef = generateRandomString(12);
    const condition = (mod) => {
      switch (mod) {
        case "signup":
          return { email, mobileNumber, isParent: true };
        case "login":
          return { email, isParent: true };
        default:
          return {};
      }
    };
    const existUser = await UserModel.findOne(condition("login"));
    if (module === "login") {
      if (!email && !mobileNumber) {
        return sendErrorResponse(
          res,
          "one of the following value is required. email or mobileNumber.",
          400
        );
      }
    } else if (module === "signup") {
      if (!email || !mobileNumber) {
        return sendErrorResponse(
          res,
          "email and mobileNumber are required",
          400
        );
      }

      if (existUser) {
        return sendErrorResponse(res, "User already registered", 403);
      }
    }

    const user = await UserModel.findOneAndUpdate(
      condition(module),
      {
        ...(email ? { email } : {}),
        ...(mobileNumber ? { mobileNumber } : {}),
        ...(fullName ? { fullName } : {}),
        otp,
        otpExpiredAt,
        otpRef,
      },
      {
        upsert: true,
        new: true,
      }
    ).exec();
    let mock = false;
    if (user?.mobileNumber) {
      try {
        // const resp = await sendVerificationCode({
        //   to: `+${user.countryCode}${user.mobileNumber}`,
        // });
        // mock = !!resp?.mock;
        const mobno = `${user?.countryCode}${user?.mobileNumber}`;
        const message = `Your One Time Password (OTP) is ${otp} - ToDo APP`;
        const resp = await smsCountryAPI.sendsms(message, mobno);
        console.log(resp);
        mock = !!resp?.mock;
        const createSMSres = await SMSResponseModel.findOneAndUpdate(
          {
            messageUUID: resp?.data?.MessageUUID,
          },
          {
            smsresponse: resp?.data,
            messageStatus: resp?.data?.Message,
            messageTopic: `Send otp at mobile number ${user?.mobileNumber}`,
          },
          {
            upsert: true,
            new: true,
          }
        );
      } catch (error) {
        console.log("Err: sendVerificationCode", error);
      }

      sendSuccessResponse(res, {
        message: "Otp have been sent to your registered mobile number.",
        data: {
          ref: otpRef,
          countryCode: user?.countryCode,
          ...(mock ? { otp } : {}),
          mobileNumber: `XXXXXX${user?.mobileNumber.slice(-4)}`,
          fullName: fullName,
        },
      });
    } else {
      if (user._id) {
        UserModel.findByIdAndRemove(user._id)
          .exec()
          .then(() => {})
          .catch((err) => {
            console.log("Error in removing user");
          });
      }
      sendErrorResponse(
        res,
        "There is not account with this email, please register.",
        400
      );
    }
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

exports.verifyOtp = (module) => async (req, res) => {
  try {
    const { email, mobileNumber, otp, ref } = req.body;
    //   if (email) {
    //     const isEmailBlacklisted = await BlackListModel.findOne({
    //       email: email,
    //     });
    //     if (isEmailBlacklisted) {
    //       sendErrorResponse(
    //         res,
    //         "Sorry, you can not proceed further, please contact us for more info."
    //       );
    //     }
    //   }
    //   if (mobileNumber) {
    //     const isMobileNumberBlacklisted = await BlackListModel.findOne({
    //       mobileNumber: mobileNumber,
    //     });

    //     if (isMobileNumberBlacklisted) {
    //       sendErrorResponse(
    //         res,
    //         "Sorry, you can not proceed further, please contact us for more info."
    //       );
    //     }
    //   }
    if (module === "login") {
      if (!email && !mobileNumber) {
        return sendErrorResponse(
          res,
          "one of the following value is required. email or mobileNumber.",
          400
        );
      }
    } else if (module === "signup") {
      if (!email || !mobileNumber) {
        return sendErrorResponse(
          res,
          "email and mobileNumber are required",
          400
        );
      }
    }
    const condition = (mod) => {
      switch (mod) {
        case "signup":
          return { email, mobileNumber, isParent: true };
        case "login":
          return { email, isParent: true };

        default:
          return {};
      }
    };
    const user = await UserModel.findOne(condition(module))
      .select("+otp +otpRef +otpExpiredAt +fullName +email")
      .exec();

    if (!user) {
      return sendErrorResponse(res, "Please register your account first", 400);
    }

    if (module === "signup") {
      let userInfo = {
        EMAIL: user?.email,
        FNAME: user?.fullName?.split(" ")[0],
        LNAME: user?.fullName?.split(" ")[1],
      };
      mailwizzApi.createSubscriber(userInfo);
      mossendEmail(user?.email);
    }

    const sendToken = async () => {
      const token = jwt.sign(
        { _id: user._id, role: user.role },
        environment.jwt.secret,
        { expiresIn: environment.jwt.expiredIn }
      );
      // if (!user?.lastLoggedInAt) {
      //   try {
      //     const data = {
      //       serverBaseUrl: environment.server,
      //       customerName: user?.fullName,
      //       customerEmail: user?.email,
      //     };
      //     await sendHtmlEmail(
      //       "views/templates/welcome.ejs",
      //       {
      //         to: user?.email,
      //         subject: `Welcome to the ToDo family!`,
      //       },
      //       data
      //     );
      //   } catch (error) {
      //     console.log("Error sending welcome email", error);
      //   }
      // }
      if (!user.subUsersId.includes(user._id)) {
        user.subUsersId = [...user.subUsersId, user._id];
      }
      user.lastLoggedInAt = dayjs().toDate();
      await user.save();
      res.cookie("token", token, { domain: `.${environment.domain}` });
      return sendSuccessResponse(res, {
        message: "verified successfully",
        token,
        data: user,
      });
    };

    // Verification OTP
    if (environment.nodeEnv !== "production" && `${otp}`.trim() === "123456") {
      const newOtp = generateRandomString(6, {
        alphabets: false,
        upperCase: false,
      });
      user
        .updateOne({
          otp: newOtp,
          otpExpiredAt: dayjs().toDate(),
        })
        .exec();
      sendToken();
    } else {
      if (
        user.otp === `${otp}`.trim() &&
        ref === user.otpRef &&
        dayjs(user.otpExpiredAt).isAfter(dayjs())
      ) {
        const newOtp = generateRandomString(6, {
          alphabets: false,
          upperCase: false,
        });
        user
          .updateOne({
            otp: newOtp,
            otpExpiredAt: dayjs().toDate(),
          })
          .exec();
        sendToken();
      } else {
        return sendErrorResponse(res, "Invalid otp or expired", 401);
      }
    }
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

exports.login = async (req, res) => {
  try {
    res.clearCookie("token", { domain: `.${environment.domain}` });
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email, isParent: true }).select(
      "+password"
    );

    if (!user) {
      return sendErrorResponse(res, "We are not aware of this user.", 403);
    }

    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        return sendErrorResponse(res, "Invalid email or password", 401);
      }
      if (isMatch) {
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          environment.jwt.secret,
          { expiresIn: environment.jwt.expiredIn }
        );

        const { password: hash, ...data } = user.toJSON();
        res.cookie("token", token, { domain: `.${environment.domain}` });
        return sendSuccessResponse(res, {
          message: "Success! You are logged in.",
          token,
          data,
        });
      }
      return sendErrorResponse(res, "Invalid email or password.", 401);
    });
  } catch (error) {
    sendErrorResponse(res, error.message);
  }
};

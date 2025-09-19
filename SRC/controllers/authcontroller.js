import User from "../models/user.models.js";
import Admin from "../models/admin.model.js";
import {
  signUpValidator,
  logInValidator,
} from "../validators/auth.validator.js";
import { formatZodError } from "../utils/errorMessage.js";
import cryptoHash from "crypto";
import dotenv, { configDotenv } from "dotenv";
import nodemailer from "nodemailer";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";

dotenv.config();
//function for password hashing
function hashValue(value) {
  const hash = cryptoHash.createHash("sha256");

  hash.update(value);

  return hash.digest("hex");
}

// hashing the compared passwords
function comparePasswords(inputPassword, hashedPassword) {
  return hashValue(inputPassword) === hashedPassword;
}
function generateOTP() {
  let otp = "";
  for (let i = 0; i < 4; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
}
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendNewMail = async (email, name, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: {
      name: "Egov-access",
      address: process.env.EMAIL_USER,
    },
    to: email,
    subject: "Welcome",
    text: `Welcome to Egov-Access.`,
    html: `
            <h2>Welcome to Egov-Access, ${name}!</h2>
            <p>Thank you for signing up for our platform. We are excited to have you on board.</p>
            <p>You can now explore gorvenment services, give feedback, and more.</p>
            <p>If you have any questions, feel free to reply to this email or contact our support team.</p>
            <p>Best regards,</p>
            <p>The egov-access Team</p>
        `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Email sent: " + info.response, mailOptions);
  //   res.status(200).json({message: 'User registered succesfully',newUser})
};
// validating the user input for sign up
export const signUp = async (req, res, next) => {
  const registerResults = signUpValidator.safeParse(req.body); //safely parsing the validating the request againt the schema defined in our signupvalidator

  if (!registerResults.success) {
    return res.status(400).json(formatZodError(registerResults.error.issues));
  }
  try {
    const { name, phoneNumber, email } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { phoneNumber }, { name }],
    });

    if (user) {
      res.status(400).json({ message: "user already exists" });
    } else {
      const { name, password, confirmPassword, email, phoneNumber, gender } =
        req.body; //request coming from the user/client

      if (password !== confirmPassword) {
        return res
          .status(403)
          .json({ message: "password and confirmPassword do not match" });
      }
      const encryption = hashValue(password, confirmPassword); // encrypting the users password with the hash value function
      const otp = generateOTP();
      const otpExpiry = Date.now() + 10 * 60 * 1000;
      
      const newUser = new User({
        name,
        password: encryption,
        confirmPassword: encryption,
        email,
        phoneNumber,
        gender,
        isVerified: false,
        otp,
        otpExpiry,
      }); // creating the new user

      await newUser.save(); //saving the new user
      res
        .status(200)
        .json({ message: "User registered successfully", newUser });
      console.log("User registered succesfully", newUser);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: {
          name: "Egov-access",
          address: process.env.EMAIL_USER,
        },
        to: email,
        subject: "Egov OTP",
        text: `Your OTP for two-step verification is ${otp}. It will expire in 1 hour.`,
        html: `
                      <h2>Welcome to Egov-access, ${name}!</h2>
                      <p>Your OTP for two-step verification is <strong>${otp}</strong>. It will expire in 10 minutes.</p>
                  `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response, mailOptions);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("INTERNAL SERVER ERROR", error.message);
    console.error("Error sending email:", error);
  }
};

//     } catch (error){
//       res.status(500).json({message: error.message})
//       console.log(error.message);
//     }
// }

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid or expired OTP" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const accessToken = generateTokenAndSetCookie(user._id, res);

    sendNewMail(user.email, user.name);
    res
      .status(200)
      .json({ message: "OTP verified successfully.", accessToken, user });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logIn = async (req, res, next) => {
  const loginResults = logInValidator.safeParse(req.body);

  if (!loginResults.success) {
    return res.status(400).json(formatZodError(loginResults.error.issues));
  }
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json(formatZodError(loginResults.error.issues));
    }
    const comparePass = comparePasswords(password, user.password);

    if (!comparePass) {
      return res.status(400).json({ message: "Password is incorrect" });
    }
    res.status(200).json({ message: "Login Successful", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleUsers = async () => {};

export const logout = async (req, res, next) => {};

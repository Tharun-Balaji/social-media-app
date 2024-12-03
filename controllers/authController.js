import Users from '../models/userModel.js';
import { compareString, createJWT, hashString } from '../utils/index.js';
import { sendVerificationEmail } from '../utils/sendEmail.js';

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  // Validate Fields
  if (!firstName || !lastName || !email || !password) {
    next("Provide Required Fields");
    return;
  }

  try {

    // Check if user exists
    const userExists = await Users.findOne({ email });
    if (userExists) {
      next("User Already Exists");
      return;
    }

    // Hash Password
    const hashedPassword = await hashString(password);

    // Create User
    const user = await Users.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Send email Verification to User
    sendVerificationEmail(user, res);

  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //validation
    if (!email || !password) {
      next("Please Provide User Credentials");
      return;
    }

    // find user by email
    const user = await Users.findOne({ email }).select("+password").populate({
      path: "friends",
      select: "firstName lastName location profileUrl -password",
    });

    // if user not found
    if (!user) {
      next("Invalid email or password");
      return;
    }

    // check if user is verified
    if (!user?.verified) {
      next(
        "User email is not verified. Check your email account and verify your email"
      );
      return;
    }

    // compare password
    const isMatch = await compareString(password, user?.password);

    // if not match
    if (!isMatch) {
      next("Invalid email or password");
      return;
    }

    // remove password
    user.password = undefined;

    // create JWT
    const token = createJWT(user?._id);

    // send response
    res.status(201).json({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

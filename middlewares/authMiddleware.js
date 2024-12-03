import JWT from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  // get token from header
  const authHeader = req?.headers?.authorization;

  // check if token exists
  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    next("Authentication== failed"); // invalid token
  }

  // get token
  const token = authHeader?.split(" ")[1];

  try {
    // verify token
    const userToken = JWT.verify(token, process.env.JWT_SECRET_KEY);

    // attach user to request
    req.body.user = {
      userId: userToken.userId,
    };

    // next
    next();
  } catch (error) {
    console.log(error);
    next("Authentication failed"); // invalid token
  }
};

export default userAuth;
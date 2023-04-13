import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator/check";

const notEmpty = (value: string) => {
  if (!value || value.length === 0) {
    throw new Error("This field cannot be empty");
  }
  return true;
};

const userSignupValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  check("name", "Name is required").custom(notEmpty);
  check("email", "Email must be between 3 to 32 characters")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({
      min: 4,
      max: 32,
    });
  check("password", "Password is required").custom(notEmpty);
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export default userSignupValidator;

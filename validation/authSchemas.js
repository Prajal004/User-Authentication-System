import * as Yup from "yup";

const strongPassword = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export const registerSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .matches(
      strongPassword,
      "Password must be at least 8 characters and include letters and numbers"
    )
    .required("Password is required"),
});

export const loginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});
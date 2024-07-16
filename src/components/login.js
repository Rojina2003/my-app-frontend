import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import style from "../css/login.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // State to manage button disabled state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError(""); // Reset email error
    setPasswordError(""); // Reset password error
    setIsSubmitting(true); // Disable the button

    let hasError = false;

    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (hasError) {
      setIsSubmitting(false); // Enable the button if there's an error
      return;
    }

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg = err.response?.data?.msg || "Invalid username or password";

      if (errorMsg.includes("email")) {
        setEmailError(errorMsg);
      } else if (errorMsg.includes("password")) {
        setPasswordError(errorMsg);
      } else {
        setEmailError(errorMsg);
        setPasswordError(errorMsg);
      }
      setIsSubmitting(false); // Enable the button after error handling
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className={style.container}>
      <div className={style.warp}>
        <form onSubmit={handleSubmit} className={style.form}>
          <h2 className={style.head}>Sign In</h2>
          <div className={style.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && <p className={style.error}>{emailError}</p>}
          </div>
          <div className={style.formGroup}>
            <label>Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              className={style.formPassword}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={style.toggleButton}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {passwordError && <p className={style.error}>{passwordError}</p>}
          </div>
          <div>
            <button
              type="submit"
              className={style.rbuttonLogin}
              disabled={isSubmitting} // Disable the button based on state
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </div>
          <p className={style.loginP}>
            By continuing, you agree to the
            <Link to="#" className={style.linktermLogin}>
              Terms of use
            </Link>
            and
            <Link to="#" className={style.linktermLogin}>
              Privacy Policy
            </Link>
          </p>
          <p className={style.loginP}>
            <Link to="#" className={style.linkLogin}>
              Other issues with sign in
            </Link>
            <Link to="#" className={style.linktermLogin}>
              Forgot Password
            </Link>
          </p>
        </form>
        <div className={style.text}>New to our community</div>
        <div>
          <a href="/register">
            <button className={style.buttonLogin}>Create an Account</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;

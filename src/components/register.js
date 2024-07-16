import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Style from "../css/password.module.css";
import style from "../css/register.module.css";
import PasswordChecklist from "react-password-checklist";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lname, setLname] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showChecklist, setShowChecklist] = useState(false);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  const validatePassword = (password) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-+.`,':;~]).{6,20}$/;
    return re.test(password);
  };

  const validateEmail = (email) => {
    const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  };

  const validateNumber = (number) => {
    const re = /^\d{10}$/;
    return re.test(number);
  };

  const validateName = (name) => {
    const re = /^[a-zA-Z]{3,20}$/;
    return re.test(name);
  };

  const validateLname = (lname) => {
    const re = /^[a-zA-Z]{3,20}$/;
    return re.test(lname);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Disable button on submit
    const res = {};

    if (!validateEmail(email)) {
      res.email = "Invalid email format";
    }

    if (!validateName(name)) {
      res.name = "Name must contain only letters and be 3-20 characters long";
    }

    if (!validateLname(lname)) {
      res.lname = " Last Name must contain only letters and be 3-20 characters long";
    }

    if (!validatePassword(password)) {
      res.password = "Password does not meet criteria";
    }

    if (!validateNumber(number)) {
      res.number = "Invalid phone number";
    }

    if (password !== confirmPassword) {
      res.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(res).length > 0) {
      setErrors(res);
      setLoading(false); // Enable button if validation fails
      return;
    }

    setErrors({});

    const formData = new FormData();
    formData.append("email", email);
    formData.append("name", name);
    formData.append("lname", lname);
    formData.append("number", number);
    formData.append("password", password);
    formData.append("image", image);
    try {
      const response = await axios.post(
        "http://localhost:5000/users/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      setLoading(false); // Enable button on success
      navigate("/login");
    } catch (err) {
      console.error("register error:", err);
      const errorMsg = err.response?.data?.msg || "Invalid inputs";
      setErrors({ form: errorMsg });
      setLoading(false); // Enable button on error
    }
  };

  const onFocusPasswordInput = () => {
    setShowChecklist(true);
  };

  const onBlurPasswordInput = () => {
    setShowChecklist(false);
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className={style.container}>
      <div className={style.warp}>
        <form onSubmit={handleSubmit} className={style.form}>
          <div className="form-grou">
            <h2 className={style.head}>Create an Account:</h2>
            <p className={style.head}>
              Already have an Account?
              <Link to="/login" className={style.link}>
                Login
              </Link>
            </p>
            <div>
              <div>
                <label className={style.namefield}>First Name:</label>
                <label className={style.namefield}>Last Name:</label>
              </div>
              <div>
                <input
                  type="text"
                  className={style.name}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <input
                  className={style.name1}
                  type="text"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                />
                {errors.name && <p className={style.error}>{errors.name}</p>}
                {errors.lname && <p className={style.error}>{errors.lname}</p>}

              </div>
            </div>
          </div>
          <div className="form-grou">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <p className={style.error}>{errors.email}</p>}
          </div>
          <div className="form-grou">
            <label>Phone Number:</label>
            <input
              className={style.input}
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />
            {errors.number && <p className={style.error}>{errors.number}</p>}
          </div>
          <div className="form-grou">
            <div className={style.formPassword}>
              <div>
                <label className={style.formlabel}>Password:</label>
                <label className={style.formlabelc}>Confirm Password:</label>
              </div>
              <div>
                <input
                  className={style.password}
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={onFocusPasswordInput}
                  onBlur={onBlurPasswordInput}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={style.toggleButton}
                  disabled={loading} // Disable button if loading
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
               
                <input
                  className={style.password1}
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                 {errors.password && (
                  <p className={style.error}>{errors.password}</p>
                )}
                {errors.confirmPassword && (
                  <p className={style.error}>{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div
              className={`${Style.PasswordChecklist} ${
                showChecklist ? Style.show : ""
              }`}
            >
              <PasswordChecklist
                rules={[
                  "capital",
                  "specialChar",
                  "minLength",
                  "lowercase",
                  "number",
                ]}
                minLength={6}
                value={password}
                messages={{
                  minLength: "The minimum length of the password should be 6.",
                  specialChar:
                    "The password should contain at least one special character.",
                  number:
                    "The password should contain at least one numeric letter.",
                  capital:
                    "The password should contain at least one uppercase letter.",
                }}
              />
            </div>
          </div>
          <div className="form-grou">
            <label>Profile Photo:</label>
            <input
              type="file"
              className={style.input}
              onChange={handleFileChange}
            />
          </div>
          <div>
            <p>
              <Link to="/login" className={style.link}>
                log in instead
              </Link>
              <button
                type="submit"
                className={style.button}
                disabled={loading} // Disable button if loading
              >
                {loading ? "Creating Account..." : "Create an Account"}
              </button>
            </p>
          </div>
        </form>
      </div>
      <div>
        <p>
          <Link to="#" className={style.footerh}>
            Help
          </Link>
          <Link to="#" className={style.footer}>
            Privacy
          </Link>
          <Link to="#" className={style.footer}>
            Terms
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

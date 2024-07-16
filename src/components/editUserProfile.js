import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Style from "../css/password.module.css";
import style from "../css/editUserProfile.module.css";
import PasswordChecklist from "react-password-checklist";
import { AuthContext } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const EditProfile = () => {
  const { auth } = useContext(AuthContext);
  const { id } = useParams();
  const [initialData, setInitialData] = useState({}); 
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lname, setLname] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showChecklist, setShowChecklist] = useState(false);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [imageUrl, setImageUrl] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false); 



  const getUserImage = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/users/uploads/${id}`);
      setImageUrl(response.request.responseURL);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!auth.token) return;
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${id}`, {
          headers: {
            "x-auth-token": auth.token,
          },
        });
        const { email, name, lname, number, image } = response.data;
        setInitialData({ email, name, lname, number, image }); // Store initial data
        setEmail(email);
        setName(name);
        setLname(lname);
        setNumber(number);
        setImage(image);
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };
    // getUserImage();
    fetchUserDetails();
  }, [id, auth.token]);

  const validatePassword = (password) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-+.;:'`~,]).{6,20}$/;
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
    if (isSaving) return; 

    setIsSaving(true); 

    const res = {};

    if (!validateEmail(email)) {
      res.email = "Invalid email format";
    }

    if (!validateName(name)) {
      res.name = "Name must contain only letters and be 3-20 characters long";
    }

    if (!validateLname(lname)) {
      res.name = " Last name must contain only letters and be 3-20 characters long";
    }

    if (password && !validatePassword(password)) {
      res.password = "Password does not meet criteria";
    }

    if (password !== confirmPassword) {
      res.confirmPassword = "Passwords do not match";
    }

    if (!validateNumber(number)) {
      res.number = "Invalid phone number";
    }

    if (Object.keys(res).length > 0) {
      setErrors(res);
      setIsSaving(false);
      return;
    }

    setErrors({});

    const formData = new FormData();
    formData.append("email", email);
    formData.append("name", name);
    formData.append("lname", lname);
    formData.append("number", number);

    if (password) {
      formData.append("password", password);
    }

    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.put(`http://localhost:5000/users/edit/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": auth.token,
        },
      });

      console.log("Update successful");
      setIsEditing(false);
      setIsSaving(false);
      getUserImage()
    } catch (err) {
      console.error("Update error:", err);
      const errorMsg = err.response?.data?.msg || "Invalid inputs";
      setErrors({ form: errorMsg });
      setIsSaving(false);
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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setEmail(initialData.email);
    setName(initialData.name);
    setLname(initialData.lname);
    setNumber(initialData.number);
    setImage(initialData.image);
    setPassword("");
    setConfirmPassword("");
    setIsEditing(false);
  };

  return (
    <div className={style.container}>
      <div className={style.warp}>
        <form onSubmit={handleSubmit} className={style.form}>
          <div className="form-group">
            {!isEditing && (
              <div className={style.pUser}>
                {imageUrl && (
                  <img src={imageUrl} alt="User" className={style.image} />
                )}
                <div>
                  <h2 className={style.head}>
                    {name}
                    <br />
                    {email}
                  </h2>
                </div>
                <div>
                  <button
                    type="button"
                    className={style.button}
                    onClick={handleEditClick}
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
            <div>
              <div>
                <label className={style.namefield}>First Name:</label>
                <label className={style.namefield}>Last Name:</label>
              </div>
              <div>
                <input
                  type="text"
                  className={style.name}
                  value={name || ""}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  required
                />

                <input
                  className={style.name1}
                  type="text"
                  value={lname || ""}
                  onChange={(e) => setLname(e.target.value)}
                  disabled={!isEditing}
                />
                {errors.name && isEditing && (
                  <p className={style.error}>{errors.name}</p>
                )}
                {errors.lname && isEditing && (
                  <p className={style.error}>{errors.lname}</p>
                )}
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
              required
            />
            {errors.email && isEditing && (
              <p className={style.error}>{errors.email}</p>
            )}
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="number"
              value={number || ""}
              onChange={(e) => setNumber(e.target.value)}
              disabled={!isEditing}
              required
            />
            {errors.number && isEditing && (
              <p className={style.error}>{errors.number}</p>
            )}
          </div>
          <div className="form-group">
            <div className={style.formPassword}>
              <div>
                <label className={style.formlabel}>Password:</label>
                <label className={style.formlabelc}>Confirm Password:</label>
              </div>
              <div>
                <input
                  className={style.password}
                  type={showPassword ? "text" : "password"}
                  value={password || ""}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={onFocusPasswordInput}
                  onBlur={onBlurPasswordInput}
                  disabled={!isEditing}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={style.toggleButton}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {errors.password && isEditing && (
                  <p className={style.error}>{errors.password}</p>
                )}
                <input
                  className={style.password1}
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword || ""}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={!isEditing}
                />
                {errors.confirmPassword && isEditing && (
                  <p className={style.error}>{errors.confirmPassword}</p>
                )}
                <div
                  className={`${Style.PasswordChecklist} ${
                    showChecklist ? Style.show : ""
                  }`}
                ></div>
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
          <div className="form-group">
            <label>Profile Photo:</label>
            <input
              type="file"
              onChange={handleFileChange}
              disabled={!isEditing}
            />
          </div>
          {isEditing && (
            <div className={style.editButtons}>
              <button
                type="submit"
                className={style.buttonSave}
                disabled={isSaving}
              >
                Save
              </button>
              <button
                type="button"
                className={style.buttonCancel}
                onClick={handleCancelClick}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditProfile;

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerRoute } from "../utils/APIRoutes";

function Register() {
  // khởi tạo biến
  const navigate = useNavigate();
  const [values, setValues] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  // xử lý sự kiện submit form
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      //console.log("in validation", registerRoute);
      const { password, userName, email } = values;
      const { data } = await axios.post(registerRoute, {
        userName,
        email,
        password,
      });
      console.log(data);
      // nếu trạng thái false thì thông báo lỗi
      if (data.status === false) {
        toast.error(data.message, toastOptions);
      }
      // nếu trạng thái true thì lưu thông tin user vào localstorage và chuyển hướng về trang chủ
      if (data.status === true) {
        // console.log("register success");
        localStorage.setItem("chat-app-user", JSON.stringify(data.newUser));
        navigate("/"); // navigate to home page
      }
    }
  };

  // xử lý sự kiện thông báo khi nhập sai
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  // nếu đã đăng nhập thì chuyển hướng về trang chủ
  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/");
    }
  }, []);

  // xử lý sự kiện validate form
  const handleValidation = () => {
    const { password, confirmPassword, userName, email } = values;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", toastOptions);
      return false;
    } else if (userName.length < 3) {
      toast.error("Username must be at least 3 characters long", toastOptions);
      return false;
    } else if (email === "") {
      toast.error("Email cannot be empty", toastOptions);
      return false;
    }
    return true;
  };

  // xử lý sự kiện onChange
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="Logo" />
            <h1>FRAMILY CHAT</h1>
          </div>
          <input
            type="text"
            placeholder="UserName"
            name="userName"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Register User</button>
          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

//css
const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
    input {
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid #4e0eff;
      border-radius: 0.4rem;
      color: white;
      width: 100%;
      &:focus {
        border: 0.1rem solid #997af0;
        outline: none;
      }
    }
    button {
      color: white;
      background-color: #997af0;
      padding: 1rem 2rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: 0.5s ease-in-out;
      &:hover {
        background-color: #4e0eff;
      }
    }
    span {
      color: white;
      text-transform: uppercase;
      a {
        color: #4e0eff;
        text-decoration: none;
        font-weight: bold;
      }
    }
  }
`;

export default Register;

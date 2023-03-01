import React, {useState, useEffect} from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";

export default function Welcome() {
    //Khởi tạo biến
    const [userName, setUserName] = useState("");

    //Hàm lấy thông tin người dùng hiện tại đang đăng nhập
  useEffect( () => {
    const loadData  = async () => {
        setUserName(await JSON.parse(localStorage.getItem("chat-app-user")).userName);
    }
    loadData();
  }, []);
  return(
    <Container>
        <img src={Robot} alt="Robot"/>
        <h1>
            Welcome, <span>{userName} !</span>
        </h1>
        <h3>
            Please select a chat to Start Messaging.
        </h3>
    </Container>
  );
}

//css
const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
color: white;
img {
    height: 20rem;
}
span {
    color: #4e00ff;
}
`;
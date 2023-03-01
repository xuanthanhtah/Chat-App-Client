import React, {useState, useEffect, useRef} from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import {io} from "socket.io-client";

function Chat() {
  //khởi tạo biến
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate = useNavigate();
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  //nếu chưa đăng nhập thì chuyển hướng về trang đăng nhập
  useEffect( ()=> {
    const loadData = async () => {
      if(!localStorage.getItem("chat-app-user")){
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
        setIsLoaded(true);
      }
    }
    loadData();
  }, []);

  //khởi tạo socket và gửi id của user hiện tại lên server
  useEffect(() => {
    if(currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  // lấy danh sách tất cả user trong database và loại bỏ user hiện tại ra khỏi danh sách
  useEffect(() => {
    let isMounted = true;
  
    const loadData = async () => {
      if(currentUser) {
        try {
          const { data } = await axios.get(allUsersRoute);
          const filterData = data.users.filter(user => user._id !== currentUser._id);
          if (isMounted) {
            setContacts(filterData);
          }
        } catch (error) {
          console.error('Error fetching contacts:', error);
        }
      } 
    };
  
    loadData();
    // clean up function
    return () => {
      isMounted = false;
    };
  }, [currentUser]);
  
  // useEffect(() => {
  //   const loadData = async () => {
  //     const {data} = await axios.get(allUsersRoute);
  //     const filterData = data.users.filter(user => user._id !== currentUser._id);
  //     setContacts(filterData);
  //   }
  //     loadData();
  // }, [currentUser]);
  
  //xử lý khi click vào chat
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  }
  return (
    <Container>
      <div className="container">
        <Contacts
          contacts={contacts} 
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
        {
          isLoaded &&
          currentChat  === undefined ? (<Welcome currentUser={currentUser}/>)
          : (
            <ChatContainer 
              currentChat={currentChat} 
              currentUser={currentUser} 
              socket={socket}
            />
            )
        }
        
      </div>
    </Container>
  );
}

//css
const Container = styled.div`
height: 100vh;
width: 100vw;
display: flex;
felex-direction: column;
justify-content: center;
gap: 1rem;
align-items: center;
background-color: #131324;
.container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-height: 1080px) {
      grid-template-columns: 25% 75%;

    }
`;

export default Chat;



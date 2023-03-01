import React, {useEffect, useState, useRef} from "react";
import styled from "styled-components";
import Logout from "./Logout";
import ChatInput from "./ChatInput";
import { getAllMessagesRoute, sendMessagesRoute } from "../utils/APIRoutes";
import axios from "axios";
import {v4 as uuidv4} from "uuid";

export default function ChatContainer({currentChat, currentUser, socket}) {

    //Khởi tạo biến
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const scrollRef = useRef();

    //Hàm lấy tất cả tin nhắn
    useEffect( () => {
        const loadData = async () => {
            if(currentChat) {
                const response = await axios.post(getAllMessagesRoute, {
                    from: currentUser._id,
                    to: currentChat._id,
                });
                setMessages(response.data);
            }
        }
        loadData();
    },[currentChat]);

    //Hàm gửi tin nhắn
    const handleSendMsg = async (msg) => {
        //Gửi tin nhắn lên server
        await axios.post(sendMessagesRoute, {
            from: currentUser._id,
            to: currentChat._id,
            message: msg,
        });
        //Gửi tin nhắn lên client
        socket.current.emit("send-msg", {
            to: currentChat._id,
            from: currentUser._id,
            message: msg,
        });

        //Thêm tin nhắn vào mảng
        const msgs = [...messages];
        msgs.push({fromSelf: true, message: msg});
        setMessages(msgs);
    };

    // Nhận tin nhắn từ server
    useEffect(() => {
        if(socket.current) {
            socket.current.on("msg-receive",(msg)=>{
                setArrivalMessage({fromSelf: false, message: msg});
            })
        }
    }, []);

    //Thêm tin nhắn vào mảng
    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    //Cuộn tin nhắn xuống dưới
    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages])

    return (
        <>
        {
            currentChat &&
            (
        <Container>
            <div className="chat-header">
                <div className="user-details">
                    <div className="avatar">
                    <img 
                        src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt=""
                    />
                    </div>
                    <div className="userName">
                        <h3>
                            {
                               currentChat.userName
                            }
                        </h3>
                    </div>
                </div>
                <Logout/>
            </div>
            <div className="chat-messages">
                {
                    messages.map((message) => {
                        return (
                         <div ref= {scrollRef} key={uuidv4()}>
                            <div className={`message ${message.fromSelf ? "sended": "recieved"}`}>
                                <div className="content">
                                    <p>
                                        {message.message}
                                    </p>
                                </div>
                            </div>
                         </div>   
                        ); 
                    })
                }
            </div>
            <ChatInput handleSendMsg={handleSendMsg}/>
        </Container>
            )
        }
        </>
    );
}

//css
const Container = styled.div`
    padding-top: 1rem;
    display: grid;
    grid-template-rows: 10% 75% 15%;
    gap: 1rem;
    overflow: hidden;
    @media screen and (min-width: 720px) and (max-height: 1080px) {
        grid-auto-rows: 15% 70% 15%;
      }
    .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem;
        .user-details {
            align-items: center;
            gap: 1rem;
            .avatar {
                img {
                    height: 3rem;
                }
            }
            .userName {
                h3 {
                    color: white;
                }
            }
        }
    }
    .chat-messages {
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: auto;
        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
        .message {
            display: flex;
            align-items: center;
            .content {
                max-width: 40%;
                overflow-wrap: break-word;
                padding: 1rem;
                font-size: 1.1rem;
                border-radius: 1rem;
                color: #d1d1d1;
            }
        }
    }
    .sended {
        justify-content: flex-end;
        .content {
            background-color: #4f04ff21;
        }
    }
    .recieved {
        justify-content: flex-start;
        .content {
            background-color: #9900ff20;
        }
    }
`;
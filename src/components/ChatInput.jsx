import React, {useState} from "react";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import {IoMdSend} from "react-icons/io";
import {BsEmojiSmileFill} from "react-icons/bs";

export default function ChatInput({handleSendMsg}) {
    //Khởi tạo biến
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [msg, setMsg] = useState("");

    //Hàm hiển thị bảng emoji
    const handleEmojiPickerHideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    //Hàm chọn emoji
    const handleEmojiClick = (emoji) => {
        let message = msg;
        message += emoji.emoji;
        setMsg(message);
    };

    //Hàm gửi tin nhắn
    const sendChat = e => {
        e.preventDefault();
        if(msg.length > 0) {
            handleSendMsg(msg);
            setMsg("");
        }
    };

    return (
        <Container>
            <div className="button-container">
                <div className="emoji">
                    <BsEmojiSmileFill onClick={handleEmojiPickerHideShow}/>
                    {
                        showEmojiPicker && <Picker onEmojiClick={handleEmojiClick}/>
                    }
                </div>
            </div>
            <form className="input-container" onSubmit={(e)=>{sendChat(e)}}>
                <input type="text" placeholder="Type your message here" value={msg} onChange={(e) => setMsg(e.target.value)}/>
                <button className="submit">
                    <IoMdSend/> 
                </button>
            </form>
        </Container>
    );
}

//css
const Container = styled.div`
display: flex;
grid-template-columns: 5% 95%;
align-items: center;
background-color: #080420;
padding: 0 2rem;
padding-bottom: 0.3rem;
@media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
}
.button-container {
    padding-right: 1rem;
    display: flex;
    align-items: center;
    color: #ebe7ff;
    gap: 1rem;
    .emoji {
        position: relative;
        svg {
            font-size: 1.5rem;
            color: #ffff00c8;
            crsor: pointer;
        }
        .EmojiPickerReact {
            position: absolute;
            top: -470px;
            background-color: #080420;
            box-shadow: 0 5px 10px #9a86f3;
            border-color: #9186f3;
            .epr-body::-webkit-scrollbar {
                background-color: #080420;
                width: 10px;
                &-thumb {
                    background-color: #9186f3;
                }
            }
            .emoji-categories {
                button {
                    filter: contrast(0);
                }
            }
            .epr-search {
                background-color: transparent;
                border-color: #9186f3;
            }
            .epr-emoji-category-label {
                background-color: #080420;
            }
        }
    }
}
.input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
        width: 90%;
        height: 60%;
        background-color: transparent;
        color: white;
        border: none;
        padding-left: 1rem;
        font-size: 1.2rem;
        &::selection {
            background-color: #9186f3;

        }
        &:focus {
            outline: none;

        }

    }
    button {
        padding: 0.3rem 2rem;
        border-radius: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #9a86f3;
        border: none;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
            padding: 0.3rem 1rem;
            svg {
                font-size: 1rem;
            }
        }
        svg {
            font-size: 2rem;
            color: #ebe7ff;
        }
    }
}
`;
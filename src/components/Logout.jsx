import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {BiPowerOff} from "react-icons/bi";


export default function Logout () {
    //Khởi tạo biến
    const navigate = useNavigate();
    
    // Hàm đăng xuất
    const handleClick = async () => {
        localStorage.clear();
        navigate("/login");
    };
    return (
        <Button>
            <BiPowerOff onClick={handleClick}/>
        </Button>
    );
}

//css
const Button = styled.button`
display: flex;
justify-content: center;
align-items: center;
padding: .7rem;
border-radius: 0.5rem;
background-color: #9a86f3;
border: none;
cursor: pointer;
svg {
    fornt-size: 1.3rem;
    color: #ebe7ff;
}
`;
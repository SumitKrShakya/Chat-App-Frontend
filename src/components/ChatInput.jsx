import React, {useState} from 'react'
import styled from 'styled-components';
import Picker from 'emoji-picker-react'
import {IoMdSend} from 'react-icons/io'
import {BsEmojiSmileFill} from 'react-icons/bs'
import { c1, c2, c3, c4, c5, c6 } from "../assets/ColorTheme";


const ChatInput = ({handleSendMsg}) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [msg, setMsg] = useState("")

    const handleEmojiPickerHideShow = ()=>{
        setShowEmojiPicker(!showEmojiPicker)
    }

    const handleEmojiClick = (event, emoji)=>{
        let message = msg;
        message+=emoji.emoji;
        setMsg(message)
    }

    const sendChat = (event)=>{
        event.preventDefault()
        if(msg.length>0){
            handleSendMsg(msg)
            setMsg('')
        }
    }

  return (
    <Container>
        <div className="button-container">
            <div className="emoji">
                <BsEmojiSmileFill  onClick={handleEmojiPickerHideShow}/>
                {
                    showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />
                }
            </div>
        </div>
        <form className="input-container" onSubmit={(e)=>sendChat(e)}>
            <input type="text" placeholder='Type your message here' value={msg} onChange={(e)=>{setMsg(e.target.value)}} />
            <button className="submit">
                <IoMdSend/>
            </button>
        </form>
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: ${c2};
  padding: 0 2rem;
  box-shadow:rgb(50 50 93 / 25%) 0px 50px 100px -20px, rgb(0 0 0 / 30%) 0px 30px 60px -30px, rgb(20 48 77 / 35%) 0px 0px 6px 0px inset;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  svg {
    filter: drop-shadow(0px 2px 2px rgb(0 0 0 / 0.4));
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: ${c1};
        box-shadow: 0 5px 10px ${c3};
        border-color: ${c4};
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: ${c2};
          width: 5px;
          &-thumb {
            background-color: ${c3};
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: ${c3};
        }
        .emoji-group:before {
          background-color: ${c1};
        }
      }
    }
  }
  .input-container {
    // filter: drop-shadow(0px 2px 2px rgb(0 0 0 / 0.9));
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
      color: ${c5};
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;
      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
      &::placeholder {
        color: ${c4};
        opacity: 1; /* Firefox */
      }
    }
    button {
      &:hover{
        background-image: linear-gradient(to right, #e1e1e1 , ${c3});
        
        transition: all 1s ease-in-out;
      }
      cursor:pointer;
      padding: 0.3rem 2rem;
      border-radius: 0rem 2rem 2rem 0rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: linear-gradient(to right, #e1e1e1 , #e1e1e1);
      transition: all 1s ease-in-out;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: ${c1};
      }
    }
  }
`;

export default ChatInput
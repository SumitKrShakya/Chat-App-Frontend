import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { getAllMessagesRoute, sendMessageRoute } from "../utils/APIRoutes";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import { c1, c2, c3, c4, c5, c6 } from "../assets/ColorTheme";

const ChatContainer = ({ currentChat, currentUser, socket }) => {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  useEffect(() => {
    const check = async () => {
      setMessages([]);
      if (!(currentUser && currentChat)) return;
      const response = await axios.post(getAllMessagesRoute, {
        from: currentUser._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    };
    check();
  }, [currentChat]);
  const handleSendMsg = async (msg) => {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  return (
    <>
      {currentChat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                  alt=""
                />
              </div>
              <div className="username">
                <h3>{currentChat.username}</h3>
              </div>
            </div>
            <Logout />
          </div>
          <div className="chat-messages">
            {messages.map((message, index, array) => {
              return (
                <div ref={scrollRef} key={uuidv4()}>
                  <div
                    className={`message ${
                      message.fromSelf ? "sended" : "recieved"
                    }`}
                  >
                    <div
                      className={
                        message.fromSelf && index === array.length - 1
                          ? "asend content"
                          : !message.fromSelf && index === array.length - 1
                          ? "rres content "
                          : `content`
                      }
                    >
                      <p>{message.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: ${c4};
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
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .asend {
      animation: zoominsend 1s forwards;
    }
    .rres {
      animation: zoominrecieve 1s forwards;
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: ${c6};
        border-radius: 1rem 1rem 0rem 1rem;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: ${c5};
        border-radius: 0rem 1rem 1rem 1rem;
      }
    }
    @keyframes zoominsend {
      0% {
        transform-origin: 100% 100%;
        transform: scale(0) translateY(100%) translateX(100%);
        opacity: 0.5;
      }
      100% {
        transform: scale(1) translateY(0%) translateX(0%);
        opacity: 1;
      }
    }
    @keyframes zoominrecieve {
      0% {
        transform-origin: 0% 0%;
        transform: scale(0) translateY(-100%) translateX(-100%);
        opacity: 0.5;
      }
      100% {
        transform: scale(1) translateY(0%) translateX(0%);
        opacity: 1;
      }
    }
  }
`;

export default ChatContainer;

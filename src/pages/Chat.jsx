import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { c1, c2, c3, c4, c5, c6 } from "../assets/ColorTheme";
import axios from "axios";
import {
  allUsersRoute,
  setAvatarRoute,
  host,
  searchRoute,
  addContactsRoute,
} from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";
import { BiSearchAlt2 } from "react-icons/bi";
import useIsTabVisible from "../assets/useIsTabVisible";

const Chat = () => {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchArray, setSearchArray] = useState([]);

  useEffect(() => {
    const check = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
        setIsLoaded(true);
      }
    };
    check();
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    const check = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.post(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        } else {
          navigate("/setAvatar");
        }
      }
    };
    check();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  const handleContactAdd = (i)=>{
    const check = async ()=>{
      const data = await axios.post(`${addContactsRoute}`,{
        to:currentUser._id,
        add:searchArray[i]._id,
      })
      setIsSearching(false)
    }
    check()
  }

  const handlerSearchInput = (val) => {
    const check = async () => {
      const searchResult = await axios.post(`${searchRoute}`, { val, currentUser });
      setSearchArray(searchResult.data);
    };
    check();
  };

  return (
    <Container>
      {isSearching && (
        <div
          onClick={(event) =>
            event.currentTarget == event.target && setIsSearching(false)
          }
          className="whole-page"
        >
          <div className="search-div">
            <div className="div"></div>
            <input
              placeholder="Search of contacts here..."
              className="input-search"
              type="text"
              onChange={(e) => handlerSearchInput(e.target.value)}
            />
          </div>
          <div className="flex-search">
            {searchArray.map((e,i) => {
              return (
                <div onClick={()=>handleContactAdd(i)} className="contact" key={e._id}>
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${e.avatarImage}`}
                      alt=""
                    />
                  </div>
                  <div className="username">
                    <h3>{e.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="container">
        <BiSearchAlt2
          className="search"
          onClick={() =>{ setIsSearching(true);setSearchArray([])}}
        />
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
        {isLoaded && currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
          />
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  position: relative;
  background-color: ${c1};
  .whole-page {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.422);
    backdrop-filter: blur(4px);
    animation: blr 1s ease forwards;
  }
  @keyframes blr {
    0% {
      backdrop-filter: blur(0px);
      opacity: 0;
      background-color: rgba(0, 0, 0, 0);
    }
    100% {
      opacity: 1;
      backdrop-filter: blur(10px);
      background-color: rgba(0, 0, 0, 0.422);
    }
  }

  .input-search {
    width: 60vw;
    padding: 10px 30px;
    font-size: 20px;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 0.2);
    border: 2px solid white;
    color: white;
    &::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }
  }
  .flex-search {
    overflow-y: auto;
    max-height: 300px;
    width: 40vw;
    margin-top: 20px;
    // background-color: red;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: ${c3};
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
  }
  .search {
    position: absolute;
    top: 3%;
    left: 1%;
    font-size: 30px;
    color: ${c2};
    cursor: pointer;
  }
  .contact {
    background-color: ;
    border: 1px solid ${c4};
    border-bottom-color: ${c3};
    border-top-color: ${c3};
    min-height: 5rem;
    cursor: pointer;
    width: 95%;
    border-radius: 0.2rem;
    padding: 0.4rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    transition: 0.5s ease-in-out;
    .avatar {
      img {
        height: 3rem;
      }
    }
    .username {
      h3 {
        color: white;
      }
    }
  }
  .container {
    position: relative;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
      rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
      rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
    height: 85vh;
    width: 85vw;
    background-color: ${c2};
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;

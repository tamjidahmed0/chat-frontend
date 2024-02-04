"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile, faImage } from "@fortawesome/free-solid-svg-icons";

import Image from "next/image";
import { useAppContext } from "@/context/context";



const Inbox = (params) => {
  const { socket, dispatch, state } = useAppContext();
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [typing, setuserTyping] = useState(false);
  const [incommingTyping, setTyping] = useState(false);

  const [event, setEvent] = useState(null);
  const [scrollRef, setScrollRef] = useState(null);

  const messagesRef = useRef(null);

  // console.log(params)

  // dispatch({ type: 'setreceiverId', payload: params.receiverId })

  useEffect(() => {
    dispatch({ type: "setreceiverId", payload: params.receiverId });
    console.log(state);
  }, [params.userID, params.receiverId]);

  //scroll
  useEffect(() => {
    // Set the scrollRef to the current value of messagesRef
    setScrollRef(messagesRef.current);
  }, []);

  //handle message change
  const handleMessageChange = (e) => {
    setInputValue(e.target.value);
    
  };

  //send button
  const handleSendClick = () => {
    setuserTyping(false)
    //if socket available
    if (socket) {
      // Emit the message using the existing socket
      const date = new Date();
      const timeString = date.toLocaleTimeString("en-US", {
        hour12: true,
        hour: "numeric",
        minute: "numeric",
      });

      //send socket message to server
      socket.emit("sendMessage", {
        name: params.senderDetails.name,
        profile: params.senderDetails.profilePic,
        senderId: params.userID,
        receiverId: params.receiverId,
        text: inputValue,
        socketId: socket.id,
        Dates: timeString,
      });
    }

    setInputValue("");
  };

  //receive incomming message
  useEffect(() => {
    setMessage(params.messages);

    if (socket) {
      const handleReceiverMessage = (data) => {
        if (params.receiverId === data.iSend) {
          console.log("Received message from server:", data);
          setMessage((msgs) => [...msgs, data]);

          if (scrollRef) {
            // Scroll to the bottom when new messages arrive
            scrollRef.scrollTop = scrollRef.scrollHeight;
          }
        }
      };

      // receive incomming msg
      socket.on("receivermessage", handleReceiverMessage);

      // Cleanup function to remove the event listener when the component unmounts or the dependency changes
      return () => {
        if (socket) {
          socket.off("receivermessage", handleReceiverMessage);
        }
      };
    }
  }, [socket, params.receiverId]);

  //outgoing text
  useEffect(() => {
    if (socket) {
      socket.on("sendermsg", (sendermsg) => {
        // console.log(sendermsg, 'come from sender')
        // dispatch(setConversation(sendermsg));
        setuserTyping(false);

        setMessage((msgs) => [...msgs, sendermsg]);
      });
    }
  }, [socket]);

  // key press

  const handleEnterKeyPress = (e) => {
    const updatedValue = inputValue.slice(0, -1);
    const updatedReverseLength = updatedValue.split().reverse().join().length;
    
  


    console.log(updatedValue);
    
    if (updatedReverseLength > 0) {
     
   
     setuserTyping(true)


      // setTimeout(() => {
      //   setuserTyping(true);
      // }, 0);
    }


    if (e.key === "Enter") {
      e.preventDefault();
      handleSendClick();
      setuserTyping(false)
    }


    if (e.key === "Backspace") {
      console.log("back");

      if (updatedReverseLength === 0) {
        setuserTyping(false)
       

        // setTimeout(() => {
        //   setuserTyping(true);
        // }, 0);
      } else if(updatedReverseLength > 0){
        
        setuserTyping(true);
      }

      
    }
  };





  //typing event
  useEffect(() => {
    if (socket) {
      socket.emit("typing", {
        socketId: socket.id,
        receiverId: params.receiverId,
        senderId: params.userID,
        msg: typing,
        profile: params.senderDetails.profilePic,
      });
    }
  }, [inputValue]);


//receive typing event
  if (socket) {
    socket.on("typingmsg", (data) => {
      if (params.receiverId === data.senderId) {

        setTyping(data.msg)
        
console.log(data.msg)
        // console.log(data, 'linne 192')

        // const updatedValue = inputValue.slice(0, -1);
        // const updatedReverseLength = updatedValue.split("").reverse().join("").length;

        // console.log(updatedReverseLength);

        // if (updatedReverseLength === 0) {
        //   setTimeout(() => {
        //     setuserTyping(true);
        //   }, 0);
        // }
      }
    });
  }

  // console.log(event);

  return (
    <div className="mx-2 flex flex-col h-full relative">
      <div className="flex items-center h-28 bg-lightdark pl-4">
        <Image src={`${process.env.NEXT_PUBLIC_API}/${params.profile.profilePic}`} width={50} height={50} objectFit="cover" className="rounded-full w-[5rem] h-[5rem] object-cover" />
        <div className="ml-5">
          <h1 className="font-bold text-xl text-white">{params.profile.name}</h1>
          <span className="text-green-600 font-semibold">{incommingTyping ? "Typing..." : "online"}</span>
        </div>
      </div>

      <div className="flex-grow bg-lightdark pl-4 mt-2 overflow-y-auto pb-36 h-0 " ref={messagesRef}>
        {message.map((data, index) => (
          <div key={index} className={`flex mb-1 cursor-pointer mt-16 ${data.whoSend ? "" : "justify-end"}`}>
            <div className="w-24 h-9 rounded-full flex items-center justify-center mr-2">
              {/* <Image src={`http://127.0.0.1:8000/${data.profile}`} alt="tamjid" width={50} height={50}   objectFit="cover" className={`${data.whoSend ? '' : 'hidden'} rounded-full `} /> */}
              <Image src={`${process.env.NEXT_PUBLIC_API}/${data.profile}`} width={50} height={50} objectFit="cover" className={`${data.whoSend ? "" : "hidden"} rounded-full w-[4rem] h-[4rem] object-cover`} />
            </div>
            <div className="flex max-w-96 bg-white rounded-lg p-3 gap-3 items-start">
              <p className="text-gray-700">{data.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* <SendMsg params ={params.id} userID ={user.value } /> */}

      <div className=" border-t border-gray-300 p-4 absolute bottom-0 w-full bg-[#1A2238]">
        <div className="flex items-center relative">
          <FontAwesomeIcon icon={faFaceSmile} size={"xl"} color="#fff" className=" absolute left-3" />
          <div className="w-[90%] bg-[#2F374B] rounded-full py-3 ">
            <input type="text" onKeyDown={handleEnterKeyPress} onChange={handleMessageChange} value={inputValue} placeholder="Type a message..." className=" w-[80%] ml-10 p-2   focus:outline-none focus:border-blue-500 bg-transparent text-white" />
          </div>
          <button onClick={handleSendClick} className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inbox;

"use client";
import React, { useEffect, useState } from "react";

import Image from "next/image";
import getAllChat from "@/lib/getAllChat";
import Link from "next/link";

import { usePathname } from "next/navigation";

import { useAppContext } from "@/context/context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck} from "@fortawesome/free-solid-svg-icons";


const Chat = (userId) => {
  const pathname = usePathname();
  const { socket, dispatch, state } = useAppContext();
  const [accept, setAccept] = useState("");
  const [update, setUpdate] = useState([]);

 



  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState([]);


  useEffect(() => {
    const api = async () => {
      const conversations = await getAllChat(search);
 
      setConversations(conversations);
    };

    api();
  }, [search, accept, update]);


  useEffect(() => {
    if (socket) {
      socket.on("conversations", async (datas) => {
        setUpdate(datas);

      });

      ////outgoing msg conversation
      socket.on("convsendermsg", async (sendermsg) => {
        console.log(sendermsg, "come from sender");
        setUpdate(sendermsg);

      });

      socket.on("acceptRefresh", (data) => {
        setAccept(data);
        console.log(data);
      });
    }
  }, [socket]);

  // console.log(conversations, "176");

  return (
    <div className="ml-6  w-[30%]  h-screen  transition-transform -translate-x-full sm:translate-x-0">
      <div className="mx-2 flex flex-col h-full relative">
        <div className=" h-28 bg-lightdark pl-4">
          <h1 className=" font-bold text-white text-2xl mx-2 my-2">Chats</h1>
          <div className="flex items-center  mx-auto bg-transparent rounded-lg " x-data="{ search: '' }">
            <div className="w-full ">
              <input value={search} onChange={(e) => setSearch(e.target.value)} type="search" className=" bg-transparent w-full px-4 py-1 text-white  focus:outline-none  border-white  border-b" placeholder="Search name or username" x-model="search" />
            </div>
            <div>
              <button type="submit" className="flex items-center  justify-center w-12 h-12 text-white rounded-r-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-grow bg-lightdark mt-2 overflow-y-auto  h-0 py-2  ">
          <div>
            <div className="">
              {conversations && conversations.length > 0 ? (
                conversations.map((user, index) => {
                  const isActive = pathname.startsWith(`/messages/${user.Id}`);

                  return (
                    <Link key={index} href={`/messages/${user.Id}`}>
                      <div className={`flex items-center bg-[#2F374B] px-7 py-5 rounded-3xl mx-3 mb-5 relative overflow-auto ${isActive && "bg-[#456288]"} `}>
                        <Image alt={`${user.name} image`} src={`${process.env.NEXT_PUBLIC_API}/${user.profile}`} width={50} height={50} objectFit="cover" className="rounded-full w-[4.5rem] h-[4.5rem] object-cover" />
                        <div className="ml-5">
                          <div className = ' flex items-center'>
                          <h5 className="font-bold text-white">{user.name}</h5>
                          {user.verified && <FontAwesomeIcon icon={faCircleCheck} size="x" color="#1F71F7" className=" ml-2" />}
                           
                          </div>
                          
                          <span className={`text-gray-500 ${user.unReadMsgCount > 0 && "font-bold text-white"}`}>{user.convText}</span>
                        </div>

                        {user.unReadMsgCount !== 0 && (
                          <div className="absolute right-3 flex flex-col bg-red-500 rounded-full h-6 w-6 top-[1rem] text-center items-center justify-center">
                            <h1 className="font-semibold text-white text-[12px]">{user.unReadMsgCount}</h1>
                          </div>
                        )}

                        <div className="absolute right-3">
                          <span className="text-gray-400">{user.date}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : conversations && conversations.msg ? (
                <p className="text-white">{conversations.msg}</p>
              ) : (
                <p>loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

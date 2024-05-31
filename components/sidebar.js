"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faGear, faComment, faPhone, faBell, faUsers } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import tamjid from "@/public/tamjid.jpg";
import remove from "./deleteCookie";
import { useRouter } from "next/navigation";


import getProfileDetails from "@/lib/getProfileDetails";
import getCookie from "@/components/getCoockie";
import getMsgRequest from "@/lib/getMsgRequest";
import { useAppContext } from "@/context/context";
import getNotification from "@/lib/getNotification";
import NotificationModal from "./notificationModal";

const Sidebar = () => {
  const router = useRouter();



  const { socket, dispatch, state } = useAppContext();
  const [update, setUpdate] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState({})

  const [isShown, setIsShown] = useState(false);
  const [profile, setProfile] = useState({});

  const [notiCount, setNotiCount] = useState(0);
  const [count, setCount] = useState(0);

  const click = () => {
    Promise.all([remove("c_user"), remove("token")]).then(() => {
      router.refresh("/");
      if(socket){
        socket.disconnect()
      }
    });
  };

  useEffect(() => {
    const api = async () => {

      
  const userId = await getCookie('c_user')
 
      const profile = await getProfileDetails(userId?.value);
    
      const requestcount = await getMsgRequest();
      const result = await getNotification()

   
        
      setNotification(result)
      setNotiCount(result?.count)
      setCount(requestcount?.count);
      setProfile(profile);
    };

    api();







  }, [count, update ]);

  // console.log(profile, 'sidebar')




  useEffect(() => {

 



    if (socket) {
      socket.on("acceptNotify", (data) => {
        setUpdate(data);
        setCount(data.count);
        console.log(data.count);
      });
      socket.on("acceptRefresh", (data) => {
        setUpdate(data);
      
        
      });

      // socket.on('requestCount', (data)=>{
      //   setCount(data.count)

      // })

      socket.on("conversations", async (datas) => {
        setUpdate(datas);
      });
    }
  }, [socket]);

  const handleNotification = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="top-0 left-0  w-[5%] h-screen transition-transform -translate-x-full sm:translate-x-0 z-30">
      <div className=" h-full bg-lightdark ">
        <div className=" pt-5">
          <div className="my-10">
            <Link href={`/messages`} className="">
              <div className="flex flex-col items-center">
                <FontAwesomeIcon icon={faComment} size={"xl"} color="#fff" />
                <span className="text-[0.9rem] text-[#fff] font-extralight">Chats</span>
              </div>
            </Link>
          </div>

          <div className=" my-10">
            <Link href={`/messages/calls`}>
              <div className="flex flex-col items-center">
                <FontAwesomeIcon icon={faPhone} size={"xl"} color="#fff" />
                <span className="text-[0.9rem] text-[#fff] font-extralight">calls</span>
              </div>
            </Link>
          </div>

          <div className=" my-10">
            <Link href={`/messages/request`}>
              <div className="flex flex-col items-center relative">
                {count !== 0 && (
                  <div className={`absolute bg-red-500 rounded-full h-6 w-6 top-[-1rem] left-3 text-center items-center justify-center flex `}>
                    <h1 className=" font-semibold text-white text-[12px]">{count}</h1>
                  </div>
                )}

                <FontAwesomeIcon icon={faUserPlus} size={"xl"} color="#fff" />
                <span className="text-[0.9rem] text-[#fff] font-extralight">Request</span>
              </div>
            </Link>
          </div>

          <div className=" my-10">
            <Link href={`/messages/connection`}>
              <div className="flex flex-col items-center relative">
                {/* {count !== 0 && (
                  <div className={`absolute bg-red-500 rounded-full h-6 w-6 top-[-1rem] left-3 text-center items-center justify-center flex `}>
                    <h1 className=" font-semibold text-white text-[12px]">{count}</h1>
                  </div>
                )} */}

                <FontAwesomeIcon icon={faUsers} size={"xl"} color="#fff" />
                <span className="text-[0.9rem] text-[#fff] font-extralight">Connection</span>
              </div>
            </Link>
          </div>

          <div className="my-10 relative ">
            <div className="flex flex-col items-center" onClick={handleNotification}>
              {notiCount !== 0 && (
                <div className={`absolute bg-red-500 rounded-full h-6 w-6 top-[-1rem] left-3 text-center items-center justify-center flex z-10`}>
                  <h1 className="font-semibold text-white text-[12px]">{notification?.count}</h1>
                </div>
              )}
              <FontAwesomeIcon icon={faBell} size={"xl"} color="#fff" />
              <span className="text-[0.9rem] text-[#fff] font-extralight">Notification</span>
            </div>
            {isModalOpen && <NotificationModal notification ={notification} />}
          </div>

          <div className=" mt-[15rem]" onClick={() => setIsShown(true)}>
            <Link href={"/settings"}>
              <div className="flex flex-col items-center">
                <FontAwesomeIcon icon={faGear} size={"xl"} color="#fff" />
                <span className="text-[0.9rem] text-[#fff] font-extralight">Settings</span>
              </div>
            </Link>
          </div>

          <div className=" mt-10" onClick={click}>
            <Link href={"/"}>
              <div className="flex flex-col items-center">
                <Image  src={`${process.env.NEXT_PUBLIC_API}/${profile?.profilePic}`} width={50} height={50} objectFit="cover" className="rounded-full w-[3rem] h-[3rem] object-cover" />
                <span className="text-[0.9rem] text-[#fff] font-medium">{profile?.name}</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

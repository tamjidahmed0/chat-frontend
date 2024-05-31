'use client'
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import getCookie from '@/components/getCoockie';


let socket = null; // initialize socket object to null

const getSocket = () => {
  
    const userId = ( getCookie('c_user')).value;
    const cookie = (getCookie('token')).value;

  if (!socket) {
   
    // console.log(id , 'come from socket')
    socket = io(process.env.NEXT_PUBLIC_SOCKET_API, {
      query: { userID:userId, receiverId:'' }  ,
      auth:{
        token:cookie
       },
    
    });
    // add event listeners and emit events as needed
  }
return socket
  
};

export default getSocket;
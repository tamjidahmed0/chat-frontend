'use client'
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile , faImage} from "@fortawesome/free-solid-svg-icons";
import { io } from 'socket.io-client';
import  Image  from 'next/image';

const SendMsg = ({ params, userID, profile  }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');


  // console.log(messages, 'messages from send msg')

  useEffect(() => {
    // Initialize socket connection only once
    const newSocket = io('ws://192.168.0.118:9000', {
      query: { userID: userID, receiverId: params }
    });

    // Set the socket in the state
    setSocket(newSocket);

    // Cleanup function to disconnect the socket when the component is unmounted
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [userID, params]); // Dependencies to trigger the effect when userID or params change

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendClick = () => {
    setMessage('');
    if (socket) {
      // Emit the message using the existing socket
      socket.emit('sendMessages', { message });

      // Clear the input field after sending the message
      
    }
  };

  return (



    <div className='w-[65%]'>
    <div className="mx-2 flex flex-col h-full relative">
      <div className="flex items-center h-28 bg-lightdark pl-4">
        <Image src={`http://127.0.0.1:8000/${profile.profilePic}`} width={50} height={50} objectFit='cover' className='rounded-full w-[5rem] h-[5rem] object-cover'/>
        <div className='ml-5'>
       
          <h1 className='font-bold text-xl text-white'>{profile.name}</h1>
          <span className='text-green-600 font-semibold'>Online</span>
        </div>
      </div>

      <div className='flex-grow bg-lightdark pl-4 mt-2 overflow-y-auto pb-36 h-0 '>

 

{messages.map((data, index)=>(

<div key={index} className={`flex mb-1 cursor-pointer mt-16 ${data.whoSend ? '' : 'justify-end' }` } >
<div className="w-24 h-9 rounded-full flex items-center justify-center mr-2">
<Image src={`${process.env.NEXT_PUBLIC_API}/${data.profile}`} alt="tamjid" width={50} height={50}   objectFit="cover" className={`${data.whoSend ? '' : 'hidden'} rounded-full `} />
{/* <Image src  ={`${data.whoSend && `http://127.0.0.1:8000/${data.profile}`}`} alt='tamjid' width={24} height={24} className={`w-24 h-24 rounded-full object-cover ${data.iSend && 'hidden'} `}/> */}
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
        <FontAwesomeIcon icon={faFaceSmile} size={"xl"} color="#fff" className=' absolute left-3' />
        <div className='w-[90%] bg-[#2F374B] rounded-full py-3 '>
          <input type="text" onChange={handleMessageChange} placeholder="Type a message..." className=" w-[80%] ml-10 p-2   focus:outline-none focus:border-blue-500 bg-transparent text-white" />
        </div>
        <button onClick={handleSendClick} className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2">Send</button>
      </div>
    </div>


      </div>

 

    </div>


    // <div className=" border-t border-gray-300 p-4 absolute bottom-0 w-full bg-[#1A2238]">
    //   <div className="flex items-center relative">
    //     <FontAwesomeIcon icon={faFaceSmile} size={"xl"} color="#fff" className=' absolute left-3' />
    //     <div className='w-[90%] bg-[#2F374B] rounded-full py-3 '>
    //       <input type="text" onChange={handleMessageChange} placeholder="Type a message..." className=" w-[80%] ml-10 p-2   focus:outline-none focus:border-blue-500 bg-transparent text-white" />
    //     </div>
    //     <button onClick={handleSendClick} className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2">Send</button>
    //   </div>
    // </div>
  );
}

export default SendMsg;

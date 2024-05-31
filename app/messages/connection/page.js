"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import getMsgRequest from "@/lib/getMsgRequest";
import getRecommendation from "@/lib/getRecommendation";
import { useAppContext } from "@/context/context";
import getCookie from "@/components/getCoockie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck} from "@fortawesome/free-solid-svg-icons";



const Page = () => {
  const [request, setRequest] = useState([]);
  const [count, setCount] = useState('');
  const { socket, dispatch, state } = useAppContext();
  const [update , setUpdate] = useState([])
  const [recommendation , setRecommendation] = useState([])

const [accept , setAccept] = useState('')

  


  useEffect(() => {
    const apiRequest = async () => {
      const result = await getMsgRequest();
      const recommend = await getRecommendation()
      setRequest(result.data);
      setRecommendation(recommend)

      

      setCount(result.msg)

    
    
    };

    apiRequest();

  }, [accept, update]);


  console.log(request, 'result 29')

  useEffect(() => {
    if (socket) {
      socket.on("conversations", async (datas) => {
        console.log(datas);
        setUpdate(datas)


      });





      socket.on('acceptRefresh', (data)=>{
        setAccept(data)
        console.log(data)
      })




    }
  }, [socket]);
  
  


const handleAccept = async(id) =>{
  const userId = (await getCookie('c_user')).value;

  if(socket){
    socket.emit('accept', {
   requestId : id,
   userId : userId,
   socketId :socket.id
    })
  }
}






  console.log(request);

  return (
    <div className="ml-6 top-0 left-0 z-40 w-[30%] h-screen transition-transform -translate-x-full sm:translate-x-0  ">

      <div className="mx-2 flex flex-col h-full relative">
        <div className=" h-28 bg-lightdark pl-4">
          <h1 className=" font-bold text-white text-2xl mx-2 my-2">Friends</h1>
          <h1 className=" font-semibold text-red-700 text-lg mx-2 my-2"> {count} </h1>
        </div>

        <div className="flex-grow bg-lightdark mt-2 overflow-y-auto  h-0 py-2  ">
          <div>
            <div className="">
              {
                request.map((user, index) => (
                  <Link key={index} href={``}>
                    <div className="flex items-center bg-[#2F374B] px-7 py-5 rounded-3xl mx-3 mb-5 relative overflow-auto">
                      
                      <Image src={`${process.env.NEXT_PUBLIC_API}/${user.profile}`} width={50} height={50} objectFit="cover" className="rounded-full w-[4.5rem] h-[4.5rem] object-cover" />
                      <div className="ml-5">
                        <div className = ' flex items-center'>
                        <h5 className="font-bold text-white">{user.name}</h5>
                        {user.verified && <FontAwesomeIcon icon={faCircleCheck} size="x" color="#1F71F7" className=" ml-2" />}
                        {console.log(user)}
                        </div>
                     
                        <span className="text-gray-500">{user.convText}</span>
                      </div>
                      <div className="absolute right-3 flex flex-col">
                      <button type="button" onClick={()=> handleAccept(user.Id)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Accept</button>
                        <span className="text-gray-400">{user.date}</span>
                      </div>
                    </div>

                    
                  </Link>
                  
                ))}
               <h1 className=" font-bold text-white text-2xl mx-2 my-10 ">Suggested for you</h1>

                {
                recommendation.map((user, index) => (
                  <Link key={index} href={``}>
                    <div className="flex items-center bg-[#2F374B] px-7 py-5 rounded-3xl mx-3 mb-5 relative overflow-auto">
                      <Image src={`${process.env.NEXT_PUBLIC_API}/${user.profile}`} width={50} height={50} objectFit="cover" className="rounded-full w-[4.5rem] h-[4.5rem] object-cover" />
                      <div className="ml-5">
                        <h5 className="font-bold text-white">{user.name}</h5>
                        <span className="text-gray-500">{user.convText}</span>
                      </div>
                      <div className="absolute right-3 flex flex-col">
                      <button type="button" onClick={()=> handleAccept(user.Id)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Accept</button>
                        <span className="text-gray-400">{user.date}</span>
                      </div>
                    </div>

                    
                  </Link>
                  
                ))}
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Page;

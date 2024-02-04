"use client";
import React, {useEffect, useState} from "react";
import Image from "next/image";
import tamjid from "@/public/tamjid.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import getNotification from "@/lib/getNotification";


const notificationModal = ({notification}) => {







  return (
    <div className=" bg-[#161C2E] absolute left-[6rem] min-w-[27rem] max-h-96 rounded-lg top-0 border overflow-y-auto z-40 ">


{notification.data.map((datas, index)=>(

<div className="flex px-3 py-4 " key={index}>
<div className="relative">
  <Image src={`${process.env.NEXT_PUBLIC_API}/${datas.profile}`} width={50} height={50} objectFit="cover" className="rounded-full w-[4rem] h-[4rem] object-cover" />
  <FontAwesomeIcon icon={faUser} size={"1x"} color="#fff" className=" absolute bottom-0 right-0 bg-[#1C77E6] p-1 rounded-full" />
</div>

<div className=" flex flex-col pl-4">
<h1 className="  font-semibold text-white">{datas.msg}</h1>
<span className=" text-[#1C77E6] font-medium">{datas.time}</span>
</div>

</div>
))}


   
     

    </div>
  );
};

export default notificationModal;

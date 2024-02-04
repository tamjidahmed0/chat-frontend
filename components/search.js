'use client'
import React, {useState} from 'react'
import Chat from '@/serverComponents/serverChat'

const search = () => {
  return (

    <div className="ml-6 top-0 left-0 z-40 w-[30%] h-screen transition-transform -translate-x-full sm:translate-x-0">
  <div className="mx-2 flex flex-col h-full relative">
    <div className=" h-28 bg-lightdark pl-4">
      <h1 className=' font-bold text-white text-2xl mx-2 my-2'>Chats</h1>
    <div className="flex items-center  mx-auto bg-transparent rounded-lg " x-data="{ search: '' }">
    <div className="w-full ">
      <input type="search" className=" bg-transparent w-full px-4 py-1 text-white  focus:outline-none  border-white  border-b"
        placeholder="search" x-model="search"/>
    </div>
    <div>
      <button type="submit" className="flex items-center  justify-center w-12 h-12 text-white rounded-r-lg">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </button>
    </div>
  </div>
    </div>


<div className='flex-grow bg-lightdark mt-2 overflow-y-auto  h-0 py-2  '>
<Chat />
</div>

    </div>
    </div>


  


  )
}

export default search
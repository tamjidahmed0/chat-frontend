'use client'
import { Fragment, useRef, useState , useEffect} from 'react'
import { Dialog, Transition } from '@headlessui/react'

import Image from 'next/image'
import ImageUpload from '@/lib/imageUpload'
import getLoginDetails from '@/lib/getLoginDetails'

export default function Modal({title , description}) {
   
  const [open, setOpen] = useState(true)

  const cancelButtonRef = useRef(null)






  const handleImageUpload  = async() =>{
    setOpen(false)
        const formData = new FormData();
    formData.append('image', imageData);

    

    const result = await ImageUpload(formData)
  
 
  }





  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-40" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
           
             
        
             
          
                 
                
                   
                      <Dialog.Title as="h3" className=" text-2xl font-semibold leading-6 text-gray-900 text-center">
                        {title}
                      </Dialog.Title>
                      <Dialog.Description as="h3" className="text-base font-semibold leading-6 text-gray-500 text-center mt-10">
                       {description}
                      </Dialog.Description>
                  
                   
                 
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                   
                  >
                   Ok
                  </button>
             
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

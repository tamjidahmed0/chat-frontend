
import React from 'react'
import getInboxMsg from '@/lib/getInboxMsg';
import getProfileDetails from '@/lib/getProfileDetails';
import getCookie from '@/components/getCoockie' 
import Inbox from './inbox';





const page = async({params}) => {

    const user = getCookie('c_user')?.value


try {
  const messages = await getInboxMsg (user, params.id)


  const profile = await getProfileDetails(params.id)
  const senderDetails = await getProfileDetails(user)


  console.log(messages, 'messages')





  return (

    <div className='w-[65%]'>
    
    <Inbox receiverId ={params?.id} userID ={user } profile ={profile} messages={messages?.data} senderDetails ={senderDetails} request ={messages?.request} /> 
    
    </div>
    
        
    
    
      )


} catch (error) {
   
  console.log(error)
}

 



}

export default page

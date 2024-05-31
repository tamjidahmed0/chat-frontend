import React from 'react'
import { redirect } from 'next/navigation'

const page = async(params) => {
  console.log(params)
  redirect('/settings/profile')

}

export default page
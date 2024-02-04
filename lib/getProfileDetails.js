




export default async function getProfileDetails(userId) {
  
    const result = await fetch(`${process.env.NEXT_PUBLIC_API}/api/profile/${userId}`)

    return result.json()

}
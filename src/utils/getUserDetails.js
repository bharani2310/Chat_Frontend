import { BASE_URL } from "./config"
import axios from "axios"

export const getUserDetails =async(userId)=>{
    const Url=`${BASE_URL}/chat/getUser`
    try {
        const response=await axios.get(Url, { params: { userId } });
        if(response.data.success){
          return response
        }
      } catch (error) {
         
      }
}

export const getExistingMessage = async(sender,receiver) =>{
    console.log("sender",sender,"receiver",receiver)
    const Url=`${BASE_URL}/chat/getMessage`

    try {
      const response=await axios.get(Url, { params: { sender,receiver } });
      if(response.data.success){
        return response
      }
    } catch (error) {
       
    }
}
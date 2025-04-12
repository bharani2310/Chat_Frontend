import React, { useState,useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Avatar from './avatar.js'
import {uploadFile} from '../utils/uploadFile.js';
import Divider from './divider.js';
import axios from 'axios';
import { BASE_URL } from '../utils/config.js';
import toast from 'react-hot-toast';
import setUser from '../redux/userSlice.js'

const EditUserDetails = ({onClose}) => {
    const user = useSelector(state=>state.user)
    const uploadPhotoRef=useRef()
    const dispatch=useDispatch()
    const [data,setData]=useState({
        name:user?.name,
        profile_pic:user?.profile_pic
    })


    const handleChange=(e)=>{
        const {name,value}=e.target
        setData((prev)=>{
            return{
                ...prev,
                [name]:value
            }
        })
    }

    const handleUploadPhoto=async(e)=>{
        const file=e.target.files[0]
        const uploadPhoto = await uploadFile(file)
        
        setData((prev)=>{
            return{
              ...prev,
              profile_pic:uploadPhoto?.url
            }
        })
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()    
        try {
            const response=await axios({
                method:'PUT',
                url:`${BASE_URL}/chat/update-user`,
                data:data,
                withCredentials:true
              })
              
            console.log("res",response)
            toast.success(response?.data?.message)
            if(response?.data?.success){
                dispatch(setUser(response?.data?.data))
            }
        } catch (error) {
            console.log("response",error)
            // toast.error(error?.response?.data?.message)
        }

    }

    const handleOpenUploadPhoto = async(e) =>{
        e.preventDefault()
        uploadPhotoRef.current.click()
    }

    useEffect(() => {
        if (user) {
          setData({
            name: user?.name,
            profile_pic: user?.profile_pic
          })
        }
      }, [user])
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10'>
        <div className='bg-white p-4 py-5 m-1 rounded w-full max-w-sm'>
            <h2 className='font-semibold'>Profile Details</h2>
            {/* <p className='text-sm'>Edit User Details</p> */}

            <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='name'>Name :</label>
                    <input 
                        type='text'
                        name='name'
                        id='name'
                        value={data?.name}
                        onChange={handleChange}
                        className='w-full py-1 px-2 focus:outline-primary border'
                    />
                </div>
                <div>
                    <div>Photo :</div>
                        <div className='my-1 flex items-center gap-4'>
                            <Avatar width={40} height={40} imageUrl={data?.profile_pic} name={data?.name}/>
                            <label htmlFor='profile_pic'>
                            <button className='font-semibold' onClick={handleOpenUploadPhoto}>Change</button>
                            <input 
                                type='file'
                                className='hidden'
                                id='profile_pic'
                                ref={uploadPhotoRef}
                                onChange={handleUploadPhoto}
                            />
                        </label>
                        </div>
                </div>
                <Divider/>
                <div className='flex gap-2 w-fit ml-auto mt-3'>
                    <button onClick={onClose} className='border-secondary border px-4 py-1 rounded'>Cancel</button>
                    <button onClick={handleSubmit} className='border-secondary bg-secondary text-white border px-4 py-1 rounded'>Save</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default EditUserDetails
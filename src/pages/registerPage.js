import React, { useState } from 'react'
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Link, useNavigate } from 'react-router-dom';
import {uploadFile} from '../utils/uploadFile.js';
import { BASE_URL } from '../utils/config.js';
import axios from 'axios';
import  toast from 'react-hot-toast'

const RegisterPage = () => {
  const [data,setData]=useState({
    name:"",
    email:"",
    password:"",
    profile_pic:""
  })
  const[uploadPhoto,setUploadPhoto]=useState("")
const navigate = useNavigate()

  const handleChange=(e)=>{
    const {name,value}=e.target;

    setData((prev)=>{
      return {
        ...prev,
        [name]:value
      }
    })
  }

  const handleUploadPhoto=async(e)=>{
    const file=e.target.files[0]
    const uploadPhoto = await uploadFile(file)
    console.log("Upload Photo",uploadPhoto)
    setUploadPhoto(file)

    setData((prev)=>{
      return{
        ...prev,
        profile_pic:uploadPhoto?.url
      }
    })
  }

  const clearUploadPhoto=(e)=>{
    e.preventDefault()
    // e.stopPropagation()
    setUploadPhoto(null)
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    const registerUrl=`${BASE_URL}/chat/register`
    console.log("data",data)
    try {
      const response=await axios.post(registerUrl,data)
      console.log("response",response)
      toast.success(response.data.message)
      if(response.data.success){
        setData({
          name:"",
          email:"",
          password:"",
          profile_pic:""
        })
        navigate('/email')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <div className='mt-5'>
      <div className='bg-white w-full max-w-sm  rounded overflow-hidden p-4 mx-auto'>
        <h3>Welcome</h3>

        <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='name'>Name :</label>
            <input
            type='text'
            id='name'
            name='name'
            placeholder='Enter your name' 
            className='bg-slate-100 px-2 py-1 focus:outline-primary'
            value={data.name}
            onChange={handleChange}
            required/>
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='email'>Email :</label>
            <input
            type='email'
            id='email'
            name='email'
            placeholder='Enter your email' 
            className='bg-slate-100 px-2 py-1 focus:outline-primary'
            value={data.email}
            onChange={handleChange}
            required/>
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='password'>Password :</label>
            <input
            type='password'
            id='password'
            name='password'
            placeholder='Enter your password' 
            className='bg-slate-100 px-2 py-1 focus:outline-primary'
            value={data.password}
            onChange={handleChange}
            required/>
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='profile_pic'>Photo :
              <div className='h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer'>
                <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
                  {
                    uploadPhoto?.name?uploadPhoto.name : "Upload Profile Photo"
                  }
                </p>
                {
                  uploadPhoto?.name && (
                    <button onClick={clearUploadPhoto} className='text-lg ml-2 hover:text-red-600'><RiDeleteBin6Fill/></button>
                  )
                }
              </div>
            </label>

            <input
            type='file'
            id='profile_pic'
            name='profile_pic'
            className='bg-slate-100 px-2 py-1 focus:outline-primary hidden'
            onChange={handleUploadPhoto}
            />
          </div>
          <button className='bg-secondary text-lg px-4 py-1 rounded mt-3 font-bold text-white leading-relaxed tracking-wide'>
            Register
          </button>
        </form>
        <p className='my-3 text-center'>Already have Account ? <Link to={'/email'} className='hover:text-secondary font-semibold'>Login</Link></p>
      </div>
    </div>
  )
}

export default RegisterPage
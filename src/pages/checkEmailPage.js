import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineUserCircle } from "react-icons/hi2";
import { BASE_URL } from '../utils/config.js';
import axios from 'axios';
import  toast from 'react-hot-toast'

const CheckEmailPage = () => {

  const [data,setData]=useState({
    email:"",
  })
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

  const handleSubmit=async(e)=>{
    e.preventDefault()
    const registerUrl=`${BASE_URL}/chat/email`
    try {
      const response=await axios.post(registerUrl,data)
      toast.success(response.data.message)
      if(response.data.success){
        setData({
          email:"",
        })
        navigate('/password',{
          state:response?.data?.data
        })
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <div className='mt-3'>
      <div className='bg-white w-full max-w-sm  rounded overflow-hidden p-4 mx-auto'>
        <div>
          <HiOutlineUserCircle size={70} className='w-fit mx-auto mb-2'/>
        </div>
        <h3>Welcome</h3>
        <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>

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

          <button className='bg-secondary text-lg px-4 py-1 rounded mt-3 font-bold text-white leading-relaxed tracking-wide'>
            Verify Email
          </button>
        </form>
        <p className='my-3 text-center'>Don't have Account ? <Link to={'/register'} className='hover:text-secondary font-semibold'>Register</Link></p>
      </div>
    </div>
  )
}

export default CheckEmailPage
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineUserCircle } from "react-icons/hi2";
import { BASE_URL } from '../utils/config.js';
import axios from 'axios';
import  toast from 'react-hot-toast'
import Avatar from '../component/avatar.js';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../redux/userSlice.js';

const CheckPasswordPage = () => {

  const [data,setData]=useState({
    userId:"",
    password:""
  })
  const navigate = useNavigate()
  const location = useLocation()

  const dispatch=useDispatch()

  const handleChange=(e)=>{
    const {name,value}=e.target;

    setData((prev)=>{
      return {
        ...prev,
        [name]:value,
      }
    })
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    const registerUrl=`${BASE_URL}/chat/password`
    try {
      const response=await axios({
        method:"post",
        url:registerUrl,
        data:data,
        withCredentials:true
      })
      toast.success(response.data.message)
      
      if(response.data.success){
        dispatch(setToken(response?.data?.token))
        localStorage.setItem('token',response?.data?.token)

        setData({
          password:"",
        })
        
        navigate('/')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  useEffect(()=>{
    if(!location?.state?.email){
      navigate('/email')
    }
    else if (location?.state?._id) {
      setData((prev) => ({
        ...prev,
        userId: location.state._id // Update userId here
      }));
    }
  },[])

  return (
    <div className='mt-3'>
      <div className='bg-white w-full max-w-sm  rounded overflow-hidden p-4 mx-auto'>
        <div className='w-fit mx-auto mb-2 flex justify-center items-center flex-col'>
          {/* <HiOutlineUserCircle size={70} /> */}
          <Avatar width={70} height={70} name={location?.state?.name} imageUrl={location?.state?.profile_pic}/>
          <h2 className='font-semibold text-lg mt-1'>{location?.state?.name}</h2>
        </div>
        <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>

          <div className='flex flex-col gap-1'>
            <label htmlFor='email'>Password :</label>
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

          <button className='bg-secondary text-lg px-4 py-1 rounded mt-3 font-bold text-white leading-relaxed tracking-wide'>
            Login
          </button>
        </form>
        <p className='my-3 text-center'><Link to={'/forgot-password'} className='hover:text-secondary font-semibold'>Forgot Password ? </Link></p>
      </div>
    </div>
  )
}

export default CheckPasswordPage
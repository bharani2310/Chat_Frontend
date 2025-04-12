import React, { useEffect } from 'react'
import Message from '../component/message'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../utils/config'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { logout, setUser,setOnlineUser, setSocketConnection } from '../redux/userSlice'
import SideBar from '../component/sideBar'
import logo2 from '../assets/logo2.png'
import io from 'socket.io-client'


const Home = () => {
  const registerUrl=`${BASE_URL}/chat/user-details`
  const user=useSelector(state=>state.user)
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate=useNavigate()

  console.log("Sender Details ",user)


  const fetchUserDetails=async()=>{
    try {
      const response=await axios({
        url:registerUrl,
        withCredentials:true
      })


      dispatch(setUser(response?.data?.data))

      if(response.data.data.logout){
        dispatch(logout())
        navigate('/email')
      }
    } catch (error) {
      
    }
  }

  useEffect(()=>{
    fetchUserDetails()
  },[])

  //Socket Connection
  useEffect(()=>{
    const socketConnection = io(BASE_URL,{
      auth:{
        token:localStorage.getItem('token')
      }
    })

    socketConnection.on('connect', () => {

      dispatch(setSocketConnection(socketConnection))

      socketConnection.on('onlineUser',(data)=>{
        console.log("daata",data)
        dispatch(setOnlineUser(data))
      })

    });



    return ()=>{
      socketConnection.disconnect()
    }
  },[])



  const basePath=location.pathname==='/'
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
        <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
            <SideBar/>
        </section>
        {/* Message Component */}
        <section className={`${basePath && "hidden"}`}>
            {/* <Message/> */}
            <Outlet/>
        </section>
        <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden":"lg:flex"}`}>
          <div>
            <img src={logo2} width={150} alt='logo'/>
          </div>
          <p className='text-lg mt-2 text-slate-500'>Select User to send message</p>
        </div>
    </div>



  )
}

export default Home
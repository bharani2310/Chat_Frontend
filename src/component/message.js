import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { getExistingMessage, getUserDetails } from '../utils/getUserDetails'
import { BsThreeDotsVertical } from "react-icons/bs";
import Avatar from './avatar'
import { FaAngleLeft } from "react-icons/fa6";
import { GoPaperclip } from "react-icons/go";
import { FaRegImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { uploadFile } from '../utils/uploadFile';
import { IoMdClose } from "react-icons/io";
import Spinner from './spinner';
import wallpaper from '../assets/wallpaper.jpg'
import { VscSend } from "react-icons/vsc";
import moment from 'moment'

const Message = () => {
  const params=useParams()
  const socketConnection = useSelector(state=>state?.user?.socketConnection)
  const user = useSelector(state=>state?.user)

  const [open,setOpen]=useState(false)
  const [message,setMessage]=useState({
      text:'',
      imageUrl:'',
      videoUrl:''
  })
  const [allMessage,setAllMessage]=useState([])
  const [loading,setLoading]=useState(false)
  const currentMessage = useRef()
  const triggerRef = useRef(false);


  const [data,setData]=useState({
    name:'',
    email:'',
    profile_pic:'',
    online:false,
    _id:''
})

const handleUploadMedia = () => {
  setOpen(!open)
}

const handleUploadImage = async(e) =>{
  const file=e.target.files[0]
  setLoading(true)

  const uploadPhoto = await uploadFile(file)

  setLoading(false)
  setOpen(false)

  setMessage(prev=>{
    return{
      ...prev,
      imageUrl : uploadPhoto.url
    }
  })
}

const handleUploadVideo = async(e) =>{
  const file=e.target.files[0]
  setLoading(true)

  const uploadVideo = await uploadFile(file)

  setLoading(false)
  setOpen(false)

  setMessage(prev=>{
    return{
      ...prev,
      videoUrl : uploadVideo.url
    }
  })
}

const clearUploadImage=()=>{
  setMessage(prev=>{
    return{
      ...prev,
      imageUrl : ""
    }
  })
}

const clearUploadVideo=()=>{
  setMessage(prev=>{
    return{
      ...prev,
      videoUrl : ""
    }
  })
}

const handleOnChange=(e)=>{
  const {name,value}=e.target
  setMessage(prev=>{
    return{
      ...prev,
      text:value
    }
  })
}

const handleSubmit=(e)=>{
  e.preventDefault()
  triggerRef.current = true;

  {
    // message.text || message.imageUrl || message.videoUrl
    if(socketConnection){
      socketConnection.emit('new message',{
        sender:user?._id,
        receiver:params?.userId,
        text:message?.text,
        imageUrl:message?.imageUrl,
        videoUrl:message?.videoUrl,
        msgByUserId:user?._id
      })
      setMessage({
        text:'',
        imageUrl:'',
        videoUrl:''
      })
    }
  }
}

useEffect(()=>{
  if(currentMessage.current){
    currentMessage.current.scrollIntoView({behaviour:'smooth',block:'end'})
  }
},[allMessage])

  useEffect(()=>{
    console.log("soc",socketConnection)
    const user=async()=>{
      let resp
      if(params?.userId){
        const response = await getUserDetails(params.userId)
        resp=response
      console.log("1111111111111111111111111111111111111111111111111",response)

        setData(response.data.data)
      }
      if(socketConnection){
        socketConnection.off('message');
        socketConnection.emit('seen',params.userId)
        socketConnection.on('message',(data)=>{

          if(params?.userId===data[data.length-1].sender || triggerRef.current){
            setAllMessage(data)
            triggerRef.current = false; 
          }
        })
      }
      
      
    }
    user()
  },[user,params?.userId])

  useEffect(()=>{
    if(socketConnection){
      socketConnection.emit('seen',params.userId)
    }
  },[allMessage])

  useEffect(() => {
    const getMessage = async () => {
      try {
        if (params.userId && user?._id) {
          const response = await getExistingMessage(user._id,params.userId);
          console.log("Messaggesssssssssss",response)
          setAllMessage(response.data.message); 
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    getMessage();
  }, [params.userId, user,socketConnection]);
  


  return (
    <div style={{background:`url(${wallpaper})`}} className='bg-no-repeat bg-cover'>
      <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
        <div className='flex items-center gap-4'>
          <Link to={'/'} className='lg:hidden'><FaAngleLeft size={25}/></Link>
          <div>
              <Avatar 
              width={45}
              height={45}
              imageUrl={data?.profile_pic}
              name={data?.name}
              userId={data?._id}
              />
          </div>
          <div>
            <h3 className='font-semibold text-xl my-0 text-ellipsis line-clamp-1'>{data?.name}</h3>
            <p className='text-sm -my-1'>{data.online ? <span className=' text-green-300'>Online</span> : <span className=' text-slate-400'>Offline</span>}</p>
          </div>
        </div>

        <div>
          <button className='cursor-pointer hover:text-secondary'>
            <BsThreeDotsVertical/>
          </button>
        </div>
      </header>

      {/* Message Section */}
      <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50'>
        {/* Showing the message */}

        <div className='flex flex-col gap-3 py-2 px-2' ref={currentMessage}>
          {
            
            allMessage.map((msg,index)=>{
              return(
                <div  className={` p-1 py-1 rounded w-fit break-words max-w-md ${user._id===msg.msgByUserId ? "ml-auto bg-teal-100" : "bg-white"}`}>
                  <div className='w-full'>
                    {
                      msg?.imageUrl && (
                        <img src={msg.imageUrl} className='w-full h-full object-scale-down'/>
                      )
                    }

                    {
                      msg?.videoUrl && (
                        <video src={msg.videoUrl} className='w-full h-full object-scale-down' controls/>
                      )
                    }
                  </div>
                  <p className='px-2'>{msg.text}</p>
                  <p className='text-xs ml-auto w-fit'>{moment(msg.createdAt).format('hh:mm')}</p>
                </div>
              )
            })
          }
        </div>

                  {/* Upload Media Display */}
                  {
                  message.imageUrl && (
                    <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                      <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-500' onClick={clearUploadImage}>
                        <IoMdClose size={30}/>
                      </div>
                      <div className='bg-white p-3'>
                        <img src={message.imageUrl}  alt='Uploaded Image' className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'/>
                      </div>
                    </div>
                  )
                }


          {
                  message.videoUrl && (
                    <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                      <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-500' onClick={clearUploadVideo}>
                        <IoMdClose size={30}/>
                      </div>
                      <div className='bg-white p-3'>
                        <video src={message.videoUrl} className='aspect-square w-full h-full max-w-sm m-2 object-scale-down' controls muted autoPlay/>
                      </div>
                    </div>
                  )
                }

                {
                  loading && (
                    <div className='w-full sticky bottom-0 h-full flex justify-center items-center'>
                      <Spinner/>
                    </div>
                  )
                }


      </section>


      {/* Send Message */}
      <section className='h-16 bg-white flex items-center px-4'>
          <div className='relative '>
              <button onClick={handleUploadMedia} className='flex justify-center items-center w-10 h-10 rounded-full hover:bg-secondary hover:text-white'>
                <GoPaperclip size={20}/>
              </button>

              {/* Video and Image */}

              {
                open && (
                  <div className='bg-white shadow rounded absolute bottom-14 w-36 p-2'>
                      <form>
                        <label htmlFor='uploadImage' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                          <div className='text-secondary'>
                            <FaRegImage size={18}/>
                          </div>
                          <p>Image</p>
                        </label>

                        <label htmlFor='uploadVideo' className='flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer'>
                          <div className='text-purple-500'>
                            <FaVideo size={18}/>
                          </div>
                          <p>Video</p>
                        </label>

                        <input type='file' id='uploadImage' className='hidden' onChange={handleUploadImage}/>
                        <input type='file' id='uploadVideo' className='hidden' onChange={handleUploadVideo}/>
                      </form>
                  </div>
                )
              }
              
          </div>

          {/* Input box */}
          <form className='h-full w-full flex gap-2' onSubmit={handleSubmit}>
              <input type='text'
              placeholder='Type here....' 
              className='py-1 px-4 outline-none w-full h-full'
              value={message.text}
              onChange={handleOnChange}/>
              <button className='text-secondary'>
                  <VscSend size={25}/>
              </button>
          </form>

      </section>
    </div>
  )
}

export default Message
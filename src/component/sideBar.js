import React, { useEffect, useState , useRef } from 'react'
import { BsChatHeart } from "react-icons/bs";
import { TiUserAdd } from "react-icons/ti";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AiOutlineLogout } from "react-icons/ai";
import Avatar from './avatar.js'
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './editUserDetails.js';
import { GoArrowUpLeft } from "react-icons/go";
import SearchUser from './SearchUser.js';
import { FaRegImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { logout } from '../redux/userSlice.js';
import toast from 'react-hot-toast';

const SideBar = () => {
    const user = useSelector(state=>state.user)
    const [allUser,setAllUser]=useState([])
    const [openSearchUser,setOpenSearchUser]=useState(false)
    const socketConnection = useSelector(state=>state?.user?.socketConnection)
    const triggerRef = useRef(false);
    let flag=true;
    
    const [editUser,SetEditUser]=useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const prevDataRef = useRef(null);





    useEffect(() => {
        if (socketConnection) {
            console.log("Sidebar user ID:", user?._id);
            socketConnection.emit('sidebar', user?._id);
    
            const handleConversationUpdate = (data) => {
                console.log("Received conversation data:", data);

                const uniqueUsers = data.reduce((acc, conversationUser) => {
                    const otherUser =
                        conversationUser.sender._id === user._id
                            ? conversationUser.receiver
                            : conversationUser.sender;
    
                    if (!acc.some((u) => u.userDetails._id === otherUser._id)) {
                        acc.push({ ...conversationUser, userDetails: otherUser });
                    }
                    return acc;
                }, []);
    
                setAllUser(uniqueUsers);
                console.log("unique",uniqueUsers)
            };
    
            socketConnection.off('conversation'); // Remove previous listener
            socketConnection.on('conversation', handleConversationUpdate);
    
            return () => {
                socketConnection.off('conversation', handleConversationUpdate);
            };
        }
    }, [socketConnection, user]);
    

    useEffect(()=>{
        if(socketConnection){
            socketConnection.emit('sidebar', user?._id); 
        }
    },[socketConnection, user?._id])


    const handleLogout = async() => {
        dispatch(logout())
        navigate('/email')
        localStorage.clear()
        toast.success("Logout Successfull")
    }
    

  return (
    <div className='w-full h-full grid grid-cols-[48px,1fr]'>
        <div className='bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between'>
            <div>
                <NavLink className={({isActive})=>`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${isActive && "bg-slate-200"}`} title='Chat'>
                    <BsChatHeart size={30}/>
                </NavLink>

                <div title='Add Friend' onClick={()=>setOpenSearchUser(true)} className={`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded`}>
                    <TiUserAdd size={30}/>
                </div>
            </div>
            <div>
            <button title={user.name} onClick={()=>SetEditUser(true)} className={`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded`}>
                    <span>
                        <Avatar width={35} height={35} name={user.name} userId={user._id} imageUrl={user.profile_pic}/>
                    </span>
                </button>
                <button title='Logout' className={`w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded`} onClick={handleLogout}>
                    <span>
                        <AiOutlineLogout size={25}/>
                    </span>
                </button>
            </div>
        </div>

        <div className='w-full'>
            <div className='h-16 flex items-center'>
                <h2 className='text-xl font-bold p-4 text-slate-800'>Message</h2>
            </div>
            <div className='bg-slate-200 p-[0.5px]'></div>
            <div className=' h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
                {
                    allUser.length === 0 && (
                        <div className='mt-10'>
                            <div  className='flex justify-center items-center my-4 text-slate-500'>
                                <GoArrowUpLeft size={50}/>
                            </div>
                            <p className='text-lg text-center text-slate-400'>Explore users to start a conversation with .</p>
                        </div>
                    )
                }

                {
                    allUser.map((conv,index)=>{
                        return(
                            <NavLink to={'/'+conv.userDetails._id} key={conv?._id} className='flex items-center gap-2 py-3 px-2 hover:bg-slate-100 cursor-pointer'>
                                <div>
                                    <Avatar
                                    imageUrl={conv?.userDetails?.profile_pic}
                                    name={conv?.userDetails?.name}
                                    width={35}
                                    height={35}/>
                                </div>
                            <div>
                                <h3 className='text-ellipsis line-clamp-1 font-semibold text-base'>{conv?.receiver?.name}</h3>
                                <div className='text-slate-500 text-xs max-w-[150px] flex items-center gap-1'>
                                    <div className='flex items-center gap-1'>
                                        {
                                            conv?.lastMsg?.imageUrl && (
                                                <div  className='flex items-center gap-1'>
                                                    <span><FaRegImage/></span>
                                                </div>
                                            )
                                        }
                                        {
                                            conv?.lastMsg?.videoUrl && (
                                                <div  className='flex items-center gap-1'>
                                                    <span><FaVideo/></span>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <p className='truncate'>{conv?.lastMsg?.text}</p>
                                </div>
                            </div>
                            {
                                Boolean(conv?.unseenMsg) && (
                                    <p className='text-xs w-6 flex justify-center h-6 ml-auto p-1 bg-secondary text-white font-semibold rounded-full'>{conv?.unseenMsg}</p>
                                )
                            }
                            </NavLink>
                        )
                    })
                }
            </div>
        </div>

        {editUser && user && (<EditUserDetails onClose={()=>SetEditUser(false)}/>)}

            {/* Search User */}

            {
                openSearchUser && (
                    <SearchUser onClose={()=>setOpenSearchUser(false)}/>
                )
            }
    </div>
  )
}

export default SideBar



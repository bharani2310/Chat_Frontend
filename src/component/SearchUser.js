import React, { useEffect, useState } from 'react'
import { IoIosSearch } from "react-icons/io";
import Spinner from './spinner';
import UserSearchCard from './UserSearchCard';
import toast from 'react-hot-toast';
import { BASE_URL } from '../utils/config';
import axios from 'axios';
import { IoMdClose } from "react-icons/io";

const SearchUser = ({onClose}) => {
    const [searchUser,setSearchUser]=useState([])
    const [loading,setLoading]=useState(false)
    const [search,setSearch]=useState("")

    const handleSearchUser=async()=>{
        setLoading(true)
        const Url=`${BASE_URL}/chat/search-user`
        try {
            const response=await axios.post(Url,{
                search:search
            })
            setLoading(false)
            setSearchUser(response.data.data)
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }
    useEffect(()=>{
        handleSearchUser()
    },[search])

    console.log("search user",searchUser)
  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 bg-slate-700 bg-opacity-40 p-2 z-10'>
        <div className='w-full max-w-lg mx-auto mt-10'>
            <div className='bg-white rounded h-11 overflow-hidden flex'>
                <input 
                type='text'
                placeholder='Search User by Name , email ,...'
                className='w-full outline-none py-1 h-full px-4'
                onChange={(e)=>setSearch(e.target.value)}
                value={search}/>
                <div className='h-11 w-14 flex justify-center items-center'>
                    <IoIosSearch size={25}/>
                </div>
            </div>

            {/* Display Search User */}

            <div className='bg-white mt-2 w-full p-4 rounded '>
                {/* No User Found */}
                {
                    searchUser.length === 0 && !loading &&(
                        <p className='text-center text-slate-500'>No User Found</p>
                    )
                }
                {
                    loading && (
                        <div><Spinner/></div>
                    )
                }
                {
                    searchUser.length!==0 && !loading && (
                        searchUser.map((user,index)=>{
                            return (
                                <UserSearchCard key={user._id} user={user} onClose={onClose}/>
                            )
                        })
                    )
                }
            </div>
        </div>
        <div className='absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white' onClick={onClose}>
            <button>
                <IoMdClose size={25}/>
            </button>
        </div>
    </div>
  )
}

export default SearchUser
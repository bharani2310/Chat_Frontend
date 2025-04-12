import React from 'react'
import Avatar from './avatar.js'
import { Link } from 'react-router-dom'

const UserSearchCard = ({user,onClose}) => {
  return (
    <Link to={"/"+user._id} onClick={onClose} div className='flex items-center gap-3 p-2 lg:p-4 border border-transparent border-t-slate-200 hover:border hover:border-secondary rounded cursor-pointer'>
      <div>
        <Avatar width={50} height={50} userId={user._id} name={user?.name} imageUrl={user?.profile_pic}/>
      </div>
      <div>
        <div className='font-semibold text-ellipsis line-clamp-1'>
          {user?.name}
        </div>
        <p className='text-sm text-ellipsis line-clamp-1'>{user?.email}</p>
      </div>
    </Link>
  )
}

export default UserSearchCard
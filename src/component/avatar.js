import React, { useMemo } from 'react';
import { HiOutlineUserCircle } from "react-icons/hi2";
import { useSelector } from 'react-redux';

const Avatar = ({ userId, name, imageUrl, width, height }) => {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);
  
  let avatarName = "";
  if (name) {
    const splitName = name.split(" ");
    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0];
    } else {
      avatarName = splitName[0][0];
    }
  }

  const bgColor = [
    'bg-slate-200',
    'bg-teal-200',
    'bg-red-200',
    'bg-green-200',
    'bg-yellow-200',
    'bg-gray-200',
    'bg-cyan-200',
    'bg-sky-200',
    'bg-blue-200',
  ];
  const random = useMemo(() => Math.floor(Math.random() * 9), []);
  const isOnline = onlineUser.includes(userId);

  return (
    <div
      style={{ width: width + 'px', height: height + 'px' }}
      className="relative"
    >
      {/* Avatar Image or Initials */}
      <div
        className={`overflow-hidden rounded-full font-bold flex justify-center items-center text-lg ${bgColor[random]}`}
        style={{
          width: width + 'px',
          height: height + 'px',
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            width={width}
            height={height}
            alt={name}
            className="rounded-full object-cover"
          />
        ) : name ? (
          <div className="flex justify-center items-center w-full h-full">
            {avatarName}
          </div>
        ) : (
          <HiOutlineUserCircle size={width} />
        )}
      </div>

      {/* Online Status Indicator */}
      {isOnline && (
        <div
          className="bg-green-600 p-1 absolute bottom-0.5 right-0.5 z-10 rounded-full"
          style={{
            width: '9px', 
            height: '9px',
          }}
        ></div>
      )}
    </div>
  );
};

export default Avatar;

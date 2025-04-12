import React from 'react'
import logo from '../assets/logo.png'
const AuthLayouts = ({children}) => {
  return (
    <>
        <header className='flex justify-center items-center py-3 h-20 shadow-md bg-white'>
            <img src={logo} alt='logo' width={60} />Chat
        </header>

        {children}
    </>
  )
}

export default AuthLayouts
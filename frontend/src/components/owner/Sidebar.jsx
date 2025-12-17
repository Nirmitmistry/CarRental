import React, { useState } from 'react';
import { assets, ownerMenuLinks } from '../../assets/assets.js';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const {user,axios, fetchUser } = useAppContext();
  const location = useLocation();
  const [image, setImage] = useState('');

  const updateImage = async () => {
    try {
      const formData= new FormData()
      formData.append('image',image)
      const { data }=await axios.post('/api/owner/update-image',formData)
      if(data.success){
        fetchUser();
        toast.success(data.message);
        setImage('')
      }else{
        toast.error(data.message)
      }
      } catch (error) {
      toast.error(error.message)
      }
  };

  return (
    <div className='relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm'>

      {/* Profile Image with Edit Icon on Hover */}
      <div className='relative group w-fit mx-auto'>
        <label htmlFor='image' className='cursor-pointer block'>
          <img
            src={image ? URL.createObjectURL(image) : user.image || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300"}
            alt="User"
            className='h-14 w-14 rounded-full object-cover'
          />
          <input
            type="file"
            id='image'
            accept="image/*"
            hidden
            onChange={e => setImage(e.target.files[0])}
          />

          {/* Hover Overlay with Edit Icon */}
          <div className='absolute inset-0 bg-black/40 rounded-full hidden group-hover:flex items-center justify-center transition-opacity duration-200'>
            <img src={assets.edit_icon} alt="Edit" className='w-5 h-5' />
          </div>
        </label>
      </div>

      {/* Save button if new image selected */}
      {image && (
        <button
          className='absolute top-2 right-2 flex items-center gap-1 p-2 bg-primary/10 text-primary text-xs rounded hover:bg-primary/20 transition'
          onClick={updateImage}
        >
          Save <img src={assets.edit_icon} width={13} alt='Edit icon' />
        </button>
      )}

      {/* Username */}
      <p className='mt-2 text-base max-md:hidden'>{user?.name || "Owner"}</p>

      {/* Sidebar Menu Links */}
      <div className='w-full'>
        {ownerMenuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${
              link.path === location.pathname
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600'
            }`}
          >
            <img
              src={link.path === location.pathname ? link.coloredIcon : link.icon}
              alt={`${link.name} icon`}
            />
            <span className='max-md:hidden'>{link.name}</span>
            {link.path === location.pathname && (
              <div className='bg-primary w-1.5 h-8 rounded-l right-0 absolute'></div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

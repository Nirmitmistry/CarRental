import React from 'react'
import { assets } from '../assets/assets'
import {motion} from 'motion/react'

const Footer = () => {
  return (
     <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }} className='px-6 md:px-16 lg:px-24 xl:px-32 mt-60 text-sm text-gray-500'>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }} className='flex flex-wrap justify-between items-start gap-8 pb-6 border-borderColor' >
                <div >
                    <motion.img 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }} src={assets.logo1} alt="logo" className=' h-8 md:h-9' />
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }} className='max-w-80 mt-3'>
                        Premium car rental service with a wide selction of Luxury and everyday vehicels for all your driving needs.
                    </motion.p>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }} className='flex items-center gap-3 mt-6'>
                        <a href="#"> <img src={assets.facebook_logo} className='w-5 h-5' alt="" /> </a>
                        <a href="#"> <img src={assets.instagram_logo} className='w-5 h-5' alt="" /> </a>
                        <a href="#"> <img src={assets.twitter_logo} className='w-5 h-5' alt="" /> </a>
                        <a href="#"> <img src={assets.gmail_logo} className='w-5 h-5' alt="" /> </a>
                    </motion.div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}

                className='flex flex-wrap justify-between w-1/2 gap-8'>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Quick Links</h2>
                    <ul className='mt-3 flex flex-col gap-1.5 text-sm'>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Browse cars</a></li>
                        <li><a href="#">List you car</a></li>
                        <li><a href="#">About US</a></li>
                    </ul>
                </motion.div>
                
                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Resources</h2>
                    <ul className='mt-3 flex flex-col gap-1.5 text-sm'>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Terms of service</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Insurance</a></li>
                    </ul>
                </div>
                
                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Contact</h2>
                    <ul className='mt-3 flex flex-col gap-1.5 text-sm'>
                        <li>1234 </li>
                        <li>Mumbai,MH 400 091</li>
                        <li>+91 2345365433</li>
                        <li>luxurydrive4@gmail.com</li>
                    </ul>
                </div>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                 className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                <p>© {new Date().getFullYear()} Brand. All rights reserved.</p>
                <ul className='flex items-center gap-4'>
                    <li><a href="#">Privacy</a><span>|</span></li>
                    <li><a href="#">Terms</a><span>|</span></li>
                    <li><a href="#">Sitemap</a></li>
                </ul>
            </motion.div>
        </motion.div>
  )
}

export default Footer
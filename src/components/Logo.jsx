import { Link } from 'react-router'
import logo from '@/assets/logo-url-shortener-128.png'

function Logo() {
  return (
    <Link to="/" className='flex items-center gap-2 font-semibold'>
        {/* 128px image shown at 24px, stays sharp on retina screens */}
        <img src={logo} alt="" className='size-6' />
        Url Shortener
    </Link>
  )
}

export default Logo

import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useIsSignIn, useUserID } from '../../store/useUser'
import Logo from './logo.png'
import Notification from './notification-icon.png'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const userID = useUserID((state) => state.userID)
  const setUserID = useUserID((state) => state.setUserID)
  const isSignIn = useIsSignIn((state) => state.isSignIn)
  const setIsSignIn = useIsSignIn((state) => state.setIsSignIn)

  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const handleItemHover = (item: string): void => {
    setHoveredItem(item)
  }

  const handleItemLeave = (): void => {
    setHoveredItem(null)
  }

  useEffect(() => {}, [userID])

  return (
    <div className='flex justify-between bg-white pl-8 pr-8'>
      <div className='flex h-16 items-center'>
        <Link to='/'>
          <img src={Logo} alt='Logo' />
        </Link>
        <Link className='ml-2 cursor-pointer text-2xl font-bold italic' to='/'>
          Ski Run Map
        </Link>
        <div className='relative ml-8 flex h-full items-center gap-8 text-lg font-bold'>
          <div className='h-full' onMouseLeave={handleItemLeave}>
            <NavItem
              name='Explore'
              url='/'
              isHovered={hoveredItem === 'Explore'}
              onMouseEnter={() => handleItemHover('Explore')}
            />
            {hoveredItem === 'Explore' && (
              <SubNavItem items={[{ name: 'Niseko Ski Resort', url: '/' }]} />
            )}
          </div>

          <div className='h-full' onMouseLeave={handleItemLeave}>
            <NavItem
              name='Route'
              url='/route'
              isHovered={hoveredItem === 'Route'}
              onMouseEnter={() => handleItemHover('Route')}
            />
            {hoveredItem === 'Route' && (
              <SubNavItem
                items={[
                  { name: 'View Route', url: '/route' },
                  { name: 'Create Route', url: '/edit-route' }
                ]}
              />
            )}
          </div>

          <div className='h-full' onMouseLeave={handleItemLeave}>
            <NavItem
              name='Member'
              url='/member'
              isHovered={hoveredItem === 'Member'}
              onMouseEnter={() => handleItemHover('Member')}
            />
            {hoveredItem === 'Member' && (
              <SubNavItem
                items={[
                  { name: 'My Page', url: '/member' },
                  { name: 'My Friend', url: '/friend' }
                ]}
              />
            )}
          </div>
        </div>
      </div>
      <div className='flex items-center'>
        {isSignIn && <p className='pr-2'>Hi, username</p>}
        <img className='mr-2 h-auto w-6' src={Notification} alt='Notification icon' />
        {isSignIn ? (
          <button
            className='h-fit w-fit rounded-2xl bg-zinc-300 pl-4 pr-4 text-lg font-bold'
            onClick={() => {
              setIsSignIn(false)
              setUserID('')
              toast.success('Log out successed!', {
                position: 'top-right',
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: 'light'
              })
              navigate('/')
            }}
          >
            Log out
          </button>
        ) : (
          <Link
            className='h-fit w-fit rounded-2xl bg-zinc-300 pl-4 pr-4 text-lg font-bold'
            to='/signin'
          >
            Log in
          </Link>
        )}
      </div>
    </div>
  )
}

interface NavItemProps {
  name: string
  url: string
  isHovered: boolean
  onMouseEnter: () => void
}

const NavItem: React.FC<NavItemProps> = ({ name, isHovered, url, onMouseEnter }) => {
  return (
    <Link
      className={`flex h-full transform items-center focus:outline-none ${
        isHovered ? 'translate-y-[-2px]' : 'translate-y-0'
      } transition-transform duration-200`}
      to={url}
      onMouseEnter={onMouseEnter}
    >
      {name}
    </Link>
  )
}

interface SubNavItemProps {
  items: Array<{ name: string; url: string }>
}

const SubNavItem: React.FC<SubNavItemProps> = ({ items }) => {
  return (
    <div className='absolute top-14 flex flex-col rounded-md bg-white p-2 font-normal shadow-lg'>
      {items.map(({ name, url }, index) => (
        <Link
          key={index}
          to={url}
          className='bg-grey-700 w-max rounded-md pl-2 pr-2 hover:bg-zinc-100'
        >
          {name}
        </Link>
      ))}
    </div>
  )
}

export default Header

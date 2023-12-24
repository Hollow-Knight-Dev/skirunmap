import { useEffect } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useUserStore } from '../../store/useUser'
import showToast from '../showToast'

const ProtectedRoute: React.FC = () => {
  const { userDoc, isLoadedPage, isSignIn } = useUserStore()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('ProtectedRoute isLoadedPage:', isLoadedPage)
    console.log('ProtectedRoute isSignIn:', isSignIn)
  }, [navigate])

  if (isLoadedPage && !isSignIn) {
    showToast('warn', 'Please sign in first')
    return <Navigate to='/signin' />
  } else if (isLoadedPage && isSignIn && userDoc.userFinishedInfo === false) {
    showToast('warn', "You haven't finish your profile.")
    return <Navigate to='/member-info' />
  }
  return <Outlet /> // Outlet is used to render the child routes
}

export default ProtectedRoute

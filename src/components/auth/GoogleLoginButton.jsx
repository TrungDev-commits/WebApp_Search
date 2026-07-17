import { GoogleLogin } from '@react-oauth/google'
import { api } from '../../services/api'
import useAuthStore from '../../stores/useAuthStore'
import toast from 'react-hot-toast'

export default function GoogleLoginButton() {
  const setUser = useAuthStore((s) => s.setUser)

  const handleSuccess = async (credentialResponse) => {
    try {
      const data = await api.verifyGoogleToken(credentialResponse.credential)
      setUser(data.user, data.token)
      toast.success('Đăng nhập thành công!')
    } catch (err) {
      toast.error(err.message || 'Đăng nhập thất bại')
    }
  }

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error('Đăng nhập thất bại')}
        theme="outline"
        size="large"
        shape="pill"
        text="signin_with"
        width="280"
      />
    </div>
  )
}

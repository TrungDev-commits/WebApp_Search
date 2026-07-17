import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      containerClassName="!top-4 lg:!left-[16rem] lg:!top-6"
      toastOptions={{
        duration: 2500,
        style: {
          background: '#fff',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          fontSize: '14px',
          fontWeight: 500,
          padding: '12px 16px',
          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
        },
        success: {
          iconTheme: { primary: '#0D9488', secondary: '#fff' },
        },
        error: {
          iconTheme: { primary: '#EF4444', secondary: '#fff' },
        },
      }}
    />
  )
}

import { Outlet } from "react-router"
import Navbar from "./Navbar"

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-nexora-bg text-nexora-text">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
        Copyright {new Date().getFullYear()} Nexora. Tum haklari saklidir.
      </footer>
    </div>
  )
}

export default MainLayout

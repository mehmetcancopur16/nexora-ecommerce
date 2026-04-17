import Footer from "./Footer"
import { Outlet } from "react-router"
import Navbar from "./Navbar"

function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-nexora-bg text-nexora-text">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout

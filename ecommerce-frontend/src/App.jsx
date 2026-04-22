import { useEffect } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import AdminRoute from "./components/layout/AdminRoute"
import MainLayout from "./components/layout/MainLayout"
import ProtectedRoute from "./components/layout/ProtectedRoute"
import AdminLayout from "./pages/admin/AdminLayout"
import AdminOrders from "./pages/admin/AdminOrders"
import AdminProducts from "./pages/admin/AdminProducts"
import AdminUsers from "./pages/admin/AdminUsers"
import Dashboard from "./pages/admin/Dashboard"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import OrderSuccess from "./pages/OrderSuccess"
import ProductDetail from "./pages/ProductDetail"
import Products from "./pages/Products"
import Register from "./pages/Register"
import StaticPage from "./pages/StaticPage"
import Support from "./pages/Support"
import AccountSettings from "./pages/profile/AccountSettings"
import Addresses from "./pages/profile/Addresses"
import Notifications from "./pages/profile/Notifications"
import OrderDetail from "./pages/profile/OrderDetail"
import OrderHistory from "./pages/profile/OrderHistory"
import PaymentMethods from "./pages/profile/PaymentMethods"
import ProfileLayout from "./pages/profile/ProfileLayout"
import Wishlist from "./pages/profile/Wishlist"
import { useAuthStore } from "./store/authStore"

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success/:id" element={<OrderSuccess />} />
          <Route path="iade-politikasi" element={<StaticPage pageKey="returns" />} />
          <Route path="teslimat" element={<StaticPage pageKey="shipping" />} />
          <Route path="gizlilik" element={<StaticPage pageKey="privacy" />} />
          <Route path="destek" element={<Support />} />

          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<ProfileLayout />}>
              <Route index element={<AccountSettings />} />
              <Route path="orders" element={<OrderHistory />} />
              <Route path="orders/:id" element={<OrderDetail />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="addresses" element={<Addresses />} />
              <Route path="payment-methods" element={<PaymentMethods />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="security" element={<Navigate to="/profile" replace />} />
              <Route path="returns" element={<Navigate to="/profile/orders?tab=returns" replace />} />
            </Route>
          </Route>

          <Route path="profile/*" element={<Navigate to="/profile" replace />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

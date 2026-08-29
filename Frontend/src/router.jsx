import { createBrowserRouter } from "react-router-dom";

import MainLayout from "./layouts/MainLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";

// Public pages
import HomePage from "./pages/public/HomePage.jsx";
import ProductsPage from "./pages/public/ProductsPage.jsx";
import ProductDetailsPage from "./pages/public/ProductDetailsPage.jsx";
import CartPage from "./pages/public/CartPage.jsx";
import WishlistPage from "./pages/public/WishlistPage.jsx";
import CheckoutPage from "./pages/public/CheckoutPage.jsx";
import OrderSuccessPage from "./pages/public/OrderSuccessPage.jsx";
import MyOrdersPage from "./pages/public/MyOrdersPage.jsx";
import AboutPage from "./pages/public/AboutPage.jsx";
import ContactPage from "./pages/public/ContactPage.jsx";
import NotFoundPage from "./pages/public/NotFoundPage.jsx";

// Auth pages
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage.jsx";

// Admin pages
import DashboardPage from "./pages/admin/DashboardPage.jsx";
import CategoriesListPage from "./pages/admin/CategoriesListPage.jsx";
import CategoryAddPage from "./pages/admin/CategoryAddPage.jsx";
import CategoryEditPage from "./pages/admin/CategoryEditPage.jsx";
import ProductsListPage from "./pages/admin/ProductsListPage.jsx";
import ProductAddPage from "./pages/admin/ProductAddPage.jsx";
import ProductEditPage from "./pages/admin/ProductEditPage.jsx";
import ProductViewPage from "./pages/admin/ProductViewPage.jsx";
import OrdersListPage from "./pages/admin/OrdersListPage.jsx";
import OrderViewEditPage from "./pages/admin/OrderViewEditPage.jsx";
import CustomersListPage from "./pages/admin/CustomersListPage.jsx";
import CustomerAddPage from "./pages/admin/CustomerAddPage.jsx";
import CustomerEditPage from "./pages/admin/CustomerEditPage.jsx";
import CustomerViewPage from "./pages/admin/CustomerViewPage.jsx";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductsPage /> },
      { path: "/products/:id", element: <ProductDetailsPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/wishlist", element: <WishlistPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/contact", element: <ContactPage /> },

      // Everything below requires login — ProtectedRoute redirects to
      // /auth/login and remembers where the user was headed.
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/checkout", element: <CheckoutPage /> },
          { path: "/order-success", element: <OrderSuccessPage /> },
          { path: "/my-orders", element: <MyOrdersPage /> },
        ],
      },
    ],
  },

  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot", element: <ForgotPasswordPage /> },
    ],
  },

  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },

          { path: "categories", element: <CategoriesListPage /> },
          { path: "categories/add", element: <CategoryAddPage /> },
          { path: "categories/:id/edit", element: <CategoryEditPage /> },

          { path: "products", element: <ProductsListPage /> },
          { path: "products/add", element: <ProductAddPage /> },
          { path: "products/:id", element: <ProductViewPage /> },
          { path: "products/:id/edit", element: <ProductEditPage /> },

          { path: "orders", element: <OrdersListPage /> },
          { path: "orders/:id", element: <OrderViewEditPage /> },

          { path: "customers", element: <CustomersListPage /> },
          { path: "customers/add", element: <CustomerAddPage /> },
          { path: "customers/:id", element: <CustomerViewPage /> },
          { path: "customers/:id/edit", element: <CustomerEditPage /> },
        ],
      },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);

export default router;

import React, { lazy } from 'react';
import Reviews from '../pages/Reviews';


const Home = lazy(() => import('../pages/CardView'));
const Login = lazy(() => import('../pages/Login'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Setting = lazy(() => import('../pages/Setting'));
const AddProfile = lazy(() => import('../pages/AddProfile'));
const PriceCatalog = lazy(() => import('../pages/PriceCatalog'));
const Locations = lazy(() => import('../pages/Locations'));
const Statistic = lazy(() => import('../pages/Statistics'));
const Categories = lazy(() => import('../pages/Categories'));
const Posts = lazy(() => import('../pages/Posts'));
const Contacts=lazy(()=>import('../pages/Contacts'));
const AddUser=lazy(()=>import('../pages/crud/AddUser'));
const Home1=lazy(()=>import('../pages/crud/index'));

const authRoutes = [
  { path: '/signup', element: <Login /> },
  { path: '/', element: <Login /> },
  { path: '/forgotPassword', element: <ForgotPassword /> },
  { path:'/add',element:<AddUser/>},
  { path:'/home',element:<Home1/>},
  { path:'/update/:id',element:<AddUser/>},
  { path:'/view/:id',element:<Home1/>}
  
]



const dashboardRoutes = [
  { path: 'post', element:<Posts/>},
  { path: 'category', element: <Categories/> },
  { path: '/statistics', element: <Statistic/>},
  { path: '/pricecatalog', element: <PriceCatalog/>},
  { path: '/addprofile', element: <AddProfile/>},
  { path: '/profile', element: <Dashboard/>},
  { path: '/setting', element: <Setting/>},
  { path: '/city', element: <Locations/>},
  { path: '/updateprofile/:id',element:<AddProfile/>},
  { path: '/review', element: <Reviews /> },
  { path: '/home', element: <Home /> },
  {path:'/contact',element:<Contacts/>}

];

export { authRoutes,dashboardRoutes};

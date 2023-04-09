import './App.scss'
import { Routes, Route } from 'react-router-dom'
import React, { Suspense, createContext, useState } from 'react'
import loaderImg from './assets/images/logo.svg'
import NonAuthLayout from './components/NonAuthLayout'
import DashBoardLayout from './components/DashBoardLayout'
import { authRoutes, dashboardRoutes } from './routes/allRoutes'
import Loader from './components/Loader'
// export const appContext = createContext()
export const AppContext = createContext()
const App = props => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [cityWithStatus, setCityWithStatus] =useState([]);
  const [loading,setLoading]=useState(false)

  const value = { activeMenu, setActiveMenu, cityWithStatus, setCityWithStatus, setLoading, loading }

  function getLayout(element, layout) {
    if (layout === 'NonAuthLayout') {
      return <NonAuthLayout element={element} />
    }
    return <DashBoardLayout element={element} />
  }

  return (
      <React.Fragment>
 {        <AppContext.Provider
          value={value}>
          <Suspense
            fallback={
                        <div className='loader'>

                          <Loader/>
                          </div>

            }
          >
            <Routes>
              {authRoutes.map((route, idx) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={getLayout(route.element, 'NonAuthLayout')}
                />
              ))}

              {dashboardRoutes.map((route, idx) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={getLayout(route.element, 'DashboardLayout')}
                />
              ))}
            </Routes>
          </Suspense>
        </AppContext.Provider> }
       
        
              </React.Fragment>
  )
}

export default App

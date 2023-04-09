import { Suspense } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

function withRouter (Component) {
  function ComponentWithRouterProp (props) {
    let location = useLocation()
    let navigate = useNavigate()
    let params = useParams()
    return <Component {...props} router={{ location, navigate, params }} />
  }
  return ComponentWithRouterProp
}

function NonAuthLayout (props) {
  if (localStorage.getItem('authorization')) {
    return (
      <Suspense fallback={null}>
        <Navigate
          to={{ pathname: '/profile', state: { from: props.location } }}
        />
      </Suspense>
    )
  }

  return <div className='wrapper'>{props.element}</div>
}
export default withRouter(NonAuthLayout)

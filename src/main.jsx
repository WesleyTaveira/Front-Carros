import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Login'
import Cadastro from './pages/CadastroUsuario'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Carros from './pages/HomeCarros'
import { PrivateRoute } from './components/privateRoute'
import Marcas from './pages/HomeMarcas'

const router = createBrowserRouter([{
  path: "/",
  element: <Login/>
},
{
  path: "/cadastro",
  element: <Cadastro/>
},
{
  path: "/carros",
  element: (<PrivateRoute>
    < Carros/>
    </PrivateRoute>)
},

{
  path: "/carros/marcas",
  element: (<PrivateRoute>
    < Marcas/>
    </PrivateRoute>)
}
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)

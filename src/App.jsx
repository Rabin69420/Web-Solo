import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Homepage from './Pages/Homepage'
import LoginPage from './Pages/Loginpage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './Pages/SignUp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage></Homepage>}> 
        </Route>

        <Route path='/login' element={<LoginPage></LoginPage>}> 
        </Route>


        <Route path='/signup' element={<Signup></Signup>}> 
        </Route>

      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

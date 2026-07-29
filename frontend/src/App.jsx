import React from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import { Show, useAuth } from '@clerk/react'
import MyResultPage from './pages/MyResultPage'

const App = () => {
  const {isLoaded}=useAuth();
  if (!isLoaded) return null;
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/result" element={
          <>
          <Show when="signed-in">
            <MyResultPage/>
          </Show>

          <Show when="signed-out">
            <Navigate to='/'/>
          </Show>
          </>
        }/>
      </Routes>
    </div>
  )
}

export default App

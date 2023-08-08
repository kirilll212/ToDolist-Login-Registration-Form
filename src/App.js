import React from 'react'
import  { BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './components/authForm/Login'
import Sigup from './components/authForm/Signup'
import Password from './components/authForm/password'
import NewTodoList from './components/NewTodoList'

function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path='/' element = {<Login />}></Route>
        <Route path='/Signup' element = {<Sigup />}></Route>
        <Route path='/password' element = {<Password />}></Route>
        <Route path='/NewTodoList' element = {<NewTodoList />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
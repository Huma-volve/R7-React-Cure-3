import { Outlet } from "react-router-dom"
import Navbar from "./components/reusable/Navbar"

export default function App() {

  return (
    <main className='mx-5 my-5'>
      <Navbar/>
      <Outlet />
    </main>
  )
}

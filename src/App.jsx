import './App.css';
import Home from './pages/Home';
import { Route, Routes } from "react-router-dom";
import MagicEden from './pages/MagicEden';
import Navbar from './component/Navbar';

function App() {
  return (
    <div className="">
    <Navbar />
    <Routes>

       <Route path='/' element={ <Home />} />
       <Route path='/magic' element={ <MagicEden />} />
    </Routes>
    
    </div>
  );
}

export default App;

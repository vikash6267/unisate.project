import './App.css';
import Home from './pages/Home';
import { Route, Routes } from "react-router-dom";
import MagicEden from './pages/MagicEden';

function App() {
  return (
    <div className="">
    <Routes>

       <Route path='/' element={ <Home />} />
       <Route path='/magic' element={ <MagicEden />} />
    </Routes>
    
    </div>
  );
}

export default App;

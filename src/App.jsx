import './App.css';
import Home from './Components/Common/Home/Home';
import Login from './Components/Common/Login/Login';
import {Routes,Route} from "react-router-dom";
function App() {
  return (
    <div className="App">
    <Routes>
<Route exact path="/" element={<Login/>} />
<Route path="/home" element={<Home/>}  />
    </Routes>
    </div>
  );
}

export default App;

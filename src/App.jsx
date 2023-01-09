import './App.css';
import Home from './Components/Common/Home/Home';
import Login from './Components/Common/Login/Login';
import {Routes,Route} from "react-router-dom";
import ProcedureAndPackage from './Components/ProcedureAndPackage/ProcedureAndPackage';
import OPDVisit from './Components/OPD/OPDVisit';
function App() {
  return (
    <div className="App">
    <Routes>
<Route exact path="/" element={<Login/>} />
<Route path="/home" element={<Home/>}  />
<Route path="/procedureandpackage" element={<ProcedureAndPackage/>}/>
<Route path="/OPDVisit" element={<OPDVisit/>}/>
    </Routes>
    </div>
  );
}

export default App;

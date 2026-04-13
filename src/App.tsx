import { Route, Routes } from 'react-router-dom';
import { Authorization } from './components/authorization';
import { Registration } from './components/registration';
import { RestorePassword } from './components/restorePassword';

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Authorization />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/restore" element={<RestorePassword />} />
      </Routes>
    </div>
  );
}

export default App;

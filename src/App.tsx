import { Route, Routes } from 'react-router-dom';
import { Authorization } from './components/authorization';
import { Registration } from './components/registration';
import { RestorePassword } from './components/restorePassword';
import { ResetPassword } from './components/resetPassword';

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<Authorization />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/restore" element={<RestorePassword />} />
        <Route path="/reset" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;

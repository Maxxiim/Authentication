import { Authorization } from './components/authorization';
import { Route, Routes } from 'react-router-dom';
import { Registration } from './components/registration';

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/login" element={<Authorization />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
    </div>
  );
}

export default App;

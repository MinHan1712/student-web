import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import routes from './router';
import AppLayout from './pages/AppLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>

          {routes.map((route, index) =>
            route.index ? (
              <Route index key={index} element={route.element} path={route.path} />
            ) : (
              <Route
                index={route.index}
                path={route.path}
                key={index}
                element={route.element}
              />
            )
          )}
        </Route>
      </Routes>

    </BrowserRouter>
  );
}

export default App;

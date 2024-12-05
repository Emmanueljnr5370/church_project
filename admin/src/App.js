import { useRoutes } from "react-router-dom";
import Themeroutes from "./routes/Router";
import { ToastContainer } from 'react-toastify';
import {UserProvider} from "./context/Context";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const routing = useRoutes(Themeroutes);

  return (
    <div className="dark">
      <UserProvider>
        {routing}
        <ToastContainer />
      </UserProvider>
    </div>
  )
};

export default App;

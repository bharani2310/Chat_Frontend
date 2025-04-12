import { createHashRouter } from "react-router-dom";
import CheckEmailPage from "../pages/checkEmailPage";
import RegisterPage from "../pages/registerPage";
import CheckPasswordPage from "../pages/checkPasswordPage";
import Home from "../pages/home";
import Message from "../component/message";
import App from "../App";
import AuthLayouts from "../layout";
import ForgotPassword from "../pages/forgotPassword";

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'register',
        element: <AuthLayouts><RegisterPage /></AuthLayouts>
      },
      {
        path: 'email',
        element: <AuthLayouts><CheckEmailPage /></AuthLayouts>
      },
      {
        path: 'password',
        element: <AuthLayouts><CheckPasswordPage /></AuthLayouts>
      },
      {
        path: 'forgot-password',
        element: <AuthLayouts><ForgotPassword/></AuthLayouts>
      },
      {
        path: '/',
        element: <Home />,
        children: [
          {
            path: ':userId',  // This will match any path like /12345
            element: <Message />
          }
        ]
      }
    ]
  }
]);

export default router;

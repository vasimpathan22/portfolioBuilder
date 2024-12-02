import { useNavigate, useLocation } from "react-router-dom";

export const WithNavigation = (Component) => {
  return (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    return <Component {...props} navigate={navigate} location={location} />;
  };
};

import React, { ComponentType } from "react";
import {
  useNavigate,
  NavigateFunction,
  Location,
  useLocation,
} from "react-router-dom";

interface WithNavigationProps {
  navigate?: NavigateFunction;
  location?: Location;
}

export const WithNavigation = <P extends object>(
  WrappedComponent: ComponentType<P & WithNavigationProps>
) => {
  const ComponentWithNavigation: React.FC<P> = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    return (
      <WrappedComponent {...props} navigate={navigate} location={location} />
    );
  };

  return ComponentWithNavigation;
};

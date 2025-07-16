import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const CallRouteGuard = ({ children }) => {
  const callInitiator = useSelector((state) => state.call.callInitiator);

  if (!callInitiator.isHost && !callInitiator.personalCode) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default CallRouteGuard;

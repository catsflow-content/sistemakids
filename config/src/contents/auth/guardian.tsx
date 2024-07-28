import React, { useEffect, useState, ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../pages/loader";
import { verifyToken } from "../../utils/verify";

interface AuthenticationGuardProps {
  component: ComponentType<any>;
  [key: string]: any;
}

const AuthenticationGuard: React.FC<AuthenticationGuardProps> = ({ component: Component, ...rest }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const isValid = await verifyToken();

      if (isValid) {
        setIsLoading(false);
      } else {
        navigate("/login");
      }
    };

    checkToken().catch((error) => {
      console.error('Erro ao verificar o token:', error);
      navigate("/login");
    });
  }, [navigate]);

  return isLoading ? <Loader /> : <Component {...rest} />;
};

export default AuthenticationGuard;
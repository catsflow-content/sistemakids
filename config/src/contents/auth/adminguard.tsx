
import React, { useEffect, useState, ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../pages/loader";
import { verifyToken, verifyPermission } from '../../utils/verify'; 

interface AdminGuardProps {
  component: ComponentType<any>; 
  [key: string]: any; 
}

const AdminGuard: React.FC<AdminGuardProps> = ({ component: Component, ...rest }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      const isTokenValid = await verifyToken();
      if (!isTokenValid) {
        navigate("/login");
        return;
      }

      try {
        const permission = await verifyPermission();
        if (permission !== "administrador") {
          navigate("/err/403");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Erro ao verificar permissão:", error);
        navigate("/login");
      }
    };

    checkAccess().catch((error) => {
      console.error('Erro ao verificar o token ou permissão:', error);
      navigate("/login");
    });
  }, [navigate]);

  return isLoading ? <Loader /> : <Component {...rest} />;
};

export default AdminGuard;

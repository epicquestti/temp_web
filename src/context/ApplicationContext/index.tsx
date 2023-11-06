import { FC, ReactNode, createContext, useContext, useState } from "react";
import {
  applicationContextProperties,
  user,
} from "./applicationContextProperties";

const applicationContextDefaultValues: applicationContextProperties = {
  usuario: undefined,
  login(u) {},
  logout() {},
  getToken() {
    return "";
  },
};

const ApplicationContext = createContext<applicationContextProperties>(
  applicationContextDefaultValues
);

export function useApplicationContext(): applicationContextProperties {
  return useContext(ApplicationContext);
}

const ApplicationContextControll: FC<{ children?: ReactNode }> = ({
  ...props
}) => {
  const [usuario, setUsuario] = useState<user | undefined>(undefined);

  const login = (u: user) => {
    setUsuario(u);
  };

  const logout = () => {
    setUsuario(undefined);
  };

  const getToken = (): string => {
    if (!usuario) throw new Error("Usuário ausente.");
    return usuario.token;
  };

  //-->

  const value: applicationContextProperties = {
    usuario,
    login,
    logout,
    getToken,
  };

  return (
    <ApplicationContext.Provider value={value}>
      {props.children}
    </ApplicationContext.Provider>
  );
};

export default ApplicationContextControll;

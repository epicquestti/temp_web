/* eslint-disable react-hooks/exhaustive-deps */
import appConfig from "@/config/appConfig";
import { defaultResponse } from "@/lib/fetchApi/fetchApiProperties";
import axios, { AxiosResponse } from "axios";
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useCookies } from "react-cookie";
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
  const [cookie, setCookie, removeCookie] = useCookies([appConfig.identifier]);
  const [usuario, setUsuario] = useState<user | undefined>(undefined);
  const [contingencyControll, setContingencyControll] =
    useState<boolean>(false);

  useEffect(() => {
    const ls = localStorage.getItem(appConfig.identifier);
    const { epicquest } = cookie;
    if (ls) {
      const u = JSON.parse(ls);
      if (u) setUsuario(u);
    } else if (epicquest) setContingencyControll(true);
  }, []);

  useEffect(() => {
    if (usuario) {
      localStorage.setItem(appConfig.identifier, JSON.stringify(usuario));
      setCookie(appConfig.identifier, usuario.token, {
        path: "/",
      });
    }
  }, [usuario]);

  useEffect(() => {
    (async () => {
      if (contingencyControll) {
        if (cookie.epicquest) {
          const axiosInstance = axios.create({
            baseURL: appConfig.api.url,
          });

          const response: AxiosResponse<defaultResponse> =
            await axiosInstance.post("/users/reauthentication", {
              token: cookie.epicquest,
            });

          if (response.data.success) {
            setUsuario(response.data.data);
          } else {
            window.location.href = "/authentication";
          }
        } else {
          window.location.href = "/authentication";
        }

        setContingencyControll(false);
      }
    })();
  }, [contingencyControll]);

  const login = (u: user) => {
    setUsuario(u);
  };

  const logout = () => {
    setUsuario(undefined);
    localStorage.removeItem(appConfig.identifier);
    removeCookie(appConfig.identifier);
    window.location.href = "/authentication";
  };

  const getToken = (): string => {
    return cookie.epicquest;
  };

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

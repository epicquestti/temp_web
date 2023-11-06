export type appMenu = {
  [key: string]: { name: string; path: string; icon: string | null };
};

export type user = {
  name: string;
  photo: string;
  menu: appMenu;
  token: string;
};

export type applicationContextProperties = {
  usuario: user | undefined;
  login: (u: user) => void;
  logout: () => void;
  getToken: () => string;
};

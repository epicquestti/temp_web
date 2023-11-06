export type defaultResponse = {
  success: boolean;
  message?: string;
  data?: any;
};

export type apiResponse = defaultResponse & {
  redirect?: string;
};

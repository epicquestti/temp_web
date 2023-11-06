import appConfig from "@/config/appConfig";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { apiResponse } from "./fetchApiProperties";

const constructInstance = (): AxiosInstance => {
  try {
    return axios.create({
      baseURL: appConfig.api.url,
      headers: {
        Authorization: "",
      },
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const get = async (
  url: string,
  config?: AxiosRequestConfig<any>
): Promise<apiResponse> => {
  try {
    const instance = await constructInstance();

    const responseHttpRequest: AxiosResponse<apiResponse> = await instance.get(
      url,
      config
    );

    if (responseHttpRequest.status === 200) {
      if (responseHttpRequest.data.redirect) {
        return {
          success: true,
          message: responseHttpRequest.data.message,
          redirect: responseHttpRequest.data.redirect,
        };
      } else {
        if (responseHttpRequest.data.data) {
          return {
            success: responseHttpRequest.data.success,
            data: responseHttpRequest.data.data,
            message: responseHttpRequest.data.message,
          };
        } else {
          return {
            success: responseHttpRequest.data.success,
            message: responseHttpRequest.data.message,
          };
        }
      }
    } else {
      return {
        success: false,
        message: responseHttpRequest.data.message,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

const post = async (
  url: string,
  body?: any,
  config?: AxiosRequestConfig<any>
): Promise<apiResponse> => {
  try {
    const instance = await constructInstance();

    const responseHttpRequest: AxiosResponse<apiResponse> = await instance.post(
      url,
      body,
      config
    );

    if (responseHttpRequest.status === 200) {
      if (responseHttpRequest.data.redirect) {
        return {
          success: true,
          message: responseHttpRequest.data.message,
          redirect: responseHttpRequest.data.redirect,
        };
      } else {
        if (responseHttpRequest.data.data) {
          return {
            success: responseHttpRequest.data.success,
            data: responseHttpRequest.data.data,
            message: responseHttpRequest.data.message,
          };
        } else {
          return {
            success: responseHttpRequest.data.success,
            message: responseHttpRequest.data.message,
          };
        }
      }
    } else {
      return {
        success: false,
        message: responseHttpRequest.data.message,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

const put = async (
  url: string,
  body?: any,
  config?: AxiosRequestConfig<any>
): Promise<apiResponse> => {
  try {
    const instance = await constructInstance();

    const responseHttpRequest: AxiosResponse<apiResponse> = await instance.put(
      url,
      body,
      config
    );

    if (responseHttpRequest.status === 200) {
      if (responseHttpRequest.data.redirect) {
        return {
          success: true,
          message: responseHttpRequest.data.message,
          redirect: responseHttpRequest.data.redirect,
        };
      } else {
        if (responseHttpRequest.data.data) {
          return {
            success: responseHttpRequest.data.success,
            data: responseHttpRequest.data.data,
            message: responseHttpRequest.data.message,
          };
        } else {
          return {
            success: responseHttpRequest.data.success,
            message: responseHttpRequest.data.message,
          };
        }
      }
    } else {
      return {
        success: false,
        data: responseHttpRequest.data.data,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

const del = async (
  url: string,
  config?: AxiosRequestConfig<any>
): Promise<apiResponse> => {
  try {
    const instance = await constructInstance();

    const responseHttpRequest: AxiosResponse<apiResponse> =
      await instance.delete(url, config);

    if (responseHttpRequest.status === 200) {
      if (responseHttpRequest.data.redirect) {
        return {
          success: true,
          message: responseHttpRequest.data.message,
          redirect: responseHttpRequest.data.redirect,
        };
      } else {
        if (responseHttpRequest.data.data) {
          return {
            success: responseHttpRequest.data.success,
            data: responseHttpRequest.data.data,
            message: responseHttpRequest.data.message,
          };
        } else {
          return {
            success: responseHttpRequest.data.success,
            message: responseHttpRequest.data.message,
          };
        }
      }
    } else {
      return {
        success: false,
        message: responseHttpRequest.data.message,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

const fetchApi = {
  get,
  post,
  put,
  del,
};

export default fetchApi;

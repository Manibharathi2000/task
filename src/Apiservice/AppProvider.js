import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  
  const [value, setValue] = useState(false);

  const updateValue = (newValue) => {
    setValue(newValue);
  };

  const appContextValue = {
    value,
    updateValue,
  };

const baseURL = "https://nextjs-boilerplate-five-plum-29.vercel.app/api";

  const PostApi = async (method, url, data, headers) => {
    updateValue(true)

    try {
      const response = await axios({
        method: method,
        url: baseURL + url,
        data: data,
        headers: headers
      })

      const authorizationHeader = response.headers['authorization'];

      if (authorizationHeader) {
        const [bearer, token] = authorizationHeader.split(' ');
        if (bearer === 'Bearer') {
          localStorage.setItem("token", token)
        }
      }
      updateValue(false)
      return response;
    }
    catch (error) {
      if (error.response.data.status === 401) {
        return
      }
      updateValue(false)
      throw error
    }
  }

  const GetApi = async (method, url, params, headers) => {
    updateValue(true)
    try {
      const response = await axios({
        method: method,
        url: baseURL + url,
        params: params,
        headers: headers,
      });

      const authorizationHeader = response.headers['authorization'];

      if (authorizationHeader) {
        const [bearer, token] = authorizationHeader.split(' ');
        if (bearer === 'Bearer') {
          localStorage.setItem("token", token)
        }
      }

      updateValue(false)
      return response;

    } catch (error) {
      if (error.response.data.status === 401) {
        localStorage.clear()
        window.location.href = "/";
        return
      }
      updateValue(false)
      throw error;
    }
  }

  return (
    <AppContext.Provider value={{ appContextValue, PostApi, GetApi, }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
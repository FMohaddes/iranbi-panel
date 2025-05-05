'use client';

import axios, { endpoints } from 'src/utils/axios';

import { setSession } from './utils';
import {
  REFRESH_KEY ,
  STORAGE_KEY
} from "./constant";

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ email, password }) => {
  try {
    const params = { email, password };

    const res = await axios.post(endpoints.auth.signIn, params);
    const { token,refreshToken } = res.data;

    if (!token) {
      throw new Error(`توکن در جواب دریافت نشده است.`);
    }
    setSession(token,refreshToken);
  } catch (error) {
    console.error('ارور در حین ورود:', error);
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({ email, password, firstName, lastName }) => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    const res = await axios.post(endpoints.auth.signUp, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    localStorage.setItem(STORAGE_KEY, accessToken);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async () => {
  try {
    const refreshToken =localStorage.getItem( REFRESH_KEY );
    await axios.post(endpoints.auth.logout,{refreshToken});

    await setSession(null,null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};

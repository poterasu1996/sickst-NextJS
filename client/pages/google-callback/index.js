import React, { useEffect, useContext } from 'react';
// import axios from 'axios';
import { useRouter } from 'next/router';
import AuthContext from '../../store/auth-context';
import axios from '../../api/axios';

const GoogleAuthCallback = () => {
  const { setAuth } = useContext(AuthContext); 
  const { query } = useRouter();
  const router = useRouter();
  const GOOGLE_CALLBACK = '/auth/google/callback?access_token=';
  
  useEffect(() => {
    if (!query.access_token) {
      return
    }
    const token = query.access_token;
    
    axios.get(`${GOOGLE_CALLBACK}${token}`)
      .then((res) => {
        res.data
        setAuth(res.data.jwt);
        localStorage.setItem('jwt', res.data.jwt);
        router.push('/');
      })
      .catch(error => console.log(error))
  }, [query.id_token])

  return (
    <div>
      {/* {auth && (
        <>
          <div>Jwt: {auth.jwt}</div>
          <div>User Id: {auth.user.id}</div>
          <div>Provider: {auth.user.provider}</div>
        </>
      )} */}
    </div>
  )
}

export default GoogleAuthCallback;
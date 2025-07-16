import React, { useEffect, useContext } from 'react';
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
    <div className='google-callback-page'>
      <div className='title'>Asteptati un moment</div>
      {/* <Spinner animation="border" style={{color: "#cc3663"}}/> */}
    </div>
  )
}

export default GoogleAuthCallback;
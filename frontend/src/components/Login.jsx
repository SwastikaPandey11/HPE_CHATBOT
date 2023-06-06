import React, { useEffect, useState } from 'react'
import './Login.css'
import { useDispatch, useSelector } from 'react-redux'
import { selectMode } from '../features/user/userSlice.js'
import { auth, perf, provider } from '../firebase.js'
import { useNavigate } from 'react-router-dom'
import db from '../firebase.js';
import { selectUserName,
  selectUserPhoto,
  setUserLoginDetails,
  setSignOutState } from '../features/user/userSlice.js';

const Login = () => {
  const dispatch= useDispatch();
  const history= useNavigate();
  const userName = useSelector(selectUserName);
  const userPhoto= useSelector(selectUserPhoto);
  useEffect(()=>{
    auth.onAuthStateChanged(async(user)=>{
      if(user){
        setUser(user)
        history("/id/chat");
      }
    })
  },[userName]);
  const handle= ()=>{
    const trace = perf.trace('Login');
    trace.start();
    console.log(userName);
    auth.signInWithPopup(provider).then((result)=>{
      setUser(result.user);
    }).catch((error)=>{
      alert(error.message);
    });
    trace.stop();
  }
  const setUser=(user)=>{
    const trace = perf.trace('DispatchLogin');
    trace.start();
    console.log(user.email);
    db.collection('Accounts').where('email','==',user.email).get()
    .then((res)=>{
      var id;
      if(res.docs.length>0)
      {
        id=res.docs[0].id;
        dispatch(
          setUserLoginDetails({
            name: user.displayName,
            id: id,
            photo: user.photoURL,
            email:user.email,
          }
          )
        )
        history('/id/chat');
      }
      else if (res.docs.length ==0){
        db.collection('Accounts').add({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        }).then((docRef)=>{
          dispatch(
            setUserLoginDetails({
              name: user.displayName,
              id: docRef.id,
              photo: user.photoURL,
              email:user.email,
            }
            )
          )
          history('/id/chat');
        }).catch((e)=>{
          console.log(e);
        })
      }

    }).catch((e)=>{
      console.log(e.message);
    })
    trace.stop();
}
  return (
    <div className={`login-page body`} id="log-page">
      <div className = "login-div-wrap">
      <div className="login-div">
        <h1>ChatHelp</h1>
        <hr />
        <p>Your personal AI-powered chatbot assisting and empowering documentation search.</p>
        <p></p>
        <button id="submit" onClick={()=>{
          handle();
        }}>
        <svg viewBox="0 0 48 48">
  <clipPath id="g">
    <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/>
  </clipPath>
  <g class="colors" clip-path="url(#g)">
    <path fill="#fefefe" d="M0 37V11l17 13z"/>
    <path fill="#fefefe" d="M0 11l17 13 7-6.1L48 14V0H0z"/>
    <path fill="#fefefe" d="M0 37l30-23 7.9 1L48 0v48H0z"/>
    <path fill="#fefefe" d="M48 48L17 24l-4-3 35-10z"/>
  </g>
</svg>
        Continue with Google</button>
      </div>
      </div>
    </div>
  )
}

export default Login
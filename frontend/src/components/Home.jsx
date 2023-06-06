import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectMode } from "../features/user/userSlice.js";
import { auth, perf, provider } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import db from "../firebase.js";
import {
  selectUserName,
  selectUserPhoto,
  setUserLoginDetails,
  setSignOutState,
} from "../features/user/userSlice.js";
import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const userName = useSelector(selectUserName);
  const userPhoto = useSelector(selectUserPhoto);
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        history("/id/chat");
      }
    });
  }, [userName]);
  const handle = () => {
    // const trace = perf.trace("Login");
    // trace.start();
    // console.log(userName);
    // auth
    //   .signInWithPopup(provider)
    //   .then((result) => {
    //     setUser(result.user);
    //   })
    //   .catch((error) => {
    //     alert(error.message);
    //   });
    // trace.stop();
    history('/login');
  };
  const setUser = (user) => {
    const trace = perf.trace("DispatchLogin");
    trace.start();
    console.log(user.email);
    db.collection("Accounts")
      .where("email", "==", user.email)
      .get()
      .then((res) => {
        var id;
        if (res.docs.length > 0) {
          id = res.docs[0].id;
          dispatch(
            setUserLoginDetails({
              name: user.displayName,
              id: id,
              photo: user.photoURL,
              email: user.email,
            })
          );
          history("/id/chat");
        } else if (res.docs.length == 0) {
          db.collection("Accounts")
            .add({
              name: user.displayName,
              email: user.email,
              photo: user.photoURL,
            })
            .then((docRef) => {
              dispatch(
                setUserLoginDetails({
                  name: user.displayName,
                  id: docRef.id,
                  photo: user.photoURL,
                  email: user.email,
                })
              );
              history("/id/chat");
            })
            .catch((e) => {
              console.log(e);
            });
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
    trace.stop();
  };
  return (
    <div className="home-page-wrapper">
    <div className="home__page">
      <div className="home__nav">
        <div className="nav__logo">ChatHelp</div>
        <div className="nav__buttons">
          {/* <button className="home__btn">
            <a href="https://www.hpe.com/us/en/resources/storage/documentation.html">Docs</a>
          </button> */}
        </div>
      </div>
      <div className="home__pager">
        <div className="home__content">
          <div className="content__heading">
            Simplify Your Queries with <span>ChatHelp</span>
          </div>
          <div className="content__subheading">
            {" "}
            Unlock the true potential of HPE Primera and HPE Alletra with documentation support at your fingertips. 
          </div>
          <div className="content__buttons">
            <button className="home__btndoc btn-prim" onClick={handle}>
              <a href="">
                Sign In to ChatHelp
              </a>
            </button>
            {/* <button className="home__btndoc btn-second">
              <a target = "blank" href="https://www.hpe.com/us/en/resources/storage/documentation.html">
                HPE Storage Docs
              </a>
            </button> */}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Home;
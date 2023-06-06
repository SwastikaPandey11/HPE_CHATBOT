import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserLoginDetails,
  setSignOutState,
  setMessages,
  setMode,
  selectUserId,
  selectUserName,
  selectMode,
  selectEmail,
  selectUserPhoto,
} from "../features/user/userSlice.js";
import db, { auth, perf } from "../firebase.js";
import { Link, useNavigate } from "react-router-dom";
import firebase from "firebase";
const Sidebar = () => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const userName = useSelector(selectUserName);
  const userMode = useSelector(selectMode);
  const userEmail = useSelector(selectEmail);
  const userPhoto = useSelector(selectUserPhoto);
  console.log(userEmail);
  const [vals, setvals] = useState([]);
  const [change, setchange] = useState(true);
  const history = useNavigate();
  function toUnicodeVariant(str, variant, flags) {
    const offsets = {
        m: [0x1d670, 0x1d7f6],
        b: [0x1d400, 0x1d7ce],
        i: [0x1d434, 0x00030],
        bi: [0x1d468, 0x00030],
        c: [0x1d49c, 0x00030],
        bc: [0x1d4d0, 0x00030],
        g: [0x1d504, 0x00030],
        d: [0x1d538, 0x1d7d8],
        bg: [0x1d56c, 0x00030],
        s: [0x1d5a0, 0x1d7e2],
        bs: [0x1d5d4, 0x1d7ec],
        is: [0x1d608, 0x00030],
        bis: [0x1d63c, 0x00030],
        o: [0x24B6, 0x2460],
        p: [0x249C, 0x2474],
        w: [0xff21, 0xff10],
        u: [0x2090, 0xff10]
    }

    const variantOffsets = {
        'monospace': 'm',
        'bold': 'b',
        'italic': 'i',
        'bold italic': 'bi',
        'script': 'c',
        'bold script': 'bc',
        'gothic': 'g',
        'gothic bold': 'bg',
        'doublestruck': 'd',
        'sans': 's',
        'bold sans': 'bs',
        'italic sans': 'is',
        'bold italic sans': 'bis',
        'parenthesis': 'p',
        'circled': 'o',
        'fullwidth': 'w'
    }

    // special characters (absolute values)
    var special = {
        m: {
            ' ': 0x2000,
            '-': 0x2013
        },
        i: {
            'h': 0x210e
        },
        g: {
            'C': 0x212d,
            'H': 0x210c,
            'I': 0x2111,
            'R': 0x211c,
            'Z': 0x2128
        },
        o: {
            '0': 0x24EA,
            '1': 0x2460,
            '2': 0x2461,
            '3': 0x2462,
            '4': 0x2463,
            '5': 0x2464,
            '6': 0x2465,
            '7': 0x2466,
            '8': 0x2467,
            '9': 0x2468,
        },
        p: {},
        w: {}
    }
    for (var i = 97; i <= 122; i++) {
        special.p[String.fromCharCode(i)] = 0x249C + (i - 97)
    }
    for (var i = 97; i <= 122; i++) {
        special.w[String.fromCharCode(i)] = 0xff41 + (i - 97)
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';

    var getType = function (variant) {
        if (variantOffsets[variant]) return variantOffsets[variant]
        if (offsets[variant]) return variant;
        return 'm'; //monospace as default
    }
    var getFlag = function (flag, flags) {
        if (!flags) return false
        return flags.split(',').indexOf(flag) > -1
    }

    var type = getType(variant);
    var underline = getFlag('underline', flags);
    var strike = getFlag('strike', flags);
    var result = '';

    for (var k of str) {
        let index
        let c = k
        if (special[type] && special[type][c]) c = String.fromCodePoint(special[type][c])
        if (type && (index = chars.indexOf(c)) > -1) {
            result += String.fromCodePoint(index + offsets[type][0])
        } else if (type && (index = numbers.indexOf(c)) > -1) {
            result += String.fromCodePoint(index + offsets[type][1])
        } else {
            result += c
        }
        if (underline) result += '\u0332' // add combining underline
        if (strike) result += '\u0336' // add combining strike
    }
    return result
}
  useEffect(() => {
    const trace = perf.trace('ChatsFetch');
    trace.start();
    var obj = [];
    if (userId != "" && userId != null) {
      db.collection("Accounts")
        .doc(userId)
        .collection("Chats")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          snapshot.docs.map((doc) => {
            var temp = {};
            temp.id = doc.id;
            temp.name = doc.data().name;
            obj.push(temp);
          });
          // const uniqueData = obj.reduce((acc, current) => {
          //   const x = acc.find((item) => item.id === current.id);
          //   if (!x) {
          //     return acc.concat([current]);
          //   } else {
          //     return acc;
          //   }
          // }, []);
          const uniqueData = Array.from(new Set(obj.map(item => item.id))).map(id => obj.find(item => item.id === id));
          setvals(uniqueData);
        });
        trace.stop();
    }
  }, [change, userId]);
  useEffect(() => {
    if (userMode == "black") {
      console.log(
        document.getElementsByClassName("body")[0].classList.add("dark")
      );
    }
  }, []);
  const sidebarToggle = () => {
    console.log(document.getElementById("sidebar").classList.toggle("close"));
  };
  const modeSwitch = () => {
    document.getElementsByClassName("body")[0].classList.toggle("dark");
    var modechng = userMode =="white"? "black":"white";
                  var modeobj ={mode:modechng}
                  dispatch(setMode(modeobj));
    };
  return (
    <nav className="sidebar close" id="sidebar">
      <header>
        <div className="image-text">
          <div className="text user-img">
          {
            userPhoto?(
            <img src={userPhoto} alt="" className="userImg" />
            )
            :
            (
              <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke={userMode=="white"?"black":"gray"}
              strokeWidth="2"
              strokeLinecap="butt"
              strokeLinejoin="bevel"
            >
              <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3" />
              <circle cx="12" cy="10" r="3" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            )
          }
          </div>
          <div className="text logo-text">
            <span className="name" style={{color:userMode=="white"?"black":"white"}}>
              {userName ? userName.split(" ")[0] : "User"}
            </span>
            <span className="email">{userEmail}</span>
          </div>
        </div>
        <div
          className="bx bx-chevron-right toggle"
          id="toggler"
          onClick={sidebarToggle}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <hr className="text"/>
      </header>
      <div className="menu-bar">
        <div className="menu">
          <ul className="menu-links">
            {vals.map((key) => {
              return (
                <li className="nav-link">
                  <span
                    className="text nav-text"
                    onClick={() => {
                      var chatRoute = "/" + key.id + "/chat";
                      history(chatRoute);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {key.name}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill={userMode=="white"?"gray":"white"}
                      className="w-5 h-5"
                      onClick={() => {
                        db.collection("Accounts")
                          .doc(userId)
                          .collection("Chats")
                          .doc(key.id)
                          .delete()
                          .then((res) => {
                            console.log(res);
                            alert("Successfully deleted");
                            setchange(!change);
                            history("/id/chat");
                          })
                          .catch((err) => {
                            console.log(err);
                            alert(
                              "There was an error deleting Please refresh and try again later"
                            );
                          });
                      }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </li>
              );
            })}
          </ul>
          <li
            className="newchat-box"
            onClick={() => {
              if (vals.length < 10) {
                var answer = prompt(
                  "What name would you like to give to your new chat"
                );
                console.log(answer);
                if (answer != null && answer.trim().length > 0) {
                  db.collection("Accounts")
                    .doc(userId)
                    .collection("Chats")
                    .add({
                      name: answer,
                      timestamp:
                        firebase.firestore.FieldValue.serverTimestamp(),
                    })
                    .then((docRef) => {
                      setchange(!change);
                      alert("Successfully added new chat");
                      console.log(docRef.id);
                    })
                    .catch(() => {
                      alert(
                        "There was an error in creating the new chat Please refresh and try again"
                      );
                    });
                }
              } else {
                var ans = window.confirm(
                  "You have reached the limit of 10 chats. So, if you want to add new chat we are deleting  " +
                  toUnicodeVariant(vals[0].name, 'bold sans', 'bold') +
                    "  and adding the new chat you want"
                );
                console.log(ans);
                if (ans) {
                  db.collection("Accounts")
                    .doc(userId)
                    .collection("Chats")
                    .doc(vals[0].id)
                    .delete()
                    .then(() => {
                      // alert('Deleted Chat Successfully')
                      var answer = prompt(
                    "What name would you like to give to your new chat"
                  );
                  console.log(answer);
                  if (answer != null && answer.trim().length > 0) {
                    db.collection("Accounts")
                      .doc(userId)
                      .collection("Chats")
                      .add({
                        name: answer,
                        timestamp:
                          firebase.firestore.FieldValue.serverTimestamp(),
                      })
                      .then((docRef) => {
                        setchange(!change);
                        alert("Successfully added new chat");
                        console.log(docRef.id);
                      })
                      .catch(() => {
                        alert(
                          "There was an error in creating the new chat Please refresh and try again"
                        );
                      });
                  }
                  else{
                    setchange(!change);
                  }
                    })
                    .catch(() => {
                      console.log("Oops! Something went wrong in deleting the chat. Please try again.");
                    });
                }
              }
            }}
          >
            <div className="text">Add Chat</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="white"
              className="w-5 h-5"
              style={{ height: "20px", width: "20px" }}
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
          </li>
        </div>
        <div className="bottom-content">
          <li className="mode" onClick={modeSwitch}>
            <div className="sun-moon">
              <i className="bx bx-moon icon moon"></i>
              <i className="bx bx-sun icon sun"></i>
            </div>
            <span className="mode-text text">
              {userMode=="white"?"Dark":"Light"+" "} Mode
            </span>
            <div className="toggle-switch">
              <span
                className="switch"
                onClick={() => {
                    // var modechng = userMode =="white"? "black":"white";
                    // var modeobj ={mode:modechng}
                    // dispatch(setMode(modeobj));
                }
                }
              >
                {userMode=="black" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="black"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                    />
                  </svg>
                )}
              </span>
            </div>
          </li>
          <li className="logout">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke={userMode=="white"?"black":"white"}
              className="w-6 h-6 bx bx-log-out icon"
            >
              <path
                strokeLinecap="butt"
                strokeLinejoin="arcs"
                d="M16 17l5-5-5-5M19.8 12H9M10 3H4v18h6"
              />
            </svg>
            <span
              className="text nav-text"
              onClick={() => {
                auth
                  .signOut()
                  .then(() => {
                    dispatch(setSignOutState());
                    history("/login");
                  })
                  .catch((error) => {
                    alert(error.message);
                  });
              }}
            >
              Logout
            </span>
          </li>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;

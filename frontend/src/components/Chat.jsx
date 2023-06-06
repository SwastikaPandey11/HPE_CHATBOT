import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./Chat.css";
import Sidebar from "./Sidebar";
import Chatwindow from "./Chatwindow";
import { useParams } from "react-router-dom";
import { selectUserId, selectUserName } from "../features/user/userSlice.js";
import db, { auth } from "../firebase.js";
import firebase from "firebase";
const Chat = () => {
  const { chatid } = useParams();
  console.log(chatid);
  const userName = useSelector(selectUserName);
  const userId = useSelector(selectUserId);
  const [vals, setvals] = useState([]);
  useEffect(() => {
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
          const uniqueData = obj.reduce((acc, current) => {
            const x = acc.find((item) => item.id === current.id);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);
          setvals(uniqueData);
        });
    }
  }, [userId]);
  return (
    <div className="chat-window body">
      <Sidebar></Sidebar>
      {chatid == "id" ? (
        <>
          <div className="welcome-display">
            <div className="welcome-text">
              <div className="welcome-user">
                Welcome <br className="mobile-break" />
                <span>{userName ? userName : "User"}</span>
              </div>{" "}
              <hr />
              <p>
                Hola, I am <b>ChatHelp</b>, your personal AI-powered chatbot
                designed to assist you with documentation and provide support
                for HPE Alletra and HPE Primera storage solutions. Ask me
                anything about features, configuration, troubleshooting, and
                best practices. Let's optimize your storage infrastructure
                together!
              </p>
              <div className="welcome-buttons">
                <div
                  className="welcome-new-chat"
                  onClick={() => {
                    if (vals.length < 10) {
                      var answer = prompt(
                        "What name would you like to give to your new chat"
                      );
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
                            alert("Successfully added new chat");
                            console.log(docRef.id);
                            console.log(
                              document
                                .getElementById("sidebar")
                                .classList.remove("close")
                            );
                          })
                          .catch((err) => {
                            console.log(err);
                            alert(
                              "There was an error in creating the new chat Please refresh and try again"
                            );
                          });
                      }
                    } else {
                      var ans = window.confirm(
                        "You have reached the limit of 10 chats. So, if you want to add new chat we are deleting" +
                          vals[0].name +
                          " and adding the new chat you want"
                      );
                      console.log(ans);
                      if (ans) {
                        db.collection("Accounts")
                          .doc(userId)
                          .collection("Chats")
                          .doc(vals[0].id)
                          .delete()
                          .then(() => {})
                          .catch(() => {
                            console.log("Not deleted");
                          });
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
                              console.log(
                                document
                                  .getElementById("sidebar")
                                  .classList.remove("close")
                              );
                            })
                            .catch(() => {
                              alert(
                                "There was an error in creating the new chat Please refresh and try again"
                              );
                            });
                        }
                      }
                    }
                  }}
                >
                  New Chat{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="white"
                    className="w-5 h-5"
                    style={{ height: "20px", width: "20px" }}
                  >
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                </div>
                <div
                  className="welcome-view-chats"
                  onClick={() => {
                    console.log(
                      document
                        .getElementById("sidebar")
                        .classList.toggle("close")
                    );
                  }}
                >
                  View Chats{" "}
                  <svg class="svg-icon" viewBox="0 0 20 20">
                    <path
                      fill="none"
                      d="M1.729,9.212h14.656l-4.184-4.184c-0.307-0.306-0.307-0.801,0-1.107c0.305-0.306,0.801-0.306,1.106,0
	l5.481,5.482c0.018,0.014,0.037,0.019,0.053,0.034c0.181,0.181,0.242,0.425,0.209,0.66c-0.004,0.038-0.012,0.071-0.021,0.109
	c-0.028,0.098-0.075,0.188-0.143,0.271c-0.021,0.026-0.021,0.061-0.045,0.085c-0.015,0.016-0.034,0.02-0.051,0.033l-5.483,5.483
	c-0.306,0.307-0.802,0.307-1.106,0c-0.307-0.305-0.307-0.801,0-1.105l4.184-4.185H1.729c-0.436,0-0.788-0.353-0.788-0.788
	S1.293,9.212,1.729,9.212z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Chatwindow chatid={chatid}></Chatwindow>
      )}
    </div>
  );
};

export default Chat;

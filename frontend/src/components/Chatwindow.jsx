import React, { useEffect, useState } from 'react'
import './Chatwindow.css'
import db, { perf } from '../firebase';
import { useSelector } from 'react-redux';
import { selectUserId } from '../features/user/userSlice';
import firebase from 'firebase'
import { selectUserPhoto } from '../features/user/userSlice';
import { usePostAiTextMutation } from '../state/api.js';
import axios from 'axios';
const Chatwindow = ({chatid}) => {
  const api =axios.create({
    baseURL:"http://127.0.0.1:5000/",
  })
  // useEffect(() => {
  //   api.post('/predict', {
  //     sepal_length: 2,
  //     sepal_width: 2,
  //     petal_length: 2,
  //     petal_width: 2
  //   })
  //   .then(res => console.log('prediction',res.data.prediction))
  //   .catch(err => console.log(err));
  // }, [])
  console.log('chatid:',chatid);
  const userphoto = useSelector(selectUserPhoto);
  const [trigger]= usePostAiTextMutation();
  console.log(userphoto);
  const userId = useSelector(selectUserId);
  const [vals, setvals] = useState([]);
  const [chatname, setchatname] = useState("");
  const [question, setquestion] = useState(false);
  const [loading, setloading] = useState(false);
  const [loadingtext, setloadingtext] = useState("Fetching");
  var i=0;
  const loadingText = () => {
    var text ="Fetching";
    var addOns = ['','.','..','...'];
    var FinalText = text + addOns[i];
    i=(i+1)%4;
    setloadingtext(FinalText);
  }
  var myInterval="";
  if(loading)
  {
    myInterval = setInterval(loadingText, 900);
  }
  else if (!loading && myInterval!=""){
    clearInterval(myInterval);
  }
  useEffect(() => {
    var obj=[];
    db.collection('Accounts').doc(userId).collection('Chats').doc(chatid).collection('Messages').orderBy('timestamp','asc').onSnapshot(snapshot=>{
      snapshot.docs.map((doc)=>{
        var temp={};
        temp.id=doc.id;
        temp.message=doc.data().message;
        temp.owner=doc.data().owner;
        obj.push(temp);
      });
      const uniqueData = obj.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      setvals(uniqueData);
      db.collection('Accounts').doc(userId).collection('Chats').doc(chatid).get().then((doc)=>{
        if(doc.exists){
          setchatname(doc.data().name);
        }
      })
    })
  }, [chatid,question]);
  console.log(vals);
  const askQuestion=()=>{
    const trace = perf.trace('GetResponse');
    trace.start();
    setloading(true);
    var msg = document.getElementById('question').value;
    if(question==false&&msg!="")
    {
      setquestion(true);
      db.collection('Accounts').doc(userId).collection('Chats').doc(chatid).collection('Messages').add({
        message: msg,
        owner: 'user',
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      }).then(()=>{
        const form = {
          text:document.getElementById('question').value,
          ChatId:chatid,
        }
//         fetch('http://localhost:1337/openai/text', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     text:document.getElementById('question').value,
//     ChatId: chatid,
//   })
// })
// .then(response => {response.data})
api.post('/api/predict', {
  'message':document.getElementById('question').value,
  'chatId': chatid,
})
.then(res => {
  //alert(res.data.prediction);
  db.collection('Accounts').doc(userId).collection('Chats').doc(chatid).collection('Messages').add({
    message: res.data.prediction,
    owner: 'bot',
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  }).then(()=>{
    setloading(false);
    setquestion(false);
  }).catch((err)=>{
    console.log("firtst catch:"+err);
    alert("Something went wrong");
    setloading(false);
    setquestion(false);
  })
})
.catch(error => {
  console.error("second catch"+error);
  alert("Something went wrong");
  setloading(false);
  setquestion(false);
  console.log(question);
}); 
      });

    }
    else if(msg=="")
    {}
    else{
      alert("Already processing the previous question.Please ask after a few moments....")
    }
  trace.stop();
  }
  return (
    <section className="chat-home">
    <div className="chat-header">
    {chatname}
    </div>
    <div className="text chat-list">
        <div className="messages">
          {
            vals.length==0?(
              <div className="welcome-display">
                <div className="welcome-text">
                  <div className="welcome-user">
                  <p style={{fontSize:`.9rem`}}>
                  This chatbot is eager to hear from you! Begin the conversation now by asking your queries.
                  </p>
                  </div>
                </div>
              </div>
            ):(vals.map((key)=>{
            var side = key.owner=="user"?"right":"left";
            var classname = "message"+" "+side;
            var photo = key.owner=="user"?userphoto:"https://i.ibb.co/52Mx1XG/Untitled-design.png";
            return(
            <div className={classname}>
            <div className="messageInfo">
              <img src={photo} alt="Bot" border="0"/>
            </div>
            <div className="messageContent">{key.message}</div>
          </div>
          )}))
          }
          {loading&&<>{
            <div className="message left">
            <div className="messageInfo">
              <img src="https://i.ibb.co/52Mx1XG/Untitled-design.png" alt="Bot" border="0"/>
            </div>
            <div className="messageContent">{
              loadingtext
            }
            </div>
          </div>
          }</>}
        </div>
        <div className="chatinput">
          <input type="text" placeholder='Type your query here' id='question'/>
          <button onClick={()=>{
            if(document.getElementById('question').value.trim().length > 0)
            {
            askQuestion();
            }
            else{
              alert('Seems You have entered empty query. Please write you query and press the send button.')
            }
          }}> 
          <div className="btn-text">Send</div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"> 
          <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
          </svg>
        </button>
        </div>
    </div>

</section>
  )
}

export default Chatwindow
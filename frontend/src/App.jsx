import { useEffect, useState } from 'react'
import './App.css'
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import Chat from './components/Chat.jsx'
import Login from './components/Login.jsx'
import db, { perf } from './firebase.js';
import Home from './components/Home'
function App() {
useEffect(() => {
const trace = perf.trace('fetchData');
trace.start();
db.collection('Accounts').doc('YuvPAW3weJFXq7bXpvgl').collection('Chats').doc('sMy0fEhaZenB5Zo0L4Xl').collection('Messages').onSnapshot(snapshot=>{
  snapshot.docs.map((doc)=>
  {
    console.log(doc.data());
    console.log(doc.id);
  })
})

trace.stop();

}, [])
  return (
    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/:chatid/chat" element={<Chat></Chat>}>
        </Route>
        <Route path="/" element={<>
          <Home></Home>
        </>}>
        </Route>
        <Route path="/login" element={<>
          <Login></Login>
        </>}>
        </Route>      
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
import React, { useRef, useState } from 'react';
import './Chat.css';
import { selectUser } from "../../features/userSlice";
import { useCustomSelector } from "../../test";
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/analytics';
import {useLocation} from "react-router-dom";

import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyABEPMeLah3wCOyKa38gz-oxByUzZllTEg",
  authDomain: "chat-encrypt.firebaseapp.com",
  projectId: "chat-encrypt",
  storageBucket: "chat-encrypt.appspot.com",
  messagingSenderId: "813966482173",
  appId: "1:813966482173:web:87b975e973257ea95b7c94",
  measurementId: "G-ZZEVPRYJJK",
})

const firestore = firebase.firestore();
const analytics = firebase.analytics();


function Chat() {

  const location = useLocation().pathname;
  const streamer = location.slice(6)


  return (
    <div className="appsz">
      <header className="myheader">
        <h1>{streamer}'s chat👾`</h1>
      </header>

      <div>
        {<ChatRoom/>}
      </div>

    </div>
  );
}



function ChatRoom() {
  const user = useCustomSelector(selectUser);

  const dummy = useRef();
  const location = useLocation().pathname;
  const streamer = location.slice(6)
  const messagesRef = firestore.collection(streamer);
  const query = messagesRef.orderBy('createdAt');

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  console.log(messages)

  const sendMessage = async (e) => {
    e.preventDefault();

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      username: user.username
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });

  }

  return (<>
    <main className="mymain">

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy} className="myspan"></span>

    </main>

    <form onSubmit={sendMessage} className="myform">

      <input value={formValue} className="myinput" onChange={(e) => setFormValue(e.target.value)} placeholder="Be nice, respectful, and have fun!" />

      <button type="submit" className='mybutton' disabled={!formValue}>🎮</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const user = useCustomSelector(selectUser);
  const { text } = props.message;

  const messageClass = 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={'https://api.adorable.io/avatars/23/abott@adorable.png'} className="myimg" />
      <p className="myp">{user.username} : {text}</p>
    </div>
  </>)
}


export default Chat;

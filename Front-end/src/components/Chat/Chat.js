import React, { useRef, useState } from 'react';
import './Chat.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/analytics';

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


  return (
    <div className="App">
      <header>
        <h1>Abderrahim's chat👾</h1>
      </header>

      <section>
        {<ChatRoom />}
      </section>

    </div>
  );
}



function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('Abdessalam');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  console.log(messages)

  const sendMessage = async (e) => {
    e.preventDefault();

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });

  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage} className="myform">

      <input value={formValue} className="myinput" onChange={(e) => setFormValue(e.target.value)} placeholder="Be nice, respectful, and have fun!" />

      <button type="submit" className='mybutton' disabled={!formValue}>🎮</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text } = props.message;

  const messageClass = 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}


export default Chat;

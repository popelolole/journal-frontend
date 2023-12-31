import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Message from '../components/Message';
import MessageInputField from '../components/MessageInputField';
import { useAuth } from 'react-oidc-context';



function MessagePage(){
  const { personId, name } = useParams();
  const auth = useAuth();

  const [userId, setUserId] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingConvo, setLoadingConvo] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserId = async () => {
    try {
      const token = auth.user?.access_token;
      const response = await fetch(`https://raven-journal.app.cloud.cbh.kth.se/person/user-id?personId=${personId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        if(response.status === 404)
          throw new Error('This person does not have an associated user.');
        throw new Error("Failed to fetch.");
      }
  
      const result = await response.text();
  
      setUserId(result);
    } catch (error) {
      setError(error.message);
    } finally{
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    console.log("user id: " + userId);
    if(userId!=null){
      fetchConversation();
    }
  }, [userId]);
  

  const fetchConversation = async () => {
    try {
      const token = auth.user?.access_token;
      console.log("users id is " + userId);
      const response = await fetch(`https://raven-message-svc.app.cloud.cbh.kth.se/messages?userId1=${auth.user?.profile.sub}&userId2=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
  
      const result = await response.json();
  
      console.log(result);
  
      setConversation(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingConvo(false);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  if (error) {
    return <div><p>Error: {error}</p></div>;
  }
  else if (loading||loadingConvo) {
    return <div><p>Loading...</p></div>;
  }

  const handleSendMessage = (text) => {
    const newMessage = {
      message: text,
      sendDate: new Date(Date.now()),
      senderId: auth.user?.profile.sub,
      receiverId: userId
    };
    console.log(newMessage);

    postMessage(newMessage);

    setConversation([...conversation, newMessage]);
  };

  const postMessage = async (message) => {
    try {
      const token = auth.user?.access_token;
      const response = await fetch(`https://raven-message-svc.app.cloud.cbh.kth.se/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(message),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('POST request successful:', data);
        return data;
      } else {
        console.error('POST request failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('An error occurred while making the POST request:', error);
    }
  };

  return(
    <div>
      <Header />
      <h1>Conversation with {name}</h1>
      <div>
        <div className="message-list">
          {conversation.map(message => (
            <Message key={message.id} message={message} isCurrentUser={message.senderId === auth.user?.profile.sub} />
          ))}
        </div>
        <MessageInputField onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

export default MessagePage;
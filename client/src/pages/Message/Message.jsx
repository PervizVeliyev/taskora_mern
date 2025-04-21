import toast from 'react-hot-toast';
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { useRecoilValue } from "recoil";
import { userState } from "../../atoms";
import { axiosFetch } from '../../utils';
import { Loader } from '../../components';
import io from 'socket.io-client';
import "./Message.scss";

const Message = () => {
  const user = useRecoilValue(userState);
  const { conversationID } = useParams();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const socketIo = io(import.meta.env.VITE_API_URL.replace(/\/api\/?$/, ''));
    setSocket(socketIo);

    socketIo.emit('joinRoom', conversationID);

    socketIo.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socketIo.disconnect();
  }, [conversationID]);

  const { isLoading, error } = useQuery({
    queryKey: ['messages'],
    queryFn: () => axiosFetch.get(`/messages/${conversationID}`).then(res => res.data),
    onSuccess: (data) => setMessages(data),
    onError: ({ response }) => toast.error(response?.data?.message || 'Xəta baş verdi'),
  });

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    if (!socket) return;

    const message = {
      conversationID,
      description: event.target[0].value,
      userID: user._id
    };

    socket.emit('sendMessage', message);
    event.target.reset();
  };

  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link to="/messages" className="link">Mesajlar</Link>
        </span>

        {isLoading ? (
          <div className="loader"><Loader /></div>
        ) : error ? (
          'Xəta baş verdi'
        ) : (
          <div className="messages">
            {messages.map((message) => (
              <div className={message.userID._id === user._id ? 'owner item' : 'item'} key={message._id}>
                <img src={message.userID.image || '/media/noavatar.png'} alt="" />
                <p>{message.description}</p>
              </div>
            ))}
          </div>
        )}

        <hr />

        <form className="write" onSubmit={handleMessageSubmit}>
          <textarea cols="30" rows="10" placeholder="Mesaj yaz"></textarea>
          <button type="submit">Göndər</button>
        </form>
      </div>
    </div>
  );
};

export default Message;
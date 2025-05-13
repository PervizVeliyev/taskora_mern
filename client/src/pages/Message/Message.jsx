import toast from 'react-hot-toast';
import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useInfiniteQuery } from '@tanstack/react-query';
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
  const messagesEndRef = useRef(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [newMessages, setNewMessages] = useState([]);
  const prevMessagesLengthRef = useRef(0);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch
  } = useInfiniteQuery({
    queryKey: ['messages', conversationID],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axiosFetch.get(`/messages/${conversationID}?page=${pageParam}&limit=10`);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    onSuccess: () => {
      if (isInitialLoad) {
        scrollToFixedBottom();
        setIsInitialLoad(false);
      }
      // Remove only those newMessages that are now present in messages
      setNewMessages((prevNewMessages) => {
        const paginatedIds = new Set((data?.pages.flatMap(page => page.data) || []).map(m => m._id));
        return prevNewMessages.filter(m => !paginatedIds.has(m._id));
      });
    },
    onError: ({ response }) => toast.error(response?.data?.message || 'Xəta baş verdi'),
  });

  // Reverse the order of messages to show oldest first
  const messages = data?.pages.flatMap(page => page.data).reverse() || [];

  useEffect(() => {
    window.scrollTo(0, 0);
    const socketIo = io(import.meta.env.VITE_API_URL.replace(/\/api\/?$/, ''));
    setSocket(socketIo);

    socketIo.emit('joinRoom', conversationID);

    socketIo.on('receiveMessage', (msg) => {
      console.log('WebSocket received message:', msg, 'Current user:', user);
      // Only scroll to bottom if the message is from the current user
      if (user && ((msg.userID && msg.userID._id === user._id) || msg.userID === user._id)) {
        setNewMessages(prev => [...prev, msg]);
        scrollToFixedBottom();
      } else if (user) {
        // Only scroll to bottom if user is near the bottom
        const threshold = 100; // px
        const scrollPosition = window.scrollY + window.innerHeight;
        const scrollHeight = document.documentElement.scrollHeight;
        setNewMessages(prev => [...prev, msg]);
        if (scrollHeight - scrollPosition < threshold) {
          setTimeout(() => {
            scrollToFixedBottom();
          }, 0);
        }
      }
    });

    return () => socketIo.disconnect();
  }, [conversationID, user]);

  useEffect(() => {
    const handleWindowScroll = () => {
      if (window.scrollY === 0 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };
    window.addEventListener('scroll', handleWindowScroll);
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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

  // Combine messages from query and newMessages, but filter out duplicates
  const paginatedIds = new Set(messages.map(m => m._id));
  const uniqueNewMessages = newMessages.filter(m => !paginatedIds.has(m._id));
  const allMessages = [...messages, ...uniqueNewMessages];

  // Scroll to a fixed offset from the bottom
  const scrollToFixedBottom = (offset = 100) => {
    const scrollHeight = document.documentElement.scrollHeight;
    window.scrollTo({
      top: scrollHeight - window.innerHeight - offset,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const prevLength = prevMessagesLengthRef.current;
    const currLength = allMessages.length;
    // Only scroll if messages increased (new message at bottom)
    if (currLength > prevLength) {
      // If user is at the very top, do not scroll (loading older messages)
      if (window.scrollY !== 0) {
        scrollToFixedBottom(700); // Use your preferred offset
      }
    }
    prevMessagesLengthRef.current = currLength;
  }, [allMessages.length]);

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
            {isFetchingNextPage && (
              <>
                <div style={{textAlign: 'center', color: '#888', fontSize: '14px', marginBottom: '8px'}}>Loading older messages...</div>
                <div className="loader"><Loader /></div>
              </>
            )}
            {allMessages.map((message) => (
              <div 
                className={message.userID._id === user._id ? 'owner item' : 'item'} 
                key={message._id}
              >
                <img src={message.userID.image || '/media/noavatar.png'} alt="" />
                <p>{message.description}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        <hr />

        <form className="write" onSubmit={handleMessageSubmit}>
          <textarea 
            cols="30" 
            rows="10" 
            placeholder="Mesaj yaz"
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                e.target.form.requestSubmit();
              }
            }}
          ></textarea>
          <button type="submit">Göndər</button>
        </form>
      </div>
    </div>
  );
};

export default Message;
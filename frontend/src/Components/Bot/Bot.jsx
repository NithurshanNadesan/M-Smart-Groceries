import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import './Bot.css';
import bot_image from '../Assets/bot.jpg';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const Bot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId] = useState(`user-${Math.random().toString(36).substr(2, 9)}`);
  const [isTyping, setIsTyping] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleBotClick = () => {
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to use the Grocify Assistant',
        icon: 'info',
        confirmButtonText: 'Go to Login',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/loginSignup');
        }
      });
      return;
    }
    setIsOpen(!isOpen);
  };

  const saveChatbotLog = async (query) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id) {
        console.log('User not authenticated - skipping log save');
        return;
      }
      
      await axios.post('http://localhost:4000/chatbot-logs', {
        customerFk: user._id,
        query: query
      });
    } catch (error) {
      console.error('Error saving chatbot log:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to use the Grocify Assistant',
        icon: 'info',
        confirmButtonText: 'Go to Login',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/loginSignup');
        }
      });
      return;
    }

    if (!inputMessage.trim() || isTyping) return;

    // Add user message to chat
    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);

    // Save the query to database
    await saveChatbotLog(inputMessage);

    setInputMessage('');
    setIsTyping(true);

    try {
      // Call your backend Dialogflow endpoint
      const response = await axios.post('http://localhost:4000/dialogflow/recommend', {
        sessionId,
        query: inputMessage
      });
      
      // Add bot response to chat
      setMessages(prev => [...prev, { 
        text: response.data.response, 
        sender: 'bot',
        products: response.data.products 
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting to the assistant.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <div className="chatbot-icon" onClick={handleBotClick}>
        <div className="bot-name">Grocify Assistant</div>
        <img src={bot_image} alt="Grocify Assistant" />
      </div>

      {isOpen && isAuthenticated && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h3>Grocify Assistant</h3>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
                {msg.products && msg.products.length > 0 && (
                  <div className="product-suggestions">
                    {msg.products.map(product => (
                      <Link 
                        to={`/product/${product._id}`} 
                        key={product._id} 
                        className="product-link"
                      >
                      <div key={product._id} className="product-suggestion">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="product-image" 
                        />
                        <div className="product-info">
                          <h4>{product.name}</h4>
                          <p>
                            {product.variants[0]?.newPrice && product.variants[0]?.size
                              ? `Rs. ${product.variants[0].newPrice} (${product.variants[0].size})`
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="message bot">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isTyping}
            />
            <button 
              onClick={handleSendMessage}
              disabled={isTyping || !inputMessage.trim()}
            >
              {isTyping ? '...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Bot;
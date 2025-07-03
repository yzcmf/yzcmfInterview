import React, { useEffect, useState } from 'react';
import { api, User, Property } from '../lib/api';

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  property_id: number;
  content: string;
  timestamp: string;
  is_read: boolean;
  sender?: User;
  receiver?: User;
}

interface Conversation {
  property: Property;
  other_user: User;
  messages: Message[];
  unread_count: number;
}

const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // For demo, we'll create mock conversations
    // In real implementation, fetch conversations from API
    const mockConversations: Conversation[] = [
      {
        property: {
          id: 1,
          title: "Cozy Downtown Apartment",
          description: "Beautiful apartment in the heart of the city",
          address: "123 Main St",
          city: "San Francisco",
          state: "CA",
          zip_code: "94102",
          country: "USA",
          price_per_night: 150,
          bedrooms: 2,
          bathrooms: 1,
          max_guests: 4,
          property_type: "apartment",
          amenities: "WiFi, Kitchen, Parking",
          images: "",
          is_available: true,
          owner_id: 1,
          created_at: "",
          updated_at: ""
        },
        other_user: {
          id: 2,
          email: "jane@example.com",
          username: "jane_renter",
          full_name: "Jane Doe",
          phone: "+1-555-0124",
          role: "renter",
          is_active: true,
          is_admin: false,
          created_at: "",
          updated_at: ""
        },
        messages: [
          {
            id: 1,
            sender_id: 2,
            receiver_id: 1,
            property_id: 1,
            content: "Hi! I'm interested in your apartment. Is it still available?",
            timestamp: "2024-01-15T10:00:00Z",
            is_read: true
          },
          {
            id: 2,
            sender_id: 1,
            receiver_id: 2,
            property_id: 1,
            content: "Yes, it's still available! When would you like to check in?",
            timestamp: "2024-01-15T10:30:00Z",
            is_read: false
          }
        ],
        unread_count: 1
      }
    ];
    setConversations(mockConversations);
    setLoading(false);
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    setSending(true);
    try {
      // In real implementation, call api.messages.send()
      const mockMessage: Message = {
        id: Date.now(),
        sender_id: 1, // Current user
        receiver_id: selectedConversation.other_user.id,
        property_id: selectedConversation.property.id,
        content: newMessage,
        timestamp: new Date().toISOString(),
        is_read: false
      };
      
      setSelectedConversation(prev => prev ? {
        ...prev,
        messages: [...prev.messages, mockMessage]
      } : null);
      
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Loading messages...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
        {/* Conversations List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Conversations</h2>
          </div>
          <div className="overflow-y-auto h-80">
            {conversations.map((conversation) => (
              <div
                key={`${conversation.property.id}-${conversation.other_user.id}`}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedConversation?.property.id === conversation.property.id &&
                  selectedConversation?.other_user.id === conversation.other_user.id
                    ? 'bg-blue-50 border-blue-200'
                    : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{conversation.property.title}</div>
                    <div className="text-sm text-gray-600">
                      with {conversation.other_user.full_name || conversation.other_user.username}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {conversation.messages[conversation.messages.length - 1]?.content.substring(0, 50)}...
                    </div>
                  </div>
                  {conversation.unread_count > 0 && (
                    <span className="bg-red-600 text-white text-xs rounded-full px-2 py-1">
                      {conversation.unread_count}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat View */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">
                  {selectedConversation.property.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Chat with {selectedConversation.other_user.full_name || selectedConversation.other_user.username}
                </p>
              </div>
              
              <div className="h-64 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === 1 ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.sender_id === 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div className={`text-xs mt-1 ${
                        message.sender_id === 1 ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sending || !newMessage.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages; 
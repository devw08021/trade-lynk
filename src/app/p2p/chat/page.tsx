'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const conversations = [
  { id: 1, name: 'CryptoKing', avatar: '/avatars/01.png', lastMessage: 'Sure, payment sent!', timestamp: '2m ago', unread: 2, online: true },
  { id: 2, name: 'TraderJane', avatar: '/avatars/02.png', lastMessage: 'Okay, I will release the crypto once payment is confirmed.', timestamp: '1h ago', unread: 0, online: false },
  { id: 3, name: 'SatoshiJr', avatar: '/avatars/03.png', lastMessage: 'Thanks for the fast trade!', timestamp: 'yesterday', unread: 0, online: true },
];

const messages = {
  1: [
    { sender: 'them', text: 'Hi, I have made the payment for the order.', timestamp: '10:30 AM' },
    { sender: 'me', text: 'Great, let me confirm.', timestamp: '10:31 AM' },
    { sender: 'them', text: 'Sure, payment sent!', timestamp: '10:32 AM' },
  ],
  2: [{ sender: 'them', text: 'Ready to trade?', timestamp: '9:00 AM' }],
  3: [{ sender: 'them', text: 'Thanks for the trade!', timestamp: 'yesterday' }],
};

export default function P2PChatPage() {
  const [selectedConvo, setSelectedConvo] = useState(conversations[0]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">P2P Chat</h1>
      <Card className="grid grid-cols-1 md:grid-cols-[350px_1fr] h-[calc(100vh-200px)]">
        
        {/* Conversations List */}
        <div className="flex flex-col border-r">
          <CardHeader className="p-4">
            <div className="relative">
              <Input placeholder="Search conversations..." className="pl-10" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>

          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {conversations.map((convo) => (
                <button
                  key={convo.id}
                  onClick={() => setSelectedConvo(convo)}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-lg w-full text-left transition-colors",
                    selectedConvo.id === convo.id ? "bg-muted" : "hover:bg-muted/50"
                  )}
                >
                  <Avatar className="h-12 w-12 border-2 border-transparent relative">
                    <AvatarImage src={convo.avatar} />
                    <AvatarFallback>{convo.name[0]}</AvatarFallback>
                    {convo.online && (
                      <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
                    )}
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold truncate">{convo.name}</h4>
                      <p className="text-xs text-muted-foreground">{convo.timestamp}</p>
                    </div>
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                      {convo.unread > 0 && <Badge variant="destructive">{convo.unread}</Badge>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Window */}
        <div className="flex flex-col">
          <CardHeader className="flex-row items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={selectedConvo.avatar} />
                <AvatarFallback>{selectedConvo.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{selectedConvo.name}</h3>
                <p className="text-xs text-muted-foreground">{selectedConvo.online ? 'Online' : 'Offline'}</p>
              </div>
            </div>
            {/* Add more actions like view order, etc. */}
          </CardHeader>
          
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {(messages[selectedConvo.id] || []).map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-end gap-3",
                    msg.sender === 'me' ? 'flex-row-reverse' : ''
                  )}
                >
                  {msg.sender !== 'me' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedConvo.avatar} />
                      <AvatarFallback>{selectedConvo.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-xs md:max-w-md rounded-lg p-3",
                      msg.sender === 'me'
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted rounded-bl-none"
                    )}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs text-right mt-1 opacity-70">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <div className="relative">
              <Input placeholder="Type a message..." className="pr-12" />
              <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 
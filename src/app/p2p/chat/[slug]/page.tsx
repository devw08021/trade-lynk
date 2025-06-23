'use client';

import React, { useEffect, useRef, useState, use } from 'react';
import { useAppSelector } from '@/store/store';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { CountdownTimer } from "@/components/ui/CountdownTimer"
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useGetTradeMessagesQuery, useGetTradeQuery, useSendMessageMutation } from '@/services/p2pService';

const TRADE_DURATION_MINUTES = 15;
const PAGE_SIZE = 15;


export default function TradeChatWithLoaderAndTimer({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);;

  const { _id, userCode } = useAppSelector((state) => state.auth.user);

  const [order, setOrder] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(TRADE_DURATION_MINUTES * 60);
  const [page, setPage] = useState(0);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadMoreMessages = () => {
    const totalLoaded = page * PAGE_SIZE;
    const nextPage = page + 1;
    const newMessages = sampleMessages.slice(
      Math.max(0, sampleMessages.length - nextPage * PAGE_SIZE),
      sampleMessages.length - totalLoaded
    );
    setMessages((prev) => [...newMessages, ...prev]);
    setPage(nextPage);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop < 30) {
      loadMoreMessages();
    }
  };

  const handleMessage = async () => {
    if (!inputValue.trim()) return;

    let data = {
      tradeId: slug,
      message: inputValue.trim(),
      attachment: "attachment"
    }
    await sendMessage(data).unwrap();
    // setMessages((prev) => [...prev, { userCode: userCode, text: inputValue.trim(), timestamp: 'Now' }]);
    setInputValue('');
    // scroll to bottom
    setTimeout(() => {
      const el = containerRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, 50);
  };

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const progress = (timeLeft / (TRADE_DURATION_MINUTES * 60)) * 100;

  const { data: offers, isLoading: isLoadingTrade, isError: isTradeError } = useGetTradeQuery({
    tradeId: slug
  });

  useEffect(() => {
    if (offers?.success) {
      setOrder(offers?.data)
    }
  }, [offers])

  const { data: apiMessage, isLoading: isLoadingMessgae, isError: isMessageError } = useGetTradeMessagesQuery({
    tradeId: slug,
    page: page
  });

  useEffect(() => {
    if (apiMessage?.success) {
      setMessages(apiMessage?.data?.data);
    }
  }, [apiMessage])
  const [sendMessage, { isLoading }] = useSendMessageMutation();



  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6" style={{ height: 'calc(100vh - 100px)' }}>
      {/* Order Details Card */}
      {
        isLoadingTrade ? <div className="flex-center py-12">
          <LoadingSpinner size="lg" />
        </div>
          :
          <Card className="flex flex-col h-full overflow-hidden min-h-0">
            <CardHeader>
              <h2 className="text-xl font-semibold">Order Details</h2>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between">
                <span className="font-medium">Trade ID:</span>
                <span>#{order?.orderCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Amount:</span>
                <span>{order?.receiveValue} {order?.firstCoin}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Payment:</span>
                <span>{order?.postId?.payBy}</span>
              </div>

              {/* Circular Timer */}
              <CountdownTimer
                startTime={order?.startTime}
                endTime={order?.endTime}
              />


              {/* {
                ![2, 5, 6].includes(order?.status) && */}
                <div className="p-4 border-t flex gap-2 items-center bg-card z-10">
                  <Button variant="destructive">Paided</Button>

                  <Button variant="destructive">Cancel Trade</Button>

                  <Button variant="destructive">Dispute Request</Button>

                  <Button variant="destructive">Completed</Button>

                </div>
              {/* } */}

            </CardContent>
          </Card>
      }

      {/* Chat Box Card */}
      {
        isLoadingTrade ? <div className="flex-center py-12">
          <LoadingSpinner size="lg" />
        </div>
          :
          <Card className="flex flex-col h-full overflow-hidden min-h-0">
            <CardHeader className="flex items-center gap-4 border-b">
              <Avatar>
                <AvatarImage src="/avatars/01.png" />
                <AvatarFallback>{order?.buyerCode == userCode ? order?.sellerCode : order?.buyerCode}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{order?.buyerCode == userCode ? order?.sellerCode : order?.buyerCode}</h3>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </CardHeader>

            {/* Messages Scroll Area */}
            <div className="flex-1 min-h-0" ref={containerRef} onScroll={handleScroll}>
              <ScrollArea className="h-full p-4 space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'flex items-end gap-2',
                      msg.userCode === userCode ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {msg.userCode !== userCode && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatars/01.png" />
                        <AvatarFallback>{order?.buyerCode == userCode ? order?.sellerCode : order?.buyerCode}</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'rounded-lg p-3 max-w-xs',
                        msg.userCode === userCode
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-muted rounded-bl-none'
                      )}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs text-right mt-1 opacity-70">{msg.createdAt}</p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>

            {/* Message Input */}
            {
              ![2, 5, 6].includes(order?.status) &&
              <div className="p-4 border-t flex gap-2 items-center bg-card z-10">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message..."
                  onKeyDown={(e) => e.key === 'Enter' && handleMessage()}
                />
                <Button size="icon" onClick={handleMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            }

          </Card>
      }
    </div>
  );
}

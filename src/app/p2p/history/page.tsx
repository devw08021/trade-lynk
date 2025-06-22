'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { FileDown, User, ArrowRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type P2PTrade = {
  id: string;
  date: string;
  type: 'Buy' | 'Sell';
  asset: string;
  amount: string;
  price: string;
  counterparty: {
    name: string;
    avatar: string;
  };
  status: 'Completed' | 'Pending' | 'Canceled';
};

const p2pHistory: P2PTrade[] = [
  { id: 'ORD-001', date: '2023-11-10 10:45', type: 'Buy', asset: 'USDT', amount: '1,000 USDT', price: '1.00 USD', counterparty: { name: 'CryptoKing', avatar: '/avatars/01.png' }, status: 'Completed' },
  { id: 'ORD-002', date: '2023-11-09 18:20', type: 'Sell', asset: 'BTC', amount: '0.05 BTC', price: '68,000 USD', counterparty: { name: 'TraderJane', avatar: '/avatars/02.png' }, status: 'Completed' },
  { id: 'ORD-003', date: '2023-11-09 11:00', type: 'Buy', asset: 'ETH', amount: '1.5 ETH', price: '3,850 USD', counterparty: { name: 'SatoshiJr', avatar: '/avatars/03.png' }, status: 'Pending' },
  { id: 'ORD-004', date: '2023-11-08 22:15', type: 'Sell', asset: 'USDT', amount: '5,000 USDT', price: '1.01 USD', counterparty: { name: 'CryptoWhale', avatar: '/avatars/04.png' }, status: 'Canceled' },
];

export default function P2PHistoryPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">P2P History</h1>
        <div className="flex items-center gap-4">
          <DatePickerWithRange />
          <Button variant="outline">
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
            <HistoryTable data={p2pHistory} />
        </CardContent>
      </Card>
    </div>
  );
}

const HistoryTable = ({ data }: { data: P2PTrade[] }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Order ID</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Type</TableHead>
        <TableHead>Asset</TableHead>
        <TableHead>Amount</TableHead>
        <TableHead>Price</TableHead>
        <TableHead>Counterparty</TableHead>
        <TableHead className="text-right">Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map((item) => (
        <TableRow key={item.id}>
          <TableCell className="font-mono text-xs">{item.id}</TableCell>
          <TableCell>{item.date}</TableCell>
          <TableCell>
            <span className={item.type === 'Buy' ? 'text-green-500' : 'text-red-500'}>{item.type}</span>
          </TableCell>
          <TableCell>{item.asset}</TableCell>
          <TableCell>{item.amount}</TableCell>
          <TableCell>{item.price}</TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={item.counterparty.avatar} />
                <AvatarFallback>{item.counterparty.name[0]}</AvatarFallback>
              </Avatar>
              <span>{item.counterparty.name}</span>
            </div>
          </TableCell>
          <TableCell className="text-right">
            <Badge variant={
              item.status === 'Completed' ? 'default'
              : item.status === 'Pending' ? 'secondary'
              : 'destructive'
            }>
              {item.status}
            </Badge>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
); 
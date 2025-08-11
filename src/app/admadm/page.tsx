
'use client';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Calendar, ChevronDown, MoreHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { format } from 'date-fns';

interface FunnelData {
  id: string;
  submittedAt: string;
  group2: string | null;
  group6: string | null;
  group6_1: string | null;
  group6_2: string | null;
  group7: string | null;
  pixel: string | null;
  nome: string | null;
}

async function getFunnelData(): Promise<FunnelData[]> {
    const leadsCollection = collection(db, 'leads');
    const q = query(leadsCollection, orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const data: FunnelData[] = [];
    querySnapshot.forEach((doc) => {
        const docData = doc.data();
        data.push({
            id: doc.id,
            submittedAt: docData.submittedAt ? format(docData.submittedAt.toDate(), "dd 'de' MMM, HH:mm") : '',
            group2: docData.group2 || null,
            group6: docData.group6 || null,
            group6_1: docData.group6_1 || null,
            group6_2: docData.group6_2 || null,
            group7: docData.group7 || null,
            pixel: docData.pixel || null,
            nome: docData.nome || null,
        });
    });
    return data;
}


export default function AdminDashboard() {
  const [funnelData, setFunnelData] = useState<FunnelData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFunnelData()
        .then(data => {
            setFunnelData(data);
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching funnel data: ", error);
            setLoading(false);
        });
  }, []);

  if (loading) {
      return (
        <div className="dark bg-gray-900 text-white min-h-screen p-8 font-sans flex items-center justify-center">
            <p>Carregando dados...</p>
        </div>
      )
  }

  return (
    <div className="dark bg-gray-900 text-white min-h-screen p-8 font-sans">
      <header className="flex justify-end items-center mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-gray-800 border-gray-700">
              Last 7 days
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
            <DropdownMenuItem>Last 30 days</DropdownMenuItem>
            <DropdownMenuItem>Last 90 days</DropdownMenuItem>
            <DropdownMenuItem>All time</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="icon" className="ml-4">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </header>

      <div className="border border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-800">
              <TableRow className="hover:bg-gray-800">
                <TableHead className="w-[50px]">
                  <Checkbox />
                </TableHead>
                <TableHead className="text-white whitespace-nowrap">
                  <Calendar className="inline-block mr-2 h-4 w-4" /> Submitted at
                </TableHead>
                <TableHead className="text-white whitespace-nowrap">Group #2</TableHead>
                <TableHead className="text-white whitespace-nowrap">Group #6</TableHead>
                <TableHead className="text-white whitespace-nowrap">Group #6 (1)</TableHead>
                <TableHead className="text-white whitespace-nowrap">Group #6 (2)</TableHead>
                <TableHead className="text-white whitespace-nowrap">Group #7</TableHead>
                <TableHead className="text-white whitespace-nowrap">&lt;&gt; Pixel</TableHead>
                <TableHead className="text-white whitespace-nowrap">&lt;&gt; nome</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {funnelData.map((row) => (
                <TableRow key={row.id} className="border-gray-700 hover:bg-gray-800/50">
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{row.submittedAt}</TableCell>
                  <TableCell className="whitespace-nowrap">{row.group2}</TableCell>
                  <TableCell className="whitespace-nowrap">{row.group6}</TableCell>
                  <TableCell className="whitespace-nowrap">{row.group6_1}</TableCell>
                  <TableCell className="whitespace-nowrap">{row.group6_2}</TableCell>
                  <TableCell className="whitespace-nowrap">{row.group7}</TableCell>
                  <TableCell className="whitespace-nowrap">{row.pixel}</TableCell>
                  <TableCell className="whitespace-nowrap">{row.nome}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

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

const funnelData = [
  {
    submittedAt: '10 de ago., 21:05',
    group2: 'Sim!',
    group6: 'Ok!',
    group6_1: 'Quero o link!',
    group6_2: null,
    group7: null,
    pixel: null,
    nome: null,
  },
  {
    submittedAt: '10 de ago., 20:45',
    group2: 'Sim!',
    group6: 'Ok!',
    group6_1: null,
    group6_2: null,
    group7: null,
    pixel: null,
    nome: null,
  },
  {
    submittedAt: '10 de ago., 19:30',
    group2: 'Sim!',
    group6: 'Ok!',
    group6_1: 'Quero o link!',
    group6_2: 'Comprado',
    group7: null,
    pixel: '12345',
    nome: 'João',
  },
  {
    submittedAt: '09 de ago., 11:15',
    group2: 'Sim!',
    group6: null,
    group6_1: null,
    group6_2: null,
    group7: null,
    pixel: null,
    nome: null,
  },
];

export default function AdminDashboard() {
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
              {funnelData.map((row, index) => (
                <TableRow key={index} className="border-gray-700 hover:bg-gray-800/50">
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

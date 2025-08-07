
'use client';

import { useEffect, useRef, type FC } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { DisplayMessage } from '@/lib/conversation';

const ReadReceipt: FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38.626 24.684" className="inline-block w-4 h-4 ml-1">
        <g transform="translate(-708.9 -601.383)">
            <path d="M728.035,623.468l1.382,1.482,17.929-20.334" transform="translate(-1.937 -1.117)" fill="none" stroke="#4fc3f7" strokeLinecap="round" strokeWidth="3"></path>
            <path d="M712.017,616.07l7.088,8.039,17.757-20.14" transform="translate(-1 -0.469)" fill="none" stroke="#4fc3f7" strokeLinecap="round" strokeWidth="3"></path>
        </g>
    </svg>
);


const ChatBubble: FC<{ message: DisplayMessage }> = ({ message }) => {
    const isBot = message.sender === 'bot';
    const bubbleClass = isBot
        ? 'bg-incoming-bubble self-start rounded-tr-lg'
        : 'bg-outgoing-bubble self-end rounded-tl-lg';
    
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cn('message-bubble relative max-w-[80%] md:max-w-[65%] w-fit px-3 py-2 rounded-lg shadow-sm', bubbleClass, isBot ? 'bot' : 'user')}
        >
            {message.type === 'text' && (
                <p className="text-gray-800 whitespace-pre-wrap">
                    {message.content}
                </p>
            )}
            {message.type === 'image' && (
                <Image 
                    src={message.content}
                    alt="shared image"
                    width={300}
                    height={300}
                    className="rounded-md"
                    data-ai-hint="advertisement result"
                />
            )}
            <div className="text-xs text-gray-400 text-right mt-1">
                {message.timestamp}
                {isBot && message.status === 'read' && <ReadReceipt />}
            </div>
        </motion.div>
    );
};

const InfoMessage: FC = () => (
    <div className="info-message-container">
        <div className="info-message">
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4b5e63" fillRule="evenodd" clipRule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75ZM12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z"></path>
            </svg>
            <p>Esta é uma conta comercial</p>
        </div>
    </div>
);


const ChatMessages: FC<{ messages: DisplayMessage[] }> = ({ messages }) => {
    return (
        <div className="flex-1 p-4 space-y-4">
            <InfoMessage />
            <AnimatePresence>
                {messages.map((msg) => (
                    <div key={msg.id} className="flex flex-col">
                        <ChatBubble message={msg} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ChatMessages;

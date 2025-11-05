
'use client';

import { useState, useEffect, useRef } from 'react';
import { conversationScript, type DisplayMessage, type ScriptItem } from '@/lib/conversation';
import WhatsappHeader from '@/components/whatsapp-chat/WhatsappHeader';
import ChatMessages from '@/components/whatsapp-chat/ChatMessages';
import ActionButtons from '@/components/whatsapp-chat/ActionButtons';
import { updateLeadProgress } from '@/services/leadService';
import { v4 as uuidv4 } from 'uuid';

const getUserId = () => {
  if (typeof window === 'undefined') return null;
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem('userId', userId);
  }
  return userId;
}

export default function Home() {
    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [status, setStatus] = useState('Online');
    const [activeButtons, setActiveButtons] = useState<ScriptItem['buttons']>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const userIdRef = useRef<string | null>(null);

    useEffect(() => {
        userIdRef.current = getUserId();
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, activeButtons]);

    useEffect(() => {
        if (currentStep >= conversationScript.length) {
            setStatus('Online');
            return;
        }

        const step = conversationScript[currentStep];

        if (step.type === 'bot') {
            const processBotMessage = () => {
                setStatus('digitando...');
                
                const newMessage: DisplayMessage = {
                    id: `bot-${Date.now()}-${Math.random()}`,
                    sender: 'bot',
                    type: step.contentType || 'text',
                    content: step.content || '',
                    timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    status: 'sent',
                };

                setTimeout(() => {
                    setMessages((prev) => [...prev, newMessage]);
                    setStatus('Online');
                    
                    setTimeout(() => {
                        setMessages((prev) => prev.map((m) => (m.id === newMessage.id ? { ...m, status: 'read' } : m)));
                    }, 400);
                    
                    setCurrentStep((prev) => prev + 1);
                }, 1200);
            }
            
            const timer = setTimeout(processBotMessage, step.delay);
            return () => clearTimeout(timer);
        } else if (step.type === 'userAction') {
            const timer = setTimeout(() => {
                setActiveButtons(step.buttons);
            }, step.delay);
            return () => clearTimeout(timer);
        }
    }, [currentStep]);

    const handleButtonClick = (button: NonNullable<ScriptItem['buttons']>[0]) => {
        if (userIdRef.current && button.progressStep) {
            updateLeadProgress(userIdRef.current, button.progressStep, button.text);
        }
        
        if (button.action === 'redirect' && button.url) {
            window.location.href = button.url;
            return;
        }
        
        if (button.action === 'checkout') {
            // Redirect to the old link instead of opening the checkout
            window.location.href = 'https://go.pepperpay.com.br/0qvu6';
            return;
        }

        const userMessage: DisplayMessage = {
            id: `user-${Date.now()}`,
            sender: 'user',
            type: 'text',
            content: button.text,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, userMessage]);
        setActiveButtons([]);
        setCurrentStep((prev) => prev + 1);
    };

    return (
        <>
            <main 
                className="flex flex-col h-screen max-h-screen overflow-hidden"
                style={{ 
                    backgroundImage: 'url(https://s3.typebot.io/public/workspaces/cme0in7zf0022jo04wbcry6pa/typebots/vmq15sy6m7awugtgcsxl42dq/blocks/rmkt86vk7r985fy1ekip6xvp?v=1754527793735)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <WhatsappHeader status={status} />
                <div ref={chatContainerRef} className="chat-container flex-1 overflow-y-auto pb-4">
                    <ChatMessages messages={messages} />
                </div>
                {activeButtons.length > 0 && (
                    <ActionButtons buttons={activeButtons} onButtonClick={handleButtonClick} />
                )}
            </main>
        </>
    );
}


'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, X } from 'lucide-react';
import Script from 'next/script';
import { useToast } from '@/hooks/use-toast';
import { paymentConfig } from '@/lib/config';
import { checkPaymentStatus } from '@/app/actions';

interface PixModalProps {
  pixData: {
    qr_code: string;
    transaction_id: string;
    total_amount: number;
  };
  onClose: () => void;
  onPaymentSuccess?: () => void;
}

const PixModal: React.FC<PixModalProps> = ({ pixData, onClose, onPaymentSuccess }) => {
    const { toast } = useToast();
    const [expiration, setExpiration] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    const qrCodeRef = useRef<HTMLDivElement>(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    // Generate QR Code when script is loaded and we have data
    useEffect(() => {
        if (isScriptLoaded && pixData.qr_code && qrCodeRef.current) {
            qrCodeRef.current.innerHTML = ''; // Clear previous QR Code
            new (window as any).QRCode(qrCodeRef.current, {
                text: pixData.qr_code,
                width: 150,
                height: 150,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: (window as any).QRCode.CorrectLevel.M
            });
        }
    }, [isScriptLoaded, pixData.qr_code]);

    // Set expiration timer
    useEffect(() => {
        const expirationDate = new Date(Date.now() + paymentConfig.pixExpirationMinutes * 60 * 1000);
        const formattedDate = new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        }).format(expirationDate).replace(',', '');
        setExpiration(formattedDate);
    }, [pixData.transaction_id]);


    // Check payment status periodically
    useEffect(() => {
        if (!pixData.transaction_id || isPaid) return;

        const interval = setInterval(async () => {
            const result = await checkPaymentStatus(pixData.transaction_id);
            if (result.status === 'paid') {
                setIsPaid(true);
                clearInterval(interval);
            }
        }, 3000); // Check every 3 seconds

        return () => clearInterval(interval);
    }, [pixData.transaction_id, isPaid]);


    const handleCopy = () => {
        navigator.clipboard.writeText(pixData.qr_code);
        toast({
            title: "Copiado!",
            description: "Chave PIX copiada para a área de transferência.",
            className: "bg-accent text-accent-foreground border-0"
        });
    };
    
    if (isPaid) {
        return (
             <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-md mx-auto text-gray-200 relative p-8 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                        <Check className="w-10 h-10 text-gray-900" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Pagamento Aprovado!</h2>
                    <p className="text-gray-400 mb-6">Obrigado por sua compra. Você será redirecionado.</p>
                    <Button onClick={onPaymentSuccess} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                        Continuar
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <Script
                src="https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs/qrcode.min.js"
                onLoad={() => setIsScriptLoaded(true)}
            />
            <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-md mx-auto text-gray-200 relative animate-in fade-in zoom-in-95 flex flex-col">
                 <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors z-10">
                    <X size={24} />
                </button>
                 <div className="text-center p-6 flex flex-col items-center">
                    <h2 className="text-xl font-bold text-white mb-4">Pagamento via PIX</h2>
                    
                    <div style={{ background: 'white', padding: '16px', borderRadius: '8px' }}>
                       <div ref={qrCodeRef}>
                         {!isScriptLoaded && <div className="w-[150px] h-[150px] bg-gray-300 animate-pulse rounded-md" />}
                       </div>
                    </div>

                    <div className="w-full mt-6">
                        <Input 
                            type="text" 
                            readOnly 
                            value={pixData.qr_code}
                            className="bg-gray-800 border-gray-700 text-white pr-4 truncate text-center font-mono"
                        />
                    </div>
                    <Button onClick={handleCopy} className="mt-3 w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                        <Copy size={16} className="mr-2" />
                        Copiar código PIX
                    </Button>

                    <div className="text-sm text-gray-400 mt-4 space-y-1">
                        <p>💰 Valor: <strong className="text-white">R$ {(pixData.total_amount / 100).toFixed(2).replace('.', ',')}</strong></p>
                        <p>🕒 Válido até: <span className="text-white">{expiration}</span></p>
                    </div>

                    <p className="mt-4 font-bold text-accent text-sm">Pagamento seguro via PIX</p>
                    
                    <Button onClick={onClose} variant="link" className="mt-2 text-gray-400 hover:text-white">
                        Fechar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PixModal;

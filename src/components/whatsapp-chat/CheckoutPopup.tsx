
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Lock, Copy, Check } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import QRCode from 'react-qr-code';


interface CheckoutPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

const orderBumps = [
    { id: 'bump1', title: 'Acesso a todos os métodos de ganhar dinheiro', price: 19.90, description: 'Aqui eu vou liberar todos os métodos que eu conheço de ganhar dinheiro na internet, e você vai receber todos os que lançarem daqui para frente também.' },
    { id: 'bump2', title: 'Acesso vitalício!', price: 9.90, description: 'Receba acesso vitalício ao método.' }
];

const OrderBumpCard: React.FC<{ bump: any; isChecked: boolean; onCheckedChange: (checked: boolean) => void }> = ({ bump, isChecked, onCheckedChange }) => {
    return (
        <div
            onClick={() => onCheckedChange(!isChecked)}
            className={cn(
                "bg-gray-800/50 rounded-xl p-4 border-2 transition-all cursor-pointer",
                isChecked ? 'border-accent shadow-lg shadow-accent/20' : 'border-gray-700 hover:border-accent/50'
            )}
        >
            <div className="flex items-start">
                <div className="relative flex items-center shrink-0 w-5 h-5 mt-1">
                    <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => onCheckedChange(e.target.checked)}
                        className="opacity-0 absolute w-full h-full cursor-pointer"
                    />
                    <div 
                        className={cn(
                            "flex items-center justify-center w-5 h-5 border-2 rounded transition-all",
                            isChecked ? 'bg-accent border-accent' : 'bg-transparent border-accent'
                        )}
                    >
                        {isChecked && <Check className="w-4 h-4 text-gray-900" />}
                    </div>
                </div>

                <div className="ml-4 flex-1">
                     <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-col mr-2">
                           <span className="text-accent text-sm font-bold">Sim, eu quero!</span>
                           <span className="text-white font-semibold text-[1.05rem] leading-tight">{bump.title}</span>
                        </div>
                        <p className="font-bold text-lg text-accent whitespace-nowrap ml-3">+ R$ {bump.price.toFixed(2).replace('.', ',')}</p>
                    </div>

                    {bump.description && (
                        <div className={cn(
                            "text-xs text-gray-400 pl-0 mt-2 pt-2",
                            bump.id === 'bump1' ? 'border-t border-dashed border-gray-700' : 'border-t-0'
                        )}>
                            {bump.description}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PixDisplay: React.FC<{onClose: () => void, pixKey: string, totalPrice: number}> = ({onClose, pixKey, totalPrice}) => {
    const { toast } = useToast();
    const [expiration, setExpiration] = useState('');

    useEffect(() => {
        const expirationDate = new Date(Date.now() + 5 * 60 * 1000);
        const formattedDate = new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(expirationDate).replace(',', '');
        setExpiration(formattedDate);
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(pixKey);
        toast({
            title: "Copiado!",
            description: "Chave PIX copiada para a área de transferência.",
            className: "bg-accent text-accent-foreground border-0"
        });
    }

    return (
        <div className="text-center p-6 flex flex-col items-center bg-gray-900">
            <h2 className="text-xl font-bold text-white mb-4">Pagamento via PIX</h2>
            
            <div style={{ background: 'white', padding: '16px', borderRadius: '8px' }}>
                <QRCode value={pixKey} size={150} />
            </div>

            <div className="w-full mt-6">
                <Input 
                    type="text" 
                    readOnly 
                    value={pixKey}
                    className="bg-gray-800 border-gray-700 text-white pr-4 truncate text-center font-mono"
                />
            </div>
            <Button onClick={handleCopy} className="mt-3 w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                <Copy size={16} className="mr-2" />
                Copiar código PIX
            </Button>

            <div className="text-sm text-gray-400 mt-4 space-y-1">
                <p>💰 Valor: <strong className="text-white">R$ {totalPrice.toFixed(2).replace('.', ',')}</strong></p>
                <p>🕒 Válido até: <span className="text-white">{expiration}</span></p>
            </div>

            <p className="mt-4 font-bold text-accent text-sm">Pagamento seguro via PIX</p>
            
            <Button onClick={onClose} variant="link" className="mt-2 text-gray-400 hover:text-white">
                Finalizar
            </Button>
        </div>
    )
}


const CheckoutPopup: React.FC<CheckoutPopupProps> = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBumps, setSelectedBumps] = useState<string[]>([]);
  const [view, setView] = useState<'form' | 'pix'>('form');

  const pixKey = "00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913NOME DO LOJISTA6008BRASILIA62070503***6304E2D3";

  if (!isOpen) {
    return null;
  }
  
  const basePrice = 19.90;
  const totalBumpsPrice = selectedBumps.reduce((total, bumpId) => {
    const bump = orderBumps.find(b => b.id === bumpId);
    return total + (bump ? bump.price : 0);
  }, 0);
  const totalPrice = basePrice + totalBumpsPrice;

  const handleBumpChange = (bumpId: string, checked: boolean) => {
    setSelectedBumps(prev => 
      checked ? [...prev, bumpId] : prev.filter(id => id !== bumpId)
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }
    setError('');
    setIsLoading(true);
    
    onSubmit(email);
    
    setTimeout(() => {
        setIsLoading(false);
        setView('pix');
    }, 1000)
  };

  const handleClose = () => {
      setView('form');
      onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2">
        <div className="bg-header-background rounded-lg shadow-2xl w-full max-w-md mx-auto text-gray-200 relative animate-in fade-in zoom-in-95 max-h-[95vh] flex flex-col">
            <button onClick={handleClose} className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors z-10">
                <X size={24} />
            </button>
            
            {view === 'form' ? (
                <div className="p-6 overflow-y-auto">
                    <div className="text-center mb-6">
                        <p className="text-sm text-gray-400 mb-2">GARANTA O SEU ACESSO:</p>
                        <div className="flex items-center justify-center space-x-4">
                            <Image src="https://s3.typebot.io/public/workspaces/cm8gbxl5b000ba3ncy4y16grd/typebots/cmh096k1s0001k404bj3cxex3/blocks/t6whk2rk3yrzzm8zwiaf6wt0?v=1761822488273" alt="Chapeu Preto" width={60} height={60} className="rounded-md bg-gray-800" data-ai-hint="man anonymous"/>
                            <div>
                                <h3 className="font-bold text-lg text-white">Metodo IA (GANHE 10K POR MÊS)</h3>
                                <p className="text-2xl font-bold text-accent">R$ {basePrice.toFixed(2).replace('.',',')}</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-gray-800/50 rounded-lg p-5">
                            <h3 className="font-bold text-lg mb-4 flex items-center"><span className="bg-accent text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold mr-2">1</span> DADOS PESSOAIS</h3>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="email" className="text-xs font-medium text-gray-400">SEU MELHOR E-MAIL</Label>
                                    <Input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-700 border-gray-600 text-white" />
                                    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h3 className="text-center text-lg font-bold text-accent tracking-wider uppercase">Opções Exclusivas</h3>
                            {orderBumps.map((bump) => (
                            <OrderBumpCard
                                    key={bump.id}
                                    bump={bump}
                                    isChecked={selectedBumps.includes(bump.id)}
                                    onCheckedChange={(checked) => handleBumpChange(bump.id, checked)}
                            />
                            ))}
                        </div>

                        <div className="border-t border-dashed border-gray-700 pt-4 mt-6">
                            <div className="flex justify-between items-center text-lg mb-4">
                                <span className="font-semibold">Valor total:</span>
                                <span className="font-bold text-accent text-2xl">R$ {totalPrice.toFixed(2).replace('.',',')}</span>
                            </div>
                            <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg py-6 rounded-lg transition-all flex items-center justify-center">
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                    PROCESSANDO...
                                </>
                            ) : 'COMPRAR AGORA'}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-4 text-center text-gray-500 text-xs flex items-center justify-center gap-2">
                        <Lock size={12} />
                        <span>Ambiente criptografado e 100% seguro.</span>
                    </div>
                </div>
            ) : (
                <PixDisplay onClose={handleClose} pixKey={pixKey} totalPrice={totalPrice} />
            )}
        </div>
    </div>
  );
};

export default CheckoutPopup;

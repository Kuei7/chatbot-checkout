
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Lock, Copy } from 'lucide-react';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
                isChecked ? 'border-accent shadow-lg shadow-accent/20' : 'border-transparent hover:border-accent/50'
            )}
        >
            <div className="flex items-start">
                <Checkbox
                    id={bump.id}
                    checked={isChecked}
                    onCheckedChange={onCheckedChange}
                    className="mt-1 size-5 rounded border-2 border-accent data-[state=checked]:bg-accent data-[state=checked]:text-primary-foreground shrink-0"
                />
                <div className="ml-3 flex-1">
                    <div className="flex justify-between items-baseline mb-1">
                        <p className="font-bold text-base text-white">{bump.title}</p>
                        <p className="font-bold text-base text-accent whitespace-nowrap ml-3">+ R$ {bump.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                     {bump.description && (
                        <div className={cn(
                            "text-xs text-gray-400 pl-[2px]", 
                            bump.id === 'bump1' ? 'mt-2 pt-2 border-t border-dashed border-gray-700' : 'mt-1'
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

    const handleCopy = () => {
        navigator.clipboard.writeText(pixKey);
        toast({
            title: "Chave PIX copiada!",
            description: "Agora você pode colar no seu app do banco.",
        });
    }

    return (
        <div className="text-center p-6 flex flex-col items-center">
            <h2 className="text-xl font-bold text-accent mb-2">Pague com PIX para liberar seu acesso!</h2>
            <p className="text-gray-400 text-sm mb-4">Escaneie o QR Code ou copie a chave abaixo.</p>
            <div className="p-2 bg-white rounded-lg">
                <Image src="https://i.postimg.cc/L8p5g3j2/qr-code-pix.png" alt="PIX QR Code" width={200} height={200} data-ai-hint="QR code" />
            </div>
            <p className="text-gray-400 mt-4 text-sm">Valor: <span className="font-bold text-white">R$ {totalPrice.toFixed(2).replace('.', ',')}</span></p>

            <div className="w-full mt-6">
                <p className="text-xs text-gray-400 mb-1">PIX Copia e Cola:</p>
                <div className="relative">
                    <Input 
                        type="text" 
                        readOnly 
                        value={pixKey}
                        className="bg-gray-700 border-gray-600 text-white pr-10 truncate"
                    />
                    <Button variant="ghost" size="icon" onClick={handleCopy} className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-white">
                        <Copy size={16} />
                    </Button>
                </div>
            </div>
            <div className="mt-6 text-xs text-gray-400 bg-gray-800/50 p-3 rounded-lg">
                <p>Após o pagamento, o seu acesso será enviado para o e-mail cadastrado.</p>
            </div>
            <Button onClick={onClose} className="mt-6 w-full bg-accent/80 hover:bg-accent/70">
                Já fiz o pagamento!
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

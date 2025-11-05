
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Lock } from 'lucide-react';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CheckoutPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

const orderBumps = [
    { id: 'bump1', title: 'Acesso a todos os métodos de ganhar dinheiro', price: 19.90, description: 'Aqui eu vou liberar todos os metodos que eu conheço de ganhar dinheiro na internet, e você vai receber todos os que lançarem daqui para frente tambem' },
    { id: 'bump2', title: 'Acesso vitalício!', price: 9.90, description: 'Receba acesso vitalício ao método.' }
];

const CheckoutPopup: React.FC<CheckoutPopupProps> = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBumps, setSelectedBumps] = useState<string[]>([]);

  if (!isOpen) {
    return null;
  }
  
  const basePrice = 19.90;
  const totalBumpsPrice = selectedBumps.reduce((total, bumpId) => {
    const bump = orderBumps.find(b => b.id === bumpId);
    return total + (bump ? bump.price : 0);
  }, 0);
  const totalPrice = basePrice + totalBumpsPrice;

  const handleBumpChange = (bumpId: string) => {
    setSelectedBumps(prev => 
      prev.includes(bumpId) ? prev.filter(id => id !== bumpId) : [...prev, bumpId]
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
    // Simulate API call
    setTimeout(() => {
        onSubmit(email);
        setIsLoading(false);
    }, 1500)
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2">
        <div className="bg-header-background rounded-lg shadow-2xl w-full max-w-md mx-auto text-gray-200 relative animate-in fade-in zoom-in-95 max-h-[95vh] flex flex-col">
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors z-10">
            <X size={24} />
            </button>
            
            <div className="p-6 overflow-y-auto">
                <div className="text-center mb-6">
                    <p className="text-sm text-gray-400 mb-2">VOCÊ ESTÁ ADQUIRINDO:</p>
                    <div className="flex items-center justify-center space-x-4">
                        <Image src="https://s3.typebot.io/public/workspaces/cm8gbxl5b000ba3ncy4y16grd/typebots/cmh096k1s0001k404bj3cxex3/blocks/t6whk2rk3yrzzm8zwiaf6wt0?v=1761822488273" alt="Chapeu Preto" width={60} height={60} className="rounded-md bg-gray-800" data-ai-hint="man anonymous"/>
                        <div>
                            <h3 className="font-bold text-lg text-white">Chapéu Preto (10k por mês)</h3>
                            <p className="text-2xl font-bold text-accent">3x R$ 7,22</p>
                            <p className="text-xs text-gray-400">Ou R$ 19,90 à vista</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-incoming-bubble p-5 rounded-lg">
                        <h3 className="font-bold text-lg mb-4 flex items-center"><span className="bg-accent text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold mr-2">1</span> DADOS PESSOAIS</h3>
                        <div className="space-y-4">
                             <div>
                                <Label htmlFor="email" className="text-xs font-medium text-gray-400">SEU MELHOR E-MAIL</Label>
                                <Input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-700 border-gray-600 text-white" />
                                {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-incoming-bubble p-5 rounded-lg">
                        <h3 className="font-bold text-lg mb-4 flex items-center"><span className="bg-accent text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold mr-2">2</span> PAGAMENTO</h3>
                        <div className="bg-gray-700 p-4 rounded-md text-center">
                            <p className="font-semibold">Pagamento via PIX</p>
                            <p className="text-sm text-gray-400">Clique em "COMPRAR AGORA" para gerar o código PIX.</p>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <p className="text-center font-semibold">Turbine sua compra com um <span className="text-accent">desconto exclusivo</span>:</p>
                        {orderBumps.map(bump => (
                            <div key={bump.id} className="bg-incoming-bubble border-2 border-dashed border-gray-700 rounded-lg p-3 flex items-start gap-3 has-[:checked]:border-accent transition-all">
                                <Checkbox id={bump.id} onCheckedChange={() => handleBumpChange(bump.id)} className="mt-1 size-5 border-gray-500 data-[state=checked]:bg-accent data-[state=checked]:text-primary-foreground data-[state=checked]:border-accent" />
                                <Label htmlFor={bump.id} className="flex-1 cursor-pointer">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-red-500">Sim, eu quero!</span>
                                        <span className="font-bold text-accent">+ R$ {bump.price.toFixed(2).replace('.',',')}</span>
                                    </div>
                                    <p className="font-bold text-white">{bump.title}</p>
                                    <p className="text-xs text-gray-400 mt-1">{bump.description}</p>
                                </Label>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-dashed border-gray-700 pt-4 mt-6">
                        <div className="flex justify-between items-center text-lg mb-4">
                            <span className="font-semibold">Valor total:</span>
                            <span className="font-bold text-accent">R$ {totalPrice.toFixed(2).replace('.',',')}</span>
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
        </div>
    </div>
  );
};

export default CheckoutPopup;

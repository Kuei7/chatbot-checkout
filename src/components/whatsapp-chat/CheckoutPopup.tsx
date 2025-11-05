
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CheckoutPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

const orderBumps = [
    { id: 'bump1', title: 'Grupo VIP + Acesso Antecipado', price: 9.90, description: 'Participe do nosso grupo exclusivo e receba atualizações antes de todo mundo.' },
    { id: 'bump2', title: 'Pack de Ferramentas IA', price: 14.90, description: 'Um conjunto de ferramentas para potencializar ainda mais seus resultados.' }
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
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-secondary rounded-lg shadow-2xl w-full max-w-sm mx-auto text-foreground relative animate-in fade-in zoom-in-95">
        <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors">
          <X size={24} />
        </button>
        
        <header className="bg-background/50 text-center py-4 rounded-t-lg">
          <h2 className="text-lg font-semibold">Compra Segura e Rápida</h2>
        </header>

        <div className="p-6">
            <p className="text-sm text-muted-foreground font-medium mb-4">Você está adquirindo:</p>
            <div className="flex items-center space-x-4 mb-6">
                <Image src="https://i.postimg.cc/5jdp32QJ/Icone-Azul-Diamantado.png" alt="Metodo IA" width={64} height={64} className="rounded-lg border-2 border-border p-1" data-ai-hint="logo abstract"/>
                <div>
                    <h3 className="font-bold text-lg">Metodo IA</h3>
                    <p className="text-xl font-semibold text-primary">R$ 19,90</p>
                </div>
            </div>

             {/* Order Bumps */}
            <div className="space-y-3 mb-6">
                {orderBumps.map(bump => (
                    <div key={bump.id} className="bg-background/30 border border-border rounded-lg p-3 flex items-center gap-3 has-[:checked]:border-primary has-[:checked]:bg-primary/10 transition-all">
                        <Checkbox 
                            id={bump.id} 
                            onCheckedChange={() => handleBumpChange(bump.id)}
                            className="size-5"
                        />
                        <Label htmlFor={bump.id} className="flex-1 cursor-pointer">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">{bump.title}</span>
                                <span className="font-bold text-primary">+ R$ {bump.price.toFixed(2).replace('.',',')}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{bump.description}</p>
                        </Label>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">E-mail</Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="seu@email.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 bg-input border-border focus:outline-none focus:ring-2 focus:ring-primary transition rounded-lg text-foreground"
                    />
                    {error && <p className="text-destructive text-xs mt-2">{error}</p>}
                </div>
                
                <div className="border-t border-dashed border-border pt-4 mt-4">
                    <div className="flex justify-between items-center text-lg">
                        <span className="font-semibold">Total:</span>
                        <span className="font-bold text-primary">R$ {totalPrice.toFixed(2).replace('.',',')}</span>
                    </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full p-4 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg uppercase rounded-lg transition-all flex items-center justify-center">
                   {isLoading ? (
                       <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Processando...
                       </>
                   ) : 'PAGAR AGORA'}
                </Button>
            </form>

            <div className="mt-4 text-center text-muted-foreground text-sm">
                <p>Pagamento seguro via <strong>PIX</strong> com aprovação imediata.</p>
            </div>
             <p className="text-center text-xs text-muted-foreground/70 mt-6">Compra 100% segura. Reembolso garantido em até 7 dias.</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPopup;

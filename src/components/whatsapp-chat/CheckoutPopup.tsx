
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import Image from 'next/image';

interface CheckoutPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

const CheckoutPopup: React.FC<CheckoutPopupProps> = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) {
    return null;
  }
  
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
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm mx-auto text-white relative animate-in fade-in zoom-in-95">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors">
          <X size={24} />
        </button>
        
        <header className="bg-gray-900 text-center py-4 rounded-t-2xl">
          <h2 className="text-lg font-semibold">Compra Segura e Rápida</h2>
        </header>

        <div className="p-6">
            <p className="text-sm text-gray-400 font-medium mb-4">Você está adquirindo:</p>
            <div className="flex items-center space-x-4 mb-6">
                <Image src="https://i.postimg.cc/5jdp32QJ/Icone-Azul-Diamantado.png" alt="Metodo IA" width={64} height={64} className="rounded-lg border-2 border-gray-700 p-1" data-ai-hint="logo abstract"/>
                <div>
                    <h3 className="font-bold text-lg">Metodo IA</h3>
                    <p className="text-xl font-semibold text-green-400">R$ 19,90</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="seu@email.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 bg-gray-700 border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition rounded-lg text-white"
                    />
                    {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                </div>

                <Button type="submit" disabled={isLoading} className="w-full p-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg uppercase rounded-lg transition-all flex items-center justify-center">
                   {isLoading ? (
                       <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Processando...
                       </>
                   ) : 'PAGAR AGORA'}
                </Button>
            </form>

            <div className="mt-4 text-center text-gray-500 text-sm">
                <p>Pagamento seguro via <strong>PIX</strong> com aprovação imediata.</p>
            </div>
             <p className="text-center text-xs text-gray-600 mt-6">Compra 100% segura. Reembolso garantido em até 7 dias.</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPopup;

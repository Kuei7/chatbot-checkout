
'use client';

import { useEffect, useState, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { X, Lock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { processPayment } from '@/app/actions';
import PixModal from '@/components/whatsapp-chat/PixModal';

const initialState = {
  pixData: null,
  error: null,
};

interface CheckoutPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailSubmit: (email: string) => void;
  onPaymentSuccess: () => void;
}

const orderBumps = [
    { id: 'bump1', title: 'Sim, eu quero!', subtitle: 'Acesso a todos os métodos de ganhar dinheiro', price: 19.90, description: 'Aqui eu vou liberar todos os métodos que eu conheço de ganhar dinheiro na internet, e você vai receber todos os que lançarem daqui para frente também.', offerHash: 'offer_5a507a2745a74e57' },
    { id: 'bump2', title: 'Sim, eu quero!', subtitle: 'Acesso vitalício!', price: 9.90, description: 'Receba acesso vitalício ao método.', offerHash: 'offer_f8435d836371c19b' }
];

const OrderBumpCard: React.FC<{ bump: any; isChecked: boolean; onCheckedChange: (checked: boolean) => void }> = ({ bump, isChecked, onCheckedChange }) => {
    return (
        <div
            onClick={() => onCheckedChange(!isChecked)}
            className={cn(
                "bg-[#2C2C40] rounded-xl p-4 border-2 transition-all cursor-pointer",
                isChecked ? 'border-accent shadow-lg shadow-accent/20' : 'border-[#444466] hover:border-accent/50'
            )}
        >
            <div className="flex items-start">
                 <input
                    type="checkbox"
                    id={bump.id}
                    name="orderbump"
                    value={bump.offerHash}
                    checked={isChecked}
                    onChange={(e) => onCheckedChange(e.target.checked)}
                    className="opacity-0 absolute w-0 h-0"
                />
                 <div className="relative flex items-center justify-center shrink-0 w-5 h-5 mt-1 mr-4">
                    <div
                        className={cn(
                            "flex items-center justify-center w-5 h-5 border-2 rounded-md transition-all",
                            isChecked ? 'bg-accent border-accent' : 'bg-transparent border-accent'
                        )}
                    >
                        {isChecked && <Check className="w-4 h-4 text-gray-900" />}
                    </div>
                </div>
                
                <div className="flex-1">
                     <div className="flex justify-between items-center gap-3">
                        <div className="flex flex-col">
                           <span className="text-accent font-semibold text-xs leading-tight">{bump.title}</span>
                           <span className="text-white font-bold text-base leading-tight mt-1">{bump.subtitle}</span>
                        </div>
                        <p className="font-bold text-lg text-accent whitespace-nowrap">+ R$ {bump.price.toFixed(2).replace('.', ',')}</p>
                    </div>

                    {bump.description && (
                        <div className={cn(
                            "text-xs text-gray-400 pl-0 mt-3 pt-3",
                            bump.id === 'bump1' && 'border-t border-dashed border-gray-700'
                        )}>
                            {bump.description}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const SubmitButton = () => {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg py-6 rounded-lg transition-all flex items-center justify-center">
            {pending ? (
                <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    PROCESSANDO...
                </>
            ) : 'COMPRAR AGORA'}
        </Button>
    );
};

const CheckoutForm: React.FC<{
    onBumpsChange: (bumps: string[]) => void;
    selectedBumps: string[];
    totalPrice: number;
    onPaymentSuccess: () => void;
}> = ({ onBumpsChange, selectedBumps, totalPrice, onPaymentSuccess }) => {

    const [state, formAction] = useActionState(processPayment, initialState);
    const [isPixModalOpen, setPixModalOpen] = useState(false);
    
    useEffect(() => {
        if (state.pixData) {
            setPixModalOpen(true);
        }
    }, [state]);

    return (
        <>
            <form action={formAction} className="space-y-6">
                <div className="bg-gray-800/50 rounded-lg p-5">
                    <h3 className="font-bold text-lg mb-4 flex items-center"><span className="bg-accent text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold mr-2">1</span> DADOS PESSOAIS</h3>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="text-xs font-medium text-gray-400">SEU MELHOR E-MAIL</Label>
                            <Input type="email" id="email" name="email" required className="bg-gray-700 border-gray-600 text-white" />
                        </div>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <h3 className="text-center text-lg font-bold text-accent tracking-wider uppercase">OPÇÕES EXCLUSIVAS</h3>
                    {orderBumps.map((bump) => (
                    <OrderBumpCard
                            key={bump.id}
                            bump={bump}
                            isChecked={selectedBumps.includes(bump.offerHash)}
                            onCheckedChange={(checked) => {
                                const newBumps = checked 
                                    ? [...selectedBumps, bump.offerHash]
                                    : selectedBumps.filter(hash => hash !== bump.offerHash);
                                onBumpsChange(newBumps);
                                // This is a hidden input to pass the bumps to the server action
                                const form = document.querySelector('form');
                                if (form) {
                                    // Remove existing hidden inputs to avoid duplicates
                                    form.querySelectorAll('input[name="orderbump"]').forEach(el => {
                                        if(el.getAttribute('type') === 'hidden') el.remove()
                                    });
                                    // Add new hidden inputs
                                    newBumps.forEach(bumpHash => {
                                        const input = document.createElement('input');
                                        input.type = 'hidden';
                                        input.name = 'orderbump';
                                        input.value = bumpHash;
                                        form.appendChild(input);
                                    });
                                }
                            }}
                    />
                    ))}
                </div>

                <div className="border-t border-dashed border-gray-700 pt-4 mt-6">
                    <div className="flex justify-between items-center text-lg mb-4">
                        <span className="font-semibold">Valor total:</span>
                        <span className="font-bold text-accent text-2xl">R$ {totalPrice.toFixed(2).replace('.',',')}</span>
                    </div>
                    <SubmitButton />
                     {state.error && <p className="text-red-400 text-sm mt-2 text-center">{state.error}</p>}
                </div>
            </form>
             {isPixModalOpen && state.pixData && (
                <PixModal 
                    pixData={state.pixData}
                    onClose={() => setPixModalOpen(false)}
                    onPaymentSuccess={onPaymentSuccess}
                />
            )}
        </>
    );
};


const CheckoutPopup: React.FC<CheckoutPopupProps> = ({ isOpen, onClose, onEmailSubmit, onPaymentSuccess }) => {
    const [selectedBumps, setSelectedBumps] = useState<string[]>([]);

    if (!isOpen) return null;

    const basePrice = 19.90;
    const totalBumpsPrice = selectedBumps.reduce((total, bumpHash) => {
        const bump = orderBumps.find(b => b.offerHash === bumpHash);
        return total + (bump ? bump.price : 0);
    }, 0);
    const totalPrice = basePrice + totalBumpsPrice;

    const handleClose = () => {
        setSelectedBumps([]);
        onClose();
    };
    
    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2">
            <div className="bg-header-background rounded-lg shadow-2xl w-full max-w-md mx-auto text-gray-200 relative animate-in fade-in zoom-in-95 max-h-[95vh] flex flex-col">
                <button onClick={handleClose} className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors z-10">
                    <X size={24} />
                </button>
                
                <div className="p-6 overflow-y-auto">
                    <div className="text-center mb-6">
                        <p className="text-sm text-gray-400 mb-2 uppercase">GARANTA O SEU ACESSO:</p>
                        <div className="flex items-center justify-center space-x-4">
                            <Image src="https://s3.typebot.io/public/workspaces/cm8gbxl5b000ba3ncy4y16grd/typebots/cmh096k1s0001k404bj3cxex3/blocks/t6whk2rk3yrzzm8zwiaf6wt0?v=1761822488273" alt="Rico com IA" width={60} height={60} className="rounded-md bg-gray-800" data-ai-hint="man anonymous"/>
                            <div>
                                <h3 className="font-bold text-lg text-white">Metodo IA (GANHE 10K POR MÊS)</h3>
                                <p className="text-2xl font-bold text-accent">R$ {basePrice.toFixed(2).replace('.',',')}</p>
                            </div>
                        </div>
                    </div>

                    <CheckoutForm 
                        selectedBumps={selectedBumps}
                        onBumpsChange={setSelectedBumps}
                        totalPrice={totalPrice}
                        onPaymentSuccess={onPaymentSuccess}
                    />

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

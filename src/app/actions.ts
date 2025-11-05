
'use server';

import { z } from 'zod';
import { paymentConfig } from '@/lib/config';

const FormSchema = z.object({
  email: z.string().email({
    message: 'Por favor, insira um e-mail válido.',
  }),
  orderbump: z.array(z.string()).optional(),
});

export type State = {
  error?: string | null;
  pixData?: {
    qr_code: string;
    transaction_id: string;
    total_amount: number;
  } | null;
};

export async function processPayment(prevState: State, formData: FormData): Promise<State> {
  
  const rawFormData = {
    email: formData.get('email'),
    orderbump: formData.getAll('orderbump'),
  };

  const validatedFields = FormSchema.safeParse(rawFormData);
  
  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.email?.[0] || 'Dados inválidos.',
      pixData: null,
    };
  }
  
  const { email, orderbump } = validatedFields.data;

  const payload = {
      amount: paymentConfig.baseAmount,
      description: paymentConfig.productTitle,
      productHash: paymentConfig.productHash,
      customer: {
          name: email.split('@')[0], 
          email: email,
      },
      checkoutUrl: 'https://app.com/checkout', // This should be the real checkout URL
      orderbump: orderbump,
  };

  try {
      const response = await fetch(paymentConfig.apiUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-API-Key': paymentConfig.apiToken,
          },
          body: JSON.stringify(payload)
      });
      
      const result = await response.json();

      if (!response.ok || !result.pix?.pix_qr_code) {
          console.error('API Error Response:', result);
          return { error: result.message || 'Falha ao gerar o PIX.', pixData: null };
      }
      
      return {
          error: null,
          pixData: {
              qr_code: result.pix.pix_qr_code,
              transaction_id: result.hash,
              total_amount: result.amount_paid
          }
      };

  } catch (apiError: any) {
      console.error('API Call Failed:', apiError);
      return { error: 'Não foi possível conectar ao servidor de pagamento. Tente novamente.', pixData: null };
  }
}

export async function checkPaymentStatus(transactionId: string): Promise<{ status: 'paid' | 'pending' | 'error' }> {
    if (!transactionId) return { status: 'error' };

    try {
        const statusUrl = `https://multi.paradisepags.com/api/v1/check_status.php?hash=${transactionId}&_=${new Date().getTime()}`;
        const response = await fetch(statusUrl, {
            headers: { 'X-API-Key': paymentConfig.apiToken },
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error('Status check failed:', response.statusText);
            return { status: 'error' };
        }

        const data = await response.json();
        if (data && data.payment_status === 'paid') {
            return { status: 'paid' };
        }
        return { status: 'pending' };

    } catch (error) {
        console.error('Error checking payment status:', error);
        return { status: 'error' };
    }
}

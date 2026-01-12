import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

export const useMidtrans = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if script is already loaded
    if (window.snap) {
      setIsScriptLoaded(true);
      setConfigLoaded(true);
      return;
    }

    // Fetch Midtrans config from edge function
    const loadMidtransScript = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-midtrans-config');
        
        if (error || !data) {
          console.error('Failed to get Midtrans config:', error);
          toast({
            title: 'Error',
            description: 'Gagal memuat konfigurasi payment gateway',
            variant: 'destructive',
          });
          return;
        }

        const { client_key, is_production } = data;
        
        if (!client_key) {
          console.error('No client key found');
          return;
        }

        // Load Midtrans Snap.js script
        const script = document.createElement('script');
        script.src = is_production
          ? 'https://app.midtrans.com/snap/snap.js'
          : 'https://app.sandbox.midtrans.com/snap/snap.js';
        
        script.setAttribute('data-client-key', client_key);
        script.async = true;
        
        script.onload = () => {
          console.log('Midtrans Snap.js loaded');
          setIsScriptLoaded(true);
          setConfigLoaded(true);
        };
        
        script.onerror = () => {
          console.error('Failed to load Midtrans Snap.js');
          toast({
            title: 'Error',
            description: 'Gagal memuat payment gateway',
            variant: 'destructive',
          });
        };

        document.body.appendChild(script);
      } catch (err) {
        console.error('Error loading Midtrans:', err);
      }
    };

    loadMidtransScript();
  }, [toast]);

  const payWithMidtrans = useCallback(async (
    paymentId: string,
    callbacks?: {
      onSuccess?: (result: unknown) => void;
      onPending?: (result: unknown) => void;
      onError?: (result: unknown) => void;
      onClose?: () => void;
    }
  ) => {
    if (!isScriptLoaded || !configLoaded) {
      toast({
        title: 'Loading',
        description: 'Payment gateway sedang dimuat, coba lagi...',
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Creating Midtrans transaction for payment:', paymentId);
      
      const { data, error } = await supabase.functions.invoke('create-midtrans-transaction', {
        body: { payment_id: paymentId },
      });

      if (error) {
        console.error('Error creating transaction:', error);
        throw new Error(error.message || 'Gagal membuat transaksi');
      }

      if (!data?.snap_token) {
        console.error('No snap token received:', data);
        throw new Error('Tidak ada token pembayaran');
      }

      console.log('Snap token received, opening payment popup');

      // Open Midtrans Snap popup
      window.snap.pay(data.snap_token, {
        onSuccess: (result) => {
          console.log('Payment success:', result);
          toast({
            title: 'Pembayaran Berhasil!',
            description: 'Pembayaran Anda telah berhasil diproses.',
          });
          callbacks?.onSuccess?.(result);
        },
        onPending: (result) => {
          console.log('Payment pending:', result);
          toast({
            title: 'Menunggu Pembayaran',
            description: 'Silakan selesaikan pembayaran Anda.',
          });
          callbacks?.onPending?.(result);
        },
        onError: (result) => {
          console.error('Payment error:', result);
          toast({
            title: 'Pembayaran Gagal',
            description: 'Terjadi kesalahan saat memproses pembayaran.',
            variant: 'destructive',
          });
          callbacks?.onError?.(result);
        },
        onClose: () => {
          console.log('Payment popup closed');
          callbacks?.onClose?.();
        },
      });
    } catch (error) {
      console.error('Error in payWithMidtrans:', error);
      const errorMessage = error instanceof Error ? error.message : 'Gagal memproses pembayaran';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [isScriptLoaded, configLoaded, toast]);

  return {
    payWithMidtrans,
    isLoading,
    isScriptLoaded,
  };
};

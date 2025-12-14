import CryptoJS from 'crypto-js';

export interface FreeKassaPaymentData {
  merchantId: string;
  amount: number;
  orderId: string;
  secretKey: string;
  currency?: string;
  description?: string;
  email?: string;
}

export const generateFreeKassaSignature = (
  merchantId: string,
  amount: number,
  secretKey: string,
  orderId: string
): string => {
  const signString = `${merchantId}:${amount}:${secretKey}:${orderId}`;
  return CryptoJS.MD5(signString).toString();
};

export const createFreeKassaPaymentUrl = (data: FreeKassaPaymentData): string => {
  const {
    merchantId,
    amount,
    orderId,
    secretKey,
    currency = 'RUB',
    description = 'Оплата тарифа AI Dev Platform',
    email = ''
  } = data;

  const signature = generateFreeKassaSignature(merchantId, amount, secretKey, orderId);

  const params = new URLSearchParams({
    m: merchantId,
    oa: amount.toString(),
    o: orderId,
    s: signature,
    currency: currency,
    us_description: description,
    ...(email && { us_email: email })
  });

  return `https://pay.freekassa.ru/?${params.toString()}`;
};

export const generateOrderId = (): string => {
  return `ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
};

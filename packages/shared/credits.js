/**
 * Credits
 *
 * WHERE: Dashboard pricing + credits page. API validates on checkout.
 * HOW: purchase(+) → reservation(-) → charge(confirm) or refund(+)
 */

const CREDIT_PACKS = [
  { id: 'pack_10k',  credits: 10000,  price: 50,  label: '10K Credits',  perCredit: 0.0050, discount: null },
  { id: 'pack_25k',  credits: 25000,  price: 112, label: '25K Credits',  perCredit: 0.0045, discount: '10% off' },
  { id: 'pack_50k',  credits: 50000,  price: 212, label: '50K Credits',  perCredit: 0.0042, discount: '15% off' },
  { id: 'pack_100k', credits: 100000, price: 400, label: '100K Credits', perCredit: 0.0040, discount: '20% off' },
];

const CREDIT_TYPE = {
  PURCHASE: 'purchase',
  BONUS: 'bonus',
  RESERVATION: 'reservation',
  CHARGE: 'charge',
  REFUND: 'refund',
  EXPIRY_REFUND: 'expiry_refund',
};

module.exports = { CREDIT_PACKS, CREDIT_TYPE };

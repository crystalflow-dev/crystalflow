export type OrderStatus = 'paid' | 'pending' | 'refunded';

export type Order = { id: number; customer: string; status: OrderStatus; total: number };

/** The sample orders behind the Orders node, one list per period. */
export const ordersByPeriod: Record<string, Order[]> = {
  today: [
    { id: 1041, customer: 'Atlas Books', status: 'paid', total: 120 },
    { id: 1042, customer: 'Nord Cycles', status: 'pending', total: 80 },
    { id: 1043, customer: 'Maison Lune', status: 'paid', total: 45 },
    { id: 1044, customer: 'Kiln Studio', status: 'refunded', total: 60 },
    { id: 1045, customer: 'Harbor Tea', status: 'paid', total: 210 },
  ],
  yesterday: [
    { id: 1036, customer: 'Harbor Tea', status: 'paid', total: 95 },
    { id: 1037, customer: 'Atlas Books', status: 'paid', total: 310 },
    { id: 1038, customer: 'Pine Outfitters', status: 'pending', total: 150 },
    { id: 1039, customer: 'Nord Cycles', status: 'refunded', total: 40 },
    { id: 1040, customer: 'Kiln Studio', status: 'pending', total: 75 },
  ],
  week: [
    { id: 1021, customer: 'Maison Lune', status: 'paid', total: 480 },
    { id: 1024, customer: 'Pine Outfitters', status: 'paid', total: 265 },
    { id: 1027, customer: 'Atlas Books', status: 'refunded', total: 130 },
    { id: 1029, customer: 'Harbor Tea', status: 'paid', total: 340 },
    { id: 1031, customer: 'Nord Cycles', status: 'pending', total: 220 },
    { id: 1033, customer: 'Kiln Studio', status: 'paid', total: 155 },
    { id: 1035, customer: 'Maison Lune', status: 'pending', total: 90 },
  ],
};

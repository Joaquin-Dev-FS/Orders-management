import { v4 as uuidv4 } from 'uuid';

export const OrderStatus = {
    pending: 'pending',
    completed: 'completed',
    cancelled: 'cancelled',
  } as const;
  
  export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export interface Order {
    id: string;  // identificador único, UUID
    customer_name: string;
    item: string;
    quantity: number;
    status: OrderStatus;
    created_at: number;  // Timestamp as number
  }
  
  export function createOrder(orderData: {
    customer_name: string;
    item: string;
    quantity: number;
    status: OrderStatus;
  }): Order {
    const order: Order = {
      id: uuidv4(),
      ...orderData,
      created_at: Date.now(),  // Timestamp for when the order was created
    };
    return order;
  }
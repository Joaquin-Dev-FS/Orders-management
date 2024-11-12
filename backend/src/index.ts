// src/index.ts

import type {Request, Response} from 'express';
import { Order, createOrder, OrderStatus } from './order';
import bodyParser from 'body-parser';
import express from 'express';


let app: express.Application;


  app = express();  
  app.use(bodyParser.json());

  const orders: Order[] = [];
  
  // POST /orders
  app.post('/orders', (req: Request, res: Response) => {
   
    
    const { customer_name, item, quantity, status } = req.body;
  
    // Valida parámetros del body
    if (!customer_name || !item || !quantity || !status) {
      return res.status(400).send('Missing parameters');
    }
  
    // Asegura status válido
    const validStatuses = ['pending', 'completed', 'cancelled'];
    if (!validStatuses.includes(status as string)) {//validación de status, si no estan en el array devuelve cod 400
      return res.status(400).send('Not valid status');
    }
  
    // Creación de órden
    const order = createOrder({
      customer_name: customer_name as string,
      item: item as string,
      quantity: Number(quantity), 
      status: status as OrderStatus,
    });
  
    console.log('Created order with id:', order.id);
    orders.push(order); // sumo la orden al array de órdenes
  
    res.status(201).json(order); // Responde con la órden creada
  });
  

  // GET /orders - Devuelve una lista de órdenes y opcion de filtrado por status
app.get('/orders', (req: Request, res: Response) => {
  // setup de paginación: default 1 pagina y 10 items por página
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.page_size as string) || 10;

  // Filtro: la query de status puede ser opcional
  const status = req.query.status as OrderStatus | undefined;

 
  let filteredOrders = orders;
  // Filtro basado en status
  if (status) {
    filteredOrders = filteredOrders.filter(o => o.status === status);
  }

  
  const startIndex = (page - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize);

  // Respuesta con detalles de paginación
  const totalOrders = filteredOrders.length;
  const totalPages = Math.ceil(totalOrders / pageSize);

  res.json({
    page,
    page_size: pageSize,
    total: totalOrders,
    total_pages: totalPages,
    orders: paginatedOrders,
  });

  });
  
 
  // GET /orders/:id - Devuelve la órden por ID
  app.get('/orders/:id', (req: Request, res: Response) => {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).send('Order not found');
    res.json(order);
  });
 
  // PUT /orders/:id - Actualiza orden por ID
  app.put('/orders/:id', (req: Request, res: Response) => {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).send('Order not found');
    Object.assign(order, req.body);
    res.json(order);
  });
  
  // DELETE /orders/:id - Borra órden por ID
  app.delete('/orders/:id', (req: Request, res: Response) => {
    const index = orders.findIndex(o => o.id === req.params.id);
    if (index === -1) return res.status(404).send('Order not found');
    orders.splice(index, 1);
    res.status(204).send();
  });
  
  // Iniciar el Server
  if (process.env.NODE_ENV !== 'test') {
   const PORT = Number(process.env.PORT) || 3051;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
  }
  



export default app;
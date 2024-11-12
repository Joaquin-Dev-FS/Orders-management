// src/index.test.ts
import request from 'supertest';
import app from './index';  

// Mock data
const testOrder = {
  customer_name: 'Marce',
  item: 'Alfajor',
  quantity: 1,
  status: 'pending',
};

let orderId: string;

describe('Order API Tests', () => {
  // Test POST /orders
  it('debe crear una órden', async () => {
    const response = await request(app)
      .post('/orders')
      .send(testOrder)
      .expect('Content-Type', /json/)
      .expect(201);  // status esperado 201 (Creada)

    expect(response.body).toHaveProperty('id');
    expect(response.body.customer_name).toBe(testOrder.customer_name);
    expect(response.body.item).toBe(testOrder.item);
    expect(response.body.quantity).toBe(testOrder.quantity);
    expect(response.body.status).toBe(testOrder.status);

    orderId = response.body.id;  // Salva el Id de la orden
  });

 

  // Test PUT /orders/:id 
  it('debe actualizar una órden', async () => {
    const updatedOrder = { status: 'completed' };

    const response = await request(app)
      .put(`/orders/${orderId}`)
      .send(updatedOrder)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.status).toBe(updatedOrder.status);
  });

  // Test DELETE /orders/:id
  it('debe borrar una orden', async () => {
    const response = await request(app)
      .delete(`/orders/${orderId}`)
      .expect(204);  // status esperado 204 (No Contenido)

    // Verifica que la órden fue borrada
    await request(app)
      .get(`/orders/${orderId}`)
      .expect(404);  // status esperado 404 (No encontrado)
  });

  // Test GET /orders con paginación y filtro por status
  it('debe devolver una lista de órdenes con paginación y filtro por status', async () => {
    // Create a few orders
    await request(app)
      .post('/orders')
      .send({
        customer_name: 'Jane Smith',
        item: 'Smartphone',
        quantity: 2,
        status: 'pending',
      });

    await request(app)
      .post('/orders')
      .send({
        customer_name: 'Alice Johnson',
        item: 'Tablet',
        quantity: 3,
        status: 'pending',
      });

    const response = await request(app)
      .get('/orders')
      .query({ status: 'pending', page: 1, page_size: 2 })
      .expect('Content-Type', /json/)
      .expect(200);  // status esperado 200 (OK)

    expect(response.body.orders).toHaveLength(2);  
    expect(response.body.orders[0].status).toBe('pending');
  });
});
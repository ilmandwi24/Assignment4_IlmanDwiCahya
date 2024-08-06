// __tests__/laptop.test.js
const Request = require('supertest');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const TestHelper = require('../../../server/helpers/TestHelper');
const laptop = require('../../../server/api/laptop');
const LaptopDb = require('../../../server/services/LaptopDb');
const LaptopPrisma = require('../../../server/services/LaptopPrisma');
const Redis = require('../../../server/services/Redis');

let server;
// jest.mock('../../../server/helpers/MiddlewareHelper'); // Mock the entire auth module

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('Laptop', () => {
  beforeAll(() => {
    server = TestHelper.createTestServer('/api', laptop);
    // serverUser = TestHelper.createTestServer('/api', user);
  });

  afterAll(async () => {
    await server.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();


  });


  describe('API V1 Query Database', () => {
    const token = 'mockedToken';
    describe('GET /v1/laptop', () => {

      it('should return 200 and laptop list, when get list laptop from db', async () => {
        jwt.verify.mockImplementation((token, secret, callback) => {
          callback(null, { email: 'abc@gmail.com', status: "staff" });
        });
        const mockLaptopList = [
          {
            id: 3,
            nama: "Asus",
            brand: "Asus",
            processor: "Ryzen 5",
            ram: 8,
            vga: "NVIDIA",
            harga: 10000000
          },
        ];
        jest.spyOn(LaptopDb, 'getListLaptop').mockResolvedValue([mockLaptopList]);
        jest.spyOn(LaptopDb, 'getListIdLaptop').mockResolvedValue([1]);
        jest.spyOn(Redis,'getKey').mockResolvedValue(null);
        jest.spyOn(Redis,'setWithExpire').mockResolvedValue('ok');
        const response = await Request(server).get('/api/v1/laptop').set('x-access-token', `Bearer ${token}`);;
        expect(response.status).toBe(200);
      });
      it('should return 200 and laptop list, when get list laptop from redis', async () => {
        jwt.verify.mockImplementation((token, secret, callback) => {
          callback(null, { email: 'abc@gmail.com', status: "staff" });
        });
        const mockLaptopList = [
          {
            id: 3,
            nama: "Asus",
            brand: "Asus",
            processor: "Ryzen 5",
            ram: 8,
            vga: "NVIDIA",
            harga: 10000000
          },
        ];
        jest.spyOn(LaptopDb, 'getListLaptop').mockResolvedValue([mockLaptopList]);
        jest.spyOn(LaptopDb, 'getListIdLaptop').mockResolvedValue([3]);
        jest.spyOn(Redis,'getKey').mockResolvedValue("{\"count\":1,\"list\":[[{\"id\":3,\"nama\":\"Asus\",\"brand\":\"Asus\",\"processor\":\"Ryzen 5\",\"ram\":8,\"vga\":\"NVIDIA\",\"harga\":10000000}]]}");
        jest.spyOn(Redis,'setWithExpire').mockResolvedValue('ok');
        const response = await Request(server).get('/api/v1/laptop').set('x-access-token', `Bearer ${token}`);;
        expect(response.status).toBe(200);
      });
      it('should return 200 and laptop list, when get list laptop from redis and data db null', async () => {
        jwt.verify.mockImplementation((token, secret, callback) => {
          callback(null, { email: 'abc@gmail.com', status: "staff" });
        });
        const mockLaptopList = [
          {
            id: 3,
            nama: "Asus",
            brand: "Asus",
            processor: "Ryzen 5",
            ram: 8,
            vga: "NVIDIA",
            harga: 10000000
          },
        ];
        jest.spyOn(LaptopDb, 'getListLaptop').mockResolvedValue([mockLaptopList]);
        jest.spyOn(Redis,'getKey').mockResolvedValue("{\"count\":1,\"list\":[[{\"id\":3,\"nama\":\"Asus\",\"brand\":\"Asus\",\"processor\":\"Ryzen 5\",\"ram\":8,\"vga\":\"NVIDIA\",\"harga\":10000000}]]}");
        jest.spyOn(Redis,'setWithExpire').mockResolvedValue('ok');
        jest.spyOn(LaptopDb,'getListIdLaptop').mockResolvedValue([]);
        const response = await Request(server).get('/api/v1/laptop').set('x-access-token', `Bearer ${token}`);;
        expect(response.status).toBe(404);
      });
      it('should return 200 and laptop list, when get list laptop from redis and data db is not null and equal', async () => {
        jwt.verify.mockImplementation((token, secret, callback) => {
          callback(null, { email: 'abc@gmail.com', status: "staff" });
        });
        const mockLaptopList = [
          {
            id: 3,
            nama: "Asus",
            brand: "Asus",
            processor: "Ryzen 5",
            ram: 8,
            vga: "NVIDIA",
            harga: 10000000
          },
        ];
        jest.spyOn(LaptopDb, 'getListLaptop').mockResolvedValue([mockLaptopList]);
        jest.spyOn(Redis,'getKey').mockResolvedValue("{\"count\":1,\"listId\":[3],\"list\":[[{\"id\":3,\"nama\":\"Asus\",\"brand\":\"Asus\",\"processor\":\"Ryzen 5\",\"ram\":8,\"vga\":\"NVIDIA\",\"harga\":10000000}]]}");
        jest.spyOn(Redis,'setWithExpire').mockResolvedValue('ok');
        jest.spyOn(LaptopDb,'getListIdLaptop').mockResolvedValue([1,2]);
        jest.spyOn(LaptopDb, 'getListLaptop').mockResolvedValue([mockLaptopList]);
        jest.spyOn(Redis,'getKey').mockResolvedValue("{\"count\":1,\"listId\":[3],\"list\":[[{\"id\":3,\"nama\":\"Asus\",\"brand\":\"Asus\",\"processor\":\"Ryzen 5\",\"ram\":8,\"vga\":\"NVIDIA\",\"harga\":10000000}]]}");
        jest.spyOn(Redis,'setWithExpire').mockResolvedValue('ok');
        jest.spyOn(_, 'isEqual').mockReturnValue(true);
        const response = await Request(server).get('/api/v1/laptop').set('x-access-token', `Bearer ${token}`);;
        expect(response.status).toBe(200);
      });
      
      it('should return 401 and unauthorized token, when get list laptop', async () => {
        const responseAll = await Request(server).get('/api/v1/laptop');

        expect(responseAll.status).toBe(401);
      })


     
      it('should return 403 and laptop list, when get list laptop', async () => {
        jwt.verify.mockImplementation((token, secret, callback) => {
          callback(null, { email: 'abc@gmail.com', status: "manager" });
        });
        const mockLaptopList = [
          {
            id: 3,
            nama: "Asus",
            brand: "Asus",
            processor: "Ryzen 5",
            ram: 8,
            vga: "NVIDIA",
            harga: 10000000
          },
        ];
        jest.spyOn(LaptopDb, 'getListLaptop').mockResolvedValue([mockLaptopList]);

        const response = await Request(server).get('/api/v1/laptop').set('x-access-token', `Bearer ${token}`);;
        expect(response.status).toBe(403);
      });
      it('should return 403 Forbiden and laptop list, when get list laptop', async () => {
        jwt.verify.mockImplementation((token, secret, callback) => {
          callback(new Error('Invalid token'), null);

        });
        const mockLaptopList = [
          {
            id: 3,
            nama: "Asus",
            brand: "Asus",
            processor: "Ryzen 5",
            ram: 8,
            vga: "NVIDIA",
            harga: 10000000
          },
        ];
        jest.spyOn(LaptopDb, 'getListLaptop').mockResolvedValue([mockLaptopList]);

        const response = await Request(server).get('/api/v1/laptop').set('x-access-token', `Bearer ${token}`);;
        expect(response.status).toBe(403);
      });
      it('should return 401 and Incorrect token format, when get list laptop', async () => {
        jest.spyOn(LaptopDb, 'getListLaptop').mockResolvedValue([]);

        const response = await Request(server).get('/api/v1/laptop').set('x-access-token', 'Abc 124');
        expect(response.status).toBe(401);
      })
      it('should return 403 and Incorrect token format, when get list laptop', async () => {
        jest.spyOn(LaptopDb, 'getListLaptop').mockResolvedValue([]);

        const response = await Request(server).get('/api/v1/laptop').set('x-access-token', 'Bearer');
        expect(response.status).toBe(403);
      })
      it('should return 500 and Incorrect token format, when get list laptop', async () => {
        jwt.verify.mockImplementation(() => {
          throw new Error('Invalid token');
        });

        const response = await Request(server).get('/api/v1/laptop').set('x-access-token', `Bearer ${token}`);
        expect(response.status).toBe(500);
      })

      it('should return 500 and laptop list, when get list laptop', async () => {
        jwt.verify.mockImplementation((token, secret, callback) => {
          callback(null, { email: 'abc@gmail.com', status: "staff" });
        });
        jest.spyOn(Redis,'getKey').mockResolvedValue(null);
        jest.spyOn(Redis,'setWithExpire').mockResolvedValue('ok');

        jest.spyOn(LaptopDb, 'getListLaptop').mockRejectedValue(new Error('Mock error'));;

        const response = await Request(server).get('/api/v1/laptop').set('x-access-token', `Bearer ${token}`);
        expect(response.status).toBe(500);
      });
      it('should return 401 when laptop not found', async () => {
        jwt.verify.mockImplementation((token, secret, callback) => {
          callback(null, { email: 'abc@gmail.com', status: "staff" });
        });
        jest.spyOn(LaptopDb, 'getListLaptop').mockResolvedValue([]);
        jest.spyOn(LaptopDb, 'getListIdLaptop').mockResolvedValue([]);
        jest.spyOn(Redis,'getKey').mockResolvedValue(null);
        jest.spyOn(Redis,'setWithExpire').mockResolvedValue('ok');
        const response = await Request(server).get('/api/v1/laptop').set('x-access-token',`Bearer ${token}`);

        expect(response.status).toBe(404);
      });

    });

    describe('POST /v1/laptop', () => {
      it('should return 200 and success message, when add laptop', async () => {
        jest.spyOn(LaptopDb, 'addLaptop').mockResolvedValue('success');
        const response = await Request(server).post('/api/v1/laptop').send({
          nama: "Asussss",
          brand: "Asus",
          processor: "Ryzen 5",
          ram: 8,
          vga: "NVIDIA",
          harga: 10000000
        });
        expect(response.status).toBe(200);
      });

      it('should return 500 when error', async () => {
        jest.spyOn(LaptopDb, 'addLaptop').mockRejectedValue(new Error('Mock error'));
        const response = await Request(server).post('/api/v1/laptop').send({
          nama: "Asus",
          brand: "Asus",
          processor: "Ryzen 5",
          ram: 8,
          vga: "NVIDIA",
          harga: 15000000
        });
        expect(response.status).toBe(500);
      });
    });

    describe('PUT /v1/laptop/:id', () => {
      it('should return 200 and success message, when edit laptop', async () => {
        jest.spyOn(LaptopDb, 'editLaptop').mockResolvedValue({
          id: 1,
          nama: "Asus",
          brand: "Asus",
          processor: "Ryzen 5",
          ram: 8,
          vga: "NVIDIA",
          harga: 10000000
        });
        const response = await Request(server).put('/api/v1/laptop/1').send({
          nama: "Asus",
          brand: "Asus",
          processor: "Ryzen 5",
          ram: 8,
          vga: "NVIDIA",
          harga: 10000000
        });
        expect(response.status).toBe(200);
      });

      it('should return 400 and success message, incorrect body', async () => {
        const response = await Request(server).put('/api/v1/laptop/1').send({
          nama: "Asus",
          brand: "Asus",
          processor: "Ryzen 5",
          ram: 8,
          vga: "NVIDIA",
        });
        expect(response.status).toBe(400);
      });

      it('should return 404 when laptop not found', async () => {
        jest.spyOn(LaptopDb, 'editLaptop').mockResolvedValue(false);
        const response = await Request(server).put('/api/v1/laptop/1').send({
          nama: "Asus",
          brand: "Asus",
          processor: "Ryzen 5",
          ram: 8,
          vga: "NVIDIA",
          harga: 10000000
        });
        expect(response.status).toBe(404);
      });

      it('should return 500 when error', async () => {
        jest.spyOn(LaptopDb, 'editLaptop').mockRejectedValue(new Error('Mock error'));
        const response = await Request(server).put('/api/v1/laptop/1').send({
          nama: "Asus",
          brand: "Asus",
          processor: "Ryzen 5",
          ram: 8,
          vga: "NVIDIA",
          harga: 10000000
        });
        expect(response.status).toBe(500);
      });
    });

    describe('DELETE /v1/laptop/:id', () => {
      it('should return 200 and success message, when delete laptop', async () => {
        jest.spyOn(LaptopDb, 'deleteLaptop').mockResolvedValue({
          id: 2,
          nama: "Asus",
          brand: "Asus",
          processor: "Ryzen 5",
          ram: 8,
          vga: "NVIDIA",
          harga: 10000000
        });
        const response = await Request(server).delete('/api/v1/laptop/1');
        expect(response.status).toBe(200);
      });

      it('should return 404 when laptop not found', async () => {
        jest.spyOn(LaptopDb, 'deleteLaptop').mockResolvedValue(false);
        const response = await Request(server).delete('/api/v1/laptop/1');
        expect(response.status).toBe(404);
      });

      it('should return 500 when error', async () => {
        jest.spyOn(LaptopDb, 'deleteLaptop').mockRejectedValue(new Error('Mock error'));
        const response = await Request(server).delete('/api/v1/laptop/1');
        expect(response.status).toBe(500);
      });
    });
  });

  describe('API V2 ORM', () => {
    describe('GET /v2/laptop', () => {
      it('should return 200 and laptop list, when get list laptop', async () => {
        const mocklaptopList = [
          {
            id: 3,
            nama: "Asus",
            brand: "Asus",
            processor: "Ryzen 5",
            ram: 8,
            vga: "NVIDIA",
            harga: 10000000
          },
        ];
        jest.spyOn(LaptopPrisma, 'getListLaptop').mockResolvedValue(mocklaptopList);

        const response = await Request(server).get('/api/v2/laptop');
        expect(response.status).toBe(200);
      });

      it('should return 404 when laptop not found', async () => {
        jest.spyOn(LaptopPrisma, 'getListLaptop').mockResolvedValue([]);
        const response = await Request(server).get('/api/v2/laptop');
        expect(response.status).toBe(404);
      });

      it('should return 500 when error', async () => {
        jest.spyOn(LaptopPrisma, 'getListLaptop').mockRejectedValue(new Error('Mock error'));
        const response = await Request(server).get('/api/v2/laptop');
        expect(response.status).toBe(500);
      });
    });

    describe('POST /v2/laptop', () => {
      it('should return 200 and success message, when add laptop', async () => {
        jest.spyOn(LaptopPrisma, 'addLaptop').mockResolvedValue('success');
        const response = await Request(server).post('/api/v2/laptop').send({
          nama: "Asus",
          brand: "Asus",
          processor: "Ryzen 5",
          ram: 8,
          vga: "NVIDIA",
          harga: 10000000
        });
        expect(response.status).toBe(200);
      });

      it('should return 500 when error', async () => {
        jest.spyOn(LaptopPrisma, 'addLaptop').mockRejectedValue(new Error('Mock error'));
        const response = await Request(server).post('/api/v2/laptop').send({
          nama: "Asus",
          brand: "Asus",
          processor: "Ryzen 5",
          ram: 8,
          vga: "NVIDIA",
          harga: 10000000
        });
        expect(response.status).toBe(500);
      });
    });

    describe('PUT /v2/laptop/:id', () => {
      it('should return 200 and success message, when edit laptop', async () => {
        jest.spyOn(LaptopPrisma, 'editLaptop').mockResolvedValue({
          id: 1,
          nama: "Asus",
          brand: "Asus",
          processor: "Ryzen 5",
          ram: 8,
          vga: "NVIDIA",
          harga: 10000000
        });
        const response = await Request(server).put('/api/v2/laptop/1').send({
          nama: "Asus",
          brand: "Asus",
          processor: "Ryzen 5",
          ram: 8,
          vga: "NVIDIA",
          harga: 10000000
        });
        expect(response.status).toBe(200);
      });

      it('should return 400 and success message, incorrect body', async () => {
        const response = await Request(server).put('/api/v2/laptop/1').send({
          nama: "Asus",
          brand: "Asus",
          processor: "Ryzen 5",
          ram: 8,
          vga: "NVIDIA",
        });
        expect(response.status).toBe(400);
      });

      it('should return 404 when laptop not found', async () => {
        jest.spyOn(LaptopPrisma, 'editLaptop').mockResolvedValue(false);
        const response = await Request(server).put('/api/v2/laptop/1').send({
          nama: "Asus",
          brand: "Asus",
          processor: "Ryzen 5",
          ram: 8,
          vga: "NVIDIA",
          harga: 10000000
        });
        expect(response.status).toBe(404);
      });

      it('should return 500 when error', async () => {
        jest.spyOn(LaptopPrisma, 'editLaptop').mockRejectedValue(new Error('Mock error'));
        const response = await Request(server).put('/api/v2/laptop/1').send({
          nama: "Asus",
          brand: "Asus",
          processor: "Ryzen 5",
          ram: 8,
          vga: "NVIDIA",
          harga: 10000000
        });
        expect(response.status).toBe(500);
      });
    });

    describe('DELETE /v2/laptop/:id', () => {
      it('should return 200 and success message, when delete laptop', async () => {
        jest.spyOn(LaptopPrisma, 'deleteLaptop').mockResolvedValue({
          id: 2,
          nama: "Asus",
          brand: "Asus",
          processor: "Ryzen 5",
          ram: 8,
          vga: "NVIDIA",
          harga: 10000000
        });
        const response = await Request(server).delete('/api/v2/laptop/1');
        expect(response.status).toBe(200);
      });

      it('should return 404 when laptop not found', async () => {
        jest.spyOn(LaptopPrisma, 'deleteLaptop').mockResolvedValue(false);
        const response = await Request(server).delete('/api/v2/laptop/1');
        expect(response.status).toBe(404);
      });

      it('should return 500 when error', async () => {
        jest.spyOn(LaptopPrisma, 'deleteLaptop').mockRejectedValue(new Error('Mock error'));
        const response = await Request(server).delete('/api/v2/laptop/1');
        expect(response.status).toBe(500);
      });
    });
  });
});

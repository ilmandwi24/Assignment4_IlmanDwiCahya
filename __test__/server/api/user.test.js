const Request = require('supertest');

const TestHelper = require('../../../server/helpers/TestHelper');

const user = require('../../../server/api/user');
const User = require('../../../server/services/User');

let server;


describe('Register & Login User', () => {
  beforeAll(() => {
    server = TestHelper.createTestServer('/api', user);
  });

  afterAll(async () => {
    await server.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });


  describe('API Register and Login', () => {
    describe('POST /user/register', () => {
      it('should return 200 and success message, when add user', async () => {
        jest.spyOn(User, 'getEmailUser').mockResolvedValue([]);
        jest.spyOn(User, 'addUser').mockResolvedValue('success');
        const response = await Request(server).post('/api/user/register').send({
          email: "abc@gmail.com",
          nama: "abc",
          password: "12345"
        });
        expect(response.status).toBe(200);
      });

      it('should return 400 and error message, email already exist', async () => {
        jest.spyOn(User, 'getEmailUser').mockResolvedValue([{
          email: 'abc@gmail.com',  
        }]);
        const response = await Request(server).post('/api/user/register').send({
          email: "abc@gmail.com",
          password: "12345",
          nama: "ada"

        });
        expect(response.status).toBe(409);
      });

      it('should return 400 and error message, email not found', async () => {
        jest.spyOn(User, 'getEmailUser').mockResolvedValue([]);
        const response = await Request(server).post('/api/user/register').send({
          email: "abc@gmail.com",

        });
        expect(response.status).toBe(400);
      });
  

      it('should return 500 when error', async () => {
        jest.spyOn(User, 'getEmailUser').mockRejectedValue(new Error('Mock error'));
        const response = await Request(server).post('/api/user/register').send({
          email: "abc@gmail.com",
          nama: "abc",
          password: "12345"
        });
        expect(response.status).toBe(500);
      });
     
    });

    describe('POST /user/login', () => {
      
      it('should return 200 and success message, when add laptop', async () => {
        jest.spyOn(User, 'getEmailUser').mockResolvedValue( [
          {
            id: 2,
            email: 'abc@gmail.com',
            nama: 'post',
            password: '$2b$10$k3cqj3MSxc1OX6WsgSeddeAGzFxBI6zfQxWl.y2nQwj28wWqmtIum',
            token: null,
            status: 'staff'
          }
        ]);
        
      const response = await Request(server)
      .post('/api/user/login')
      .send({ email: 'abc@gmail.com', password: '123' });
      expect(response.status).toBe(200);
      });


      it('should return 400 and error message, incorrect body', async () => {
        const response = await Request(server).post('/api/user/login').send({
          email: "abc@gmail.com",
        
        });
        expect(response.status).toBe(400);
      });

      it('should return 404 and error message, email not found', async () => {
        jest.spyOn(User, 'getEmailUser').mockResolvedValue([]);

        const response = await Request(server).post('/api/user/login').send({
          email: "hijk@gmail.com",
          password: "123456"
        
        });
        expect(response.status).toBe(404);
      });

      it('should return 404 and error message, password not found', async () => {
        jest.spyOn(User, 'getEmailUser').mockResolvedValue([{
          email: "abc@gmail.com",
          password: "123456"
        }]);

        const response = await Request(server).post('/api/user/login').send({
          email: "abc@gmail.com",
          password: "12345"
        
        });
        expect(response.status).toBe(404);
      });

      
      it('should return 500 when error', async () => {
        jest.spyOn(User, 'getEmailUser').mockRejectedValue(new Error('Mock error'));
        const response = await Request(server).post('/api/user/login').send({ email: 'abc@gmail.com', password: '123' });
        expect(response.status).toBe(500);
      });


    })
  });
});
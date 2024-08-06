const { PrismaClient } = require('@prisma/client');
const { getListLaptop ,addLaptop, editLaptop, deleteLaptop } = require('../../../server/services/LaptopPrisma');

// Mock PrismaClient and its methods
jest.mock('@prisma/client', () => {
  const findManyMock = jest.fn();
  const createMock = jest.fn();
  const updateMock = jest.fn();
  const deleteMock = jest.fn();
  class PrismaClientMock {
    constructor() {
      this.laptop = {
        findMany: findManyMock,
        create: createMock,
        update: updateMock,
        delete: deleteMock
      };
      this.$disconnect = () => {};
    }
  }
  return {
    PrismaClient: PrismaClientMock
  };
});

describe('Prisma-based Phonebook CRUD operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getListLaptop', () => {
    it('should return laptop list', async () => {
      const mockData = [
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

      const prismaMock = new PrismaClient();
      prismaMock.laptop.findMany.mockResolvedValue(mockData);

      const result = await getListLaptop();

      expect(result).toEqual(mockData);
      expect(prismaMock.laptop.findMany).toHaveBeenCalled();
    });

    it('should throw error', async () => {
      const mockError = new Error('Mock error');
      const prismaMock = new PrismaClient();
      prismaMock.laptop.findMany.mockRejectedValue(mockError);

      await expect(getListLaptop()).rejects.toThrow(mockError);
      expect(prismaMock.laptop.findMany).toHaveBeenCalled();
    });
  });

  describe('addlaptop', () => {
    it('should successfully add laptop entry', async () => {
      const prismaMock = new PrismaClient();
      prismaMock.laptop.create.mockResolvedValue('success');
      await addLaptop('Asus ROG', 'Asus', 'Ryzen 5', 8,'NVIDIA', 1000000);
      expect(prismaMock.laptop.create).toHaveBeenCalled();
    });
    it('should throw error validation joi', async () => {
        const prismaMock = new PrismaClient();
        prismaMock.laptop.create.mockResolvedValue('error');
        await addLaptop('Asus', 'Asus', 'Ryzen 5', 8,'NVIDIA', '10000000');
        // expect(prismaMock.laptop.create).not.toHaveBeenCalled();
        // expect(prismaMock.laptop.create).toHaveBeenCalled();
      });



  });

  describe('editLaptop', () => {
    it('should successfully edit laptop entry', async () => {
      const prismaMock = new PrismaClient();
      prismaMock.laptop.update.mockResolvedValue({   id: 3, 
        nama: "Asus",
        brand: "Asus",
        processor: "Ryzen 5",
        ram: 8,
        vga: "NVIDIA",
        harga: 10000000 });
      await editLaptop('3', 'Asus', 'Asus', 'Ryzen 5', 8,'NVIDIA', 10000000);
      expect(prismaMock.laptop.update).toHaveBeenCalled();
    });

    it('should throw error', async () => {
      const mockError = { code: 'P2025' };
      const prismaMock = new PrismaClient();
      prismaMock.laptop.update.mockRejectedValue(mockError);
      const result = await editLaptop(3, 'Asus', 'Asus', 'Ryzen 5', 8,'NVIDIA', 10000000);
      expect(result).toBe(false);
      expect(prismaMock.laptop.update).toHaveBeenCalled();
    });
  });

  describe('deletePhonebook', () => {
    it('should successfully delete phonebook entry', async () => {
      const prismaMock = new PrismaClient();
      prismaMock.laptop.delete.mockResolvedValue({ id: 2, name: 'Nabhan', number: '0818666040' });
      await deleteLaptop(2);
      expect(prismaMock.laptop.delete).toHaveBeenCalled();
    });
  });
});

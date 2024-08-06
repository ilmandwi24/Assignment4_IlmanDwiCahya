// eslint-disable-next-line import/no-extraneous-dependencies
const MySQL = require('mysql2/promise');
const { getListLaptop, addLaptop, editLaptop, deleteLaptop,getListIdLaptop } = require('../../../server/services/LaptopDb');

jest.mock('mysql2/promise', () => {
  const queryMock = jest.fn();
  const releaseMock = jest.fn();
  return {
    createPool: () => ({
      getConnection: () => ({
        query: queryMock,
        release: releaseMock
      })
    })
  };
});

describe('Phonebook CRUD operations', () => {
  let queryMock;
  let releaseMock;

  beforeEach(() => {
    queryMock = MySQL.createPool().getConnection().query;
    releaseMock = MySQL.createPool().getConnection().release;
    jest.clearAllMocks();
  });

  describe('getListLaptop', () => {
    it('should return phonebook list', async () => {
      const mockQuery = [
        {
          id: 3, 
          nama: "Asus",
          brand: "Asus",
          processor: "Ryzen 5",
          ram: 8,
          vga: "NVIDIA",
          harga: 10000000
        },
        // { id: 2, name: 'Nabhan TSEL', number: '+6281229743370' }
      ];
      queryMock.mockResolvedValue([mockQuery]);
      const result = await getListLaptop();
      expect(result).toEqual(mockQuery);
      expect(releaseMock).toHaveBeenCalled();
    });

    it('should throw error', async () => {
      const mockError = new Error('Mock error');
      queryMock.mockRejectedValue(mockError);
      await expect(getListLaptop()).rejects.toThrow(mockError);
      expect(releaseMock).toHaveBeenCalled();
    });
  });
  describe('getListIdLaptop', () => {
    it('should return phonebook list', async () => {
      const mockQuery = [
       1,2
        // { id: 2, name: 'Nabhan TSEL', number: '+6281229743370' }
      ];
      queryMock.mockResolvedValue([mockQuery]);
      const result = await getListIdLaptop();
      expect(result).toEqual(mockQuery);
      expect(releaseMock).toHaveBeenCalled();
    });

    it('should throw error', async () => {
      const mockError = new Error('Mock error');
      queryMock.mockRejectedValue(mockError);
      await expect(getListIdLaptop()).rejects.toThrow(mockError);
      expect(releaseMock).toHaveBeenCalled();
    });
  });

  describe('addPhonebook', () => {
    it('should successfully add phonebook entry', async () => {
      const mockQuery = {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 11,
        serverStatus: 2,
        warningCount: 0,
        message: '',
        protocol41: true,
        changedRows: 0
      };
      queryMock.mockResolvedValue([mockQuery]);
      await addLaptop('Asus ROG', 'Asus', 'Ryzen 5', 8,'NVIDIA', 1000000);
      expect(queryMock).toHaveBeenCalled();
      expect(releaseMock).toHaveBeenCalled();
    });

    it('should throw error', async () => {
      const mockError = new Error('Mock error');
      queryMock.mockRejectedValue(mockError);
      await expect(addLaptop('Asus ROG', 'Asus', 'Ryzen 5', 8,'NVIDIA', 1000000)).rejects.toThrow(mockError);
      expect(releaseMock).toHaveBeenCalled();
    });
  });

  describe('editPhonebook', () => {
    it('should return true when editing phonebook entry', async () => {
      const mockQuery = {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 11,
        serverStatus: 2,
        warningCount: 0,
        message: '',
        protocol41: true,
        changedRows: 0
      };
      queryMock.mockResolvedValue([mockQuery]);
      const result = await editLaptop(1, 'Asus ROG', 'Asus', 'Ryzen 5', 8,'NVIDIA', 1000000);
      expect(result).toBe(true);
      expect(releaseMock).toHaveBeenCalled();
    });

    it('should throw error', async () => {
      const mockError = new Error('Mock error');
      queryMock.mockRejectedValue(mockError);
      await expect(editLaptop(1, 'Asus ROG', 'Asus', 'Ryzen 5', 8,'NVIDIA', 1000000)).rejects.toThrow(mockError);
      expect(releaseMock).toHaveBeenCalled();
    });
  });

  describe('deletePhonebook', () => {
    it('should return true when deleting phonebook entry', async () => {
      const mockQuery = {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 11,
        serverStatus: 2,
        warningCount: 0,
        message: '',
        protocol41: true,
        changedRows: 0
      };
      queryMock.mockResolvedValue([mockQuery]);
      const result = await deleteLaptop(1);
      expect(result).toBe(true);
      expect(releaseMock).toHaveBeenCalled();
    });

    it('should throw error', async () => {
      const mockError = new Error('Mock error');
      queryMock.mockRejectedValue(mockError);
      await expect(deleteLaptop(1)).rejects.toThrow(mockError);
      expect(releaseMock).toHaveBeenCalled();
    });
  });
});

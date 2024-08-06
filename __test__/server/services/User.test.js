const MySQL = require('mysql2/promise');
const { addUser, getEmailUser } = require('../../../server/services/User');

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

describe('Add User and Get User by email', () => {
    let queryMock;
    let releaseMock;

    beforeEach(() => {
        queryMock = MySQL.createPool().getConnection().query;
        releaseMock = MySQL.createPool().getConnection().release;
        jest.clearAllMocks();
    });

    describe('Register User', () => {
        it('should throw error', async () => {
            const mockError = new Error('Mock error');
            queryMock.mockRejectedValue(mockError);
            await expect(addUser('abc@gmail.com', 'abc', 'password')).rejects.toThrow(mockError);
            expect(releaseMock).toHaveBeenCalled();
        });
        it('should return user', async () => {
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
            await addUser('abc@gmail.com', 'abc', 'password');
            expect(queryMock).toHaveBeenCalled();
            expect(releaseMock).toHaveBeenCalled();
        });
        


     
    });

    describe('Get Email', () => {

        it('should throw error', async () => {
            const mockError = new Error('Mock error');
            queryMock.mockRejectedValue(mockError);
            await expect(getEmailUser('abc@gmail.com')).rejects.toThrow(mockError);
            expect(releaseMock).toHaveBeenCalled();
        });
        it('should return email', async () => {
            const mockQuery = [
                {
                   email: "abc@gmail.com",
                   nama: "abc",
                   password: "12345"
                   
                },
                // { id: 2, name: 'Nabhan TSEL', number: '+6281229743370' }
            ];
            queryMock.mockResolvedValue([mockQuery]);
            const result = await getEmailUser();
            expect(result).toEqual(mockQuery);
            expect(releaseMock).toHaveBeenCalled();
        });
       
    });

});
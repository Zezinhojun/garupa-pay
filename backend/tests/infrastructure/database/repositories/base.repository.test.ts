import { BaseRepository } from "../../../../src/infrastructure/database/repositories/base.repository";
import { mockOrmClient, mockMapper, cacheRepositoryMock } from "../../../utils/Mocks";

class BaseMockRepository extends BaseRepository<any, any> {
    constructor() {
        super(mockOrmClient, mockMapper, cacheRepositoryMock)
    }
}

describe('BaseRepository', () => {
    let baseRepository: BaseMockRepository;

    beforeEach(() => {
        baseRepository = new BaseMockRepository();
    });

    describe('findById', () => {
        it('should throw error when id is not provided', async () => {
            await expect(baseRepository.findById('')).rejects.toThrow('Id is required');
        });

        it('should return null when entity is not found', async () => {
            (mockOrmClient.findOne as jest.Mock).mockResolvedValue(null);
            const result = await baseRepository.findById('123');
            expect(result).toBeNull();
        });

        it('should handle database errors', async () => {
            (mockOrmClient.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));
            await expect(baseRepository.findById('123')).rejects.toThrow('Database error');
        });
    });

    describe('findAll', () => {
        it('should return empty array when no entities exist', async () => {
            (mockOrmClient.find as jest.Mock).mockResolvedValue([]);
            const result = await baseRepository.findAll();
            expect(result).toEqual([]);
        });

        it('should handle database errors', async () => {
            (mockOrmClient.find as jest.Mock).mockRejectedValue(new Error('Database error'));
            await expect(baseRepository.findAll()).rejects.toThrow('Database error');
        });

        it('should handle mapper errors', async () => {
            (mockOrmClient.find as jest.Mock).mockResolvedValue([{ id: '1' }]);
            mockMapper.toDomain.mockImplementation(() => {
                throw new Error('Mapping error');
            });
            await expect(baseRepository.findAll()).rejects.toThrow('Mapping error');
        });
        it('should return cached data when available', async () => {
            const cachedData = [{ id: '1' }, { id: '2' }];
            (cacheRepositoryMock.get as jest.Mock).mockResolvedValue(cachedData);
            mockMapper.toDomain.mockImplementation(data => data);

            const result = await baseRepository.findAll();

            expect(cacheRepositoryMock.get).toHaveBeenCalled();
            expect(mockOrmClient.find).not.toHaveBeenCalled();
            expect(result).toEqual(cachedData);
        });

        it('should fetch from database and cache when no cache exists', async () => {
            const dbData = [{ id: '1' }, { id: '2' }];
            (cacheRepositoryMock.get as jest.Mock).mockResolvedValue(null);
            (mockOrmClient.find as jest.Mock).mockResolvedValue(dbData);
            mockMapper.toDomain.mockImplementation(data => data);

            const result = await baseRepository.findAll();

            expect(mockOrmClient.find).toHaveBeenCalled();
            expect(cacheRepositoryMock.set).toHaveBeenCalledWith(expect.any(String), dbData);
            expect(result).toEqual(dbData);
        });

    });

    describe('findWithPagination', () => {
        it('should return paginated cached data', async () => {
            const cachedData = [{ id: '1' }, { id: '2' }, { id: '3' }];
            (cacheRepositoryMock.get as jest.Mock).mockResolvedValue(cachedData);
            mockMapper.toDomain.mockImplementation(data => data);

            const result = await baseRepository.findWithPagination(1, 2);

            expect(result).toHaveLength(2);
            expect(result).toEqual([{ id: '1' }, { id: '2' }]);
        });

        it('should handle cache miss correctly', async () => {
            const dbData = [{ id: '1' }, { id: '2' }, { id: '3' }];
            (cacheRepositoryMock.get as jest.Mock).mockResolvedValue(null);
            (mockOrmClient.find as jest.Mock).mockResolvedValue(dbData);
            mockMapper.toDomain.mockImplementation(data => data);

            const result = await baseRepository.findWithPagination(2, 2);

            expect(result).toHaveLength(1);
            expect(result).toEqual([{ id: '3' }]);
        });

        it('should handle empty results', async () => {
            (cacheRepositoryMock.get as jest.Mock).mockResolvedValue([]);
            mockMapper.toDomain.mockImplementation(data => data);

            const result = await baseRepository.findWithPagination(1, 10);

            expect(result).toHaveLength(0);
        });
    });


    describe('findMany', () => {
        it('should throw error when no entities found', async () => {
            (mockOrmClient.find as jest.Mock).mockResolvedValue([]);
            await expect(baseRepository.findMany({})).rejects.toThrow('No entities found');
        });

        it('should handle invalid query parameters', async () => {
            (mockOrmClient.find as jest.Mock).mockRejectedValue(new Error('Invalid query'));
            await expect(baseRepository.findMany({ invalid: true })).rejects.toThrow('Invalid query');
        });
    });

    describe('create', () => {
        it('should throw error when entity is not provided', async () => {
            await expect(baseRepository.create(null as any)).rejects.toThrow('Entity is required');
        });

        it('should handle validation errors during persistence', async () => {
            mockMapper.toPersistence.mockImplementation(() => {
                throw new Error('Validation error');
            });
            await expect(baseRepository.create({})).rejects.toThrow('Validation error');
        });

        it('should handle database save errors', async () => {
            mockMapper.toPersistence.mockReturnValue({});
            (mockOrmClient.save as jest.Mock).mockRejectedValue(new Error('Save failed'));
            await expect(baseRepository.create({})).rejects.toThrow('Save failed');
        });
    });

    describe('update', () => {
        it('should throw error when id or entity is not provided', async () => {
            await expect(baseRepository.update('', {})).rejects.toThrow('Id and entity are required');
            await expect(baseRepository.update('123', null as any)).rejects.toThrow('Id and entity are required');
        });

        it('should return null when entity not found', async () => {
            mockMapper.toPersistence.mockReturnValue({});
            (mockOrmClient.update as jest.Mock).mockResolvedValue(null);
            const result = await baseRepository.update('123', {});
            expect(result).toBeNull();
        });

        it('should handle update conflicts', async () => {
            mockMapper.toPersistence.mockReturnValue({});
            (mockOrmClient.update as jest.Mock).mockRejectedValue(new Error('Update conflict'));
            await expect(baseRepository.update('123', {})).rejects.toThrow('Update conflict');
        });
    });

    describe('delete', () => {
        it('should throw error when id is not provided', async () => {
            await expect(baseRepository.delete('')).rejects.toThrow('Id is required');
        });

        it('should handle non-existent entity deletion', async () => {
            (mockOrmClient.delete as jest.Mock).mockResolvedValue(false);
            const result = await baseRepository.delete('123');
            expect(result).toBe(false);
        });

        it('should handle deletion errors', async () => {
            (mockOrmClient.delete as jest.Mock).mockRejectedValue(new Error('Delete failed'));
            await expect(baseRepository.delete('123')).rejects.toThrow('Delete failed');
        });
    });
})
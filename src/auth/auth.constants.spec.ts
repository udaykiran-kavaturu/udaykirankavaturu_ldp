import { ConfigService } from "@nestjs/config";
import { config } from 'dotenv';

jest.mock('@nestjs/config');
jest.mock('dotenv');

describe('JWTConstants', () => {
    let mockConfigService: jest.Mocked<ConfigService>;

    beforeEach(() => {
        jest.resetAllMocks();
        mockConfigService = {
            get: jest.fn(),
        } as unknown as jest.Mocked<ConfigService>;
        (ConfigService as jest.MockedClass<typeof ConfigService>).mockImplementation(() => mockConfigService);
    });

    it('should call config and create ConfigService', () => {
        jest.isolateModules(() => {
            require('./auth.constants');
            expect(config).toHaveBeenCalled();
            expect(ConfigService).toHaveBeenCalled();
        });
    });

    it('should set JWTConstants.secret from ConfigService', () => {
        const mockSecret = 'test-secret';
        mockConfigService.get.mockReturnValue(mockSecret);

        jest.isolateModules(() => {
            const { JWTConstants } = require('./auth.constants');
            expect(mockConfigService.get).toHaveBeenCalledWith('TERCES_YEK');
            expect(JWTConstants.secret).toBe(mockSecret);
        });
    });
});
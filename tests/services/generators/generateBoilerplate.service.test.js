const generateBoilerplateService = require('../../../src/services/generators/generateBoilerplate.service');

let mockSpawn = {};
jest.mock('child_process', () => ({
  spawn: () => mockSpawn,
}),
);

describe(('generateBoilerplateService'), () => {
  const sampleConfig = {
    FrontEnd: [{
      name: 'testFrontend',
      containerPort: 4005,
      hostPort: 4005,
      image: 'dockerUsername/testFrontend',
      envVariables: [
        {
          name: 'key1',
          value: 'value1',
        },
        {
          name: 'key2',
          value: 'value2',
        },
        {
          name: 'key3',
          value: 'value3',
        }
      ],
      backends : [{
        name: 'backend1',
        port: 5500,
      },{
        name: 'backend2',
        port: 6600,
      }]
    }],
    Database: [
      {
        dbName: 'testDb',
        image: 'dockerUsername/testDb',
        dbVersion: 'latest',
        dbContainerPort: 5432,
        dbHostPort: 5432,
        dbUser: 'postgres',
        dbPassword: 'postgres',
        dbSchema: 'public',
      },
      {
        dbName: 'testDb2',
        image: 'dockerUsername/testDb2',
        dbVersion: 'latest',
        dbContainerPort: 5432,
        dbHostPort: 5432,
        dbUser: 'postgres',
        dbPassword: 'postgres',
        dbSchema: 'public',
      }
    ],
    BackEnd: [{
      name: 'testBackend',
      image: 'dockerUsername/testBackend',
      containerPort: 5500,
      hostPort: 5500,
      envVariables: [
        {
          name: 'key1',
          value: 'value1',
        },
        {
          name: 'key2',
          value: 'value2',
        },
      ],
      frontends : [{
        name: 'frontend1',
        port: 4005,
      },{
        name: 'frontend2',
        port: 5005,
      }],
      databases : [{
        dbName: 'testDb',
        dbHost: '127.0.0.1',
        dbPort: 5432,
        dbUser: 'postgres',
        dbPassword: 'postgres',
        model: {
          name: 'Color',
          tableName: 'Colors',
          data: ['red', 'green', 'blue']
        }
      },
      {
        dbName: 'testDb2',
        dbHost: '127.0.0.1',
        dbPort: 5432,
        dbUser: 'postgres',
        dbPassword: 'postgres',
        model: {
          name: 'Car',
          tableName: 'Cars',
          data: ['bmw', 'audi', 'mercedes']
        }
      }]
    }]
  };
  describe('runHygen', () => {
    it('should return a resolved promise when hygen is run successfully', async () => {
      mockSpawn = {
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'close') {
            callback(0);
          }
        })};
      const exitCode = await generateBoilerplateService.runHygen('projectId123', 'frontend', 'new', {});
      expect(exitCode).toBe(0);
    });

    it('should return a rejected promise when hygen is not run successfully', async () => {
      mockSpawn = {
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'close') {
            callback(1);
          }
        })};
      try {
        await generateBoilerplateService.runHygen('projectId123', 'frontend', 'new', {});
      }
      catch (e) {
        expect(e).toBe(1);
      }
    });
  });
  describe('generateBoilerplate', () => {
    it('should thorw an error when an invalid service is passed', async () => {
      await expect(generateBoilerplateService.generateBoilerplate('projectId123', 'invalidService', {})).rejects.toThrow('Invalid microservice');
    });
    it('should return a rejected promise when an invalid config is passed', async () => {
      const invalidConfig = {
        Database: [
          {
            name: 'testDb',
            dbVersion: 'latest',
            port: 5432,
            dbUser: 'postgres',
            dbPassword: 'postgres',
            dbSchema: 'public',
          },
          {
            nam: 'testDb2',
            dbVersion: 'latest',
            port: 5432,
            dbUser: 'postgres',
            dbPassword: 'postgres',
            dbSchema: 'public',
          }
        ],
      };
      try {
        await generateBoilerplateService.generateBoilerplate('projectId123', 'Database', invalidConfig);
      }
      catch (e) {
        expect(e).toBe(1);
      }
    });
    it('should return array of resolved promises when a frontend microservice is passed', async () => {
      mockSpawn = {
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'close') {
            callback(0);
          }
        })};
      const exitCode = await generateBoilerplateService.generateBoilerplate('projectId123', 'FrontEnd', sampleConfig);
      expect(exitCode).toEqual([0]);
    });
    it('should return array of relolved promises when backend microservice is passed', async () => {
      mockSpawn = {
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'close') {
            callback(0);
          }
        })};
      const exitCode = await generateBoilerplateService.generateBoilerplate('projectId123', 'BackEnd', sampleConfig);
      expect(exitCode).toEqual([0,0,0]);
    });
    
    it('should return array of relolved promises when database microservice is passed', async () => {
      mockSpawn = {
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'close') {
            callback(0);
          }
        })};
      const response = await generateBoilerplateService.generateBoilerplate('projectId123', 'Database', sampleConfig);
      expect(response).toEqual([0,0]);
        
    });
  });
});
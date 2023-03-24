const fs = require('fs');
const path = require('path');
const { zipFolder } = require('../../src/services/zipping.service.js');
const folderUtility= require('../../src/utility/folder.utility.js');
jest.useFakeTimers();

jest.mock('archiver', () => {
  return jest.fn().mockImplementation(() => {
    return {
      pipe: jest.fn().mockResolvedValue('Success'),
      directory: jest.fn().mockResolvedValue(true),
      finalize: jest.fn().mockResolvedValue(true),
    };
  });
});


describe('Zipping Service', ()=>{
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should reject with an error if folder does not exists', async () => {
    const mockFolderPath = path.join(__dirname, 'nonExistingFolder');
    const mockOutputPath = path.join(__dirname, 'mockFolder.zip');
    jest.spyOn(folderUtility, 'doesFolderExist').mockRejectedValue(new Error(`ENOENT: no such file or directory, access '${mockFolderPath}'`));
    await expect(zipFolder(mockFolderPath, mockOutputPath)).rejects.toThrow(`ENOENT: no such file or directory, access '${mockFolderPath}'`);
  });

  it('should reject with an error if there is a problem creating the zip file', async ()=>{
    jest.spyOn(folderUtility, 'doesFolderExist').mockResolvedValue(true);
    jest.spyOn(fs, 'createWriteStream').mockImplementation(()=>{
      throw new Error('WriteStream error');
    });
    await expect(zipFolder('./inputDir', './output.zip')).rejects.toThrow('WriteStream error');
    fs.createWriteStream.mockRestore();
  });

  it('should zip a folder and return the archive details', async () => {
    const mockOutputPath = path.join(__dirname, 'output.zip');
    jest.spyOn(folderUtility, 'doesFolderExist').mockResolvedValue(true); 

    const mReadStream = {
      on: jest.fn().mockImplementation(function (event, handler) {
        if(event === 'close'){
          handler();
        }
        return this;
      }),
    };
    jest.spyOn(fs, 'createWriteStream').mockReturnValueOnce(mReadStream);
    
    const outputZipPath= await zipFolder('./input', 'tests/services/output.zip');
    expect(outputZipPath).toBe(mockOutputPath);
  });

});


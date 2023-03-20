const fs =require('fs');
const folderUtil = require('../../src/utility/folder.utility');
const util = require('util');

describe('Folder Utility', () => {
  it('should return true if folder exists', async () => {
    jest.spyOn(fs, 'access').mockImplementation(() => {});
    jest.spyOn(util, 'promisify').mockImplementation(()=>() => new Promise((resolve)=> resolve(true))); 
    const result = await folderUtil.doesFolderExist('folderPath');
    expect(result).toEqual(true);
  });
  it('should return false if folder does not exist', async () => {
    jest.spyOn(fs, 'access').mockImplementation(() => {});
    jest.spyOn(util, 'promisify').mockImplementation(()=>() => new Promise((resolve)=> resolve(false)));
    const result = await folderUtil.doesFolderExist('folderPath');
    expect(result).toEqual(false);
  });
});


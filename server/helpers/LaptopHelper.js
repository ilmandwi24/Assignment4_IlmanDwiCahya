const Boom = require('boom');

const _ = require('lodash');
const CommonHelper = require('./CommonHelper');

const LaptopDb = require('../services/LaptopDb');
const LaptopPrisma = require('../services/LaptopPrisma');

const Redis = require('../services/Redis');



const getAllList = async () => {
  try {
    const dataFromRedis = await Redis.getKey('laptop');
    if (dataFromRedis) {
      CommonHelper.log(['Sample Helper', 'getDataLaptop', 'INFO'], {
        message: 'Get data from redis',
        key: 'recomendation'
      });
      // verify Id
      const dataId = await LaptopDb.getListIdLaptop();
      if (dataId.length === 0) {
        return Boom.notFound('Laptop not found');
      }
      const ids = dataId.map(item => item.id);
      const dataRedis = JSON.parse(dataFromRedis);
      if (_.isEqual(ids, dataRedis.listId)) {
        return dataRedis;
      }
      const data = await LaptopDb.getListLaptop();
      const dataResult = {
        count: data.length,
        listId: ids,
        list: data
      }
      await Redis.setWithExpire('laptop', JSON.stringify(dataResult), 86400);

      return dataResult;

    }
    const data = await LaptopDb.getListLaptop();
    const dataId = await LaptopDb.getListIdLaptop();
    const ids = dataId.map(item => item.id);

    if (data.length === 0) {
      return Boom.notFound('Laptop not found');
    }
    const dataResult = {
      count: data.length,
      listId: ids,
      list: data
    }
    await Redis.setWithExpire('laptop', JSON.stringify(dataResult), 86400);

    return dataResult;
  } catch (error) {
    CommonHelper.log(['Laptop Helper', 'getAllList', 'ERROR'], { message: `${error}` });
    throw CommonHelper.errorResponse(error);
  }
};

const addLaptop = async (req) => {
  try {
    await LaptopDb.addLaptop(req.body.nama, 
      req.body.brand, 
      req.body.processor,
      req.body.ram,
      req.body.vga,
      req.body.harga);
    return `Added '${req.body.nama}' to laptop`;
  } catch (error) {
    CommonHelper.log(['Laptop Helper', 'addLaptop', 'ERROR'], { message: `${error}` });
    throw CommonHelper.errorResponse(error);
  }
};

const editLaptop = async (req) => {
  try {
    const editAction = await LaptopDb.editLaptop(req.params.id, req.body.nama, 
      req.body.brand, 
      req.body.processor,
      req.body.ram,
      req.body.vga,
      req.body.harga);
      
    if (!editAction) {
      return Boom.notFound(`Laptop with id ${req.params.id} not found `);
    }
    return `Edited '${req.body.nama}' to laptop`;
  } catch (error) {
    CommonHelper.log(['Laptop Helper', 'editLaptop', 'ERROR'], { message: `${error}` });
    throw CommonHelper.errorResponse(error);
  }
};

const deleteLaptop = async (req) => {
  try {
    const deleteAction = await LaptopDb.deleteLaptop(req.params.id);
    if (!deleteAction) {
      return Boom.notFound(`Laptop with id ${req.params.id} not found `);
    }
    return `Delete id ${req.params.id} successfully`;
  } catch (error) {
    CommonHelper.log(['Laptop Helper', 'deleteLaptop', 'ERROR'], { message: `${error}` });
    throw CommonHelper.errorResponse(error);
  }
};


const getAllListV2 = async () => {
  try {
    const data = await LaptopPrisma.getListLaptop();
    if (data.length === 0) {
      return Boom.notFound('Laptop not found');
    }
    return {
      count: data.length,
      list: data
    };
  } catch (error) {
    CommonHelper.log(['Laptop Helper', 'getAllList', 'ERROR'], { message: `${error}` });
    throw CommonHelper.errorResponse(error);
  }
};

const addLaptopV2 = async (req) => {
  try {
    await LaptopPrisma.addLaptop(req.body.nama, 
      req.body.brand, 
      req.body.processor,
      req.body.ram,
      req.body.vga,
      req.body.harga);
    return `Added '${req.body.nama}' to laptop`;
  } catch (error) {
    CommonHelper.log(['Laptop Helper', 'addPhonebook', 'ERROR'], { message: `${error}` });
    throw CommonHelper.errorResponse(error);
  }
};

const editLaptopV2 = async (req) => {
  try {
    const editAction = await LaptopPrisma.editLaptop(req.params.id, req.body.nama, 
      req.body.brand, 
      req.body.processor,
      req.body.ram,
      req.body.vga,
      req.body.harga);
    if (!editAction) {
      return Boom.notFound(`Laptop with id ${req.params.id} not found `);
    }
    return `Edited '${req.body.nama}' to phonebook`;
  } catch (error) {
    CommonHelper.log(['Laptop Helper', 'editLaptop', 'ERROR'], { message: `${error}` });
    throw CommonHelper.errorResponse(error);
  }
};

const deleteLaptopV2 = async (req) => {
  try {
    const deleteAction = await LaptopPrisma.deleteLaptop(req.params.id);
    if (!deleteAction) {
      return Boom.notFound(`Laptop with id ${req.params.id} not found `);
    }
    return `Delete id ${req.params.id} successfully`;
  } catch (error) {
    CommonHelper.log(['Laptop Helper', 'deletePhonebook', 'ERROR'], { message: `${error}` });
    throw CommonHelper.errorResponse(error);
  }
};

module.exports = {
  getAllList,
  editLaptop,
  deleteLaptop,
  getAllListV2,
  addLaptopV2,
  editLaptopV2,
  deleteLaptopV2,
  addLaptop
};

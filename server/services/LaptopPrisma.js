const { PrismaClient } = require('@prisma/client');
const CommonHelper = require('../helpers/CommonHelper');

const prisma = new PrismaClient();

const executePrismaOperation = async (operationName, operationFunction) => {
  try {
    const timeStart = process.hrtime();
    const data = await operationFunction();
    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
    CommonHelper.log(['Prisma', operationName, 'INFO'], {
      message: { timeTaken },
      data
    });
    prisma.$disconnect();
    return data;
  } catch (error) {
    prisma.$disconnect();
    if (error?.code === 'P2025') {
      // Handle the case where the record is not found
      CommonHelper.log(['Prisma', operationName, 'WARN'], {
        message: `No laptop entry found`
      });
      return false;
    }
    // Log other errors
    CommonHelper.log(['Prisma', operationName, 'ERROR'], {
      message: `${error}`
    });
    throw error;
  }
};

const getListLaptop = async () => executePrismaOperation('getListPhonebook', () => prisma.laptop.findMany());

const addLaptop = async (nama,brand,processor,ram,vga,harga) => {
  await executePrismaOperation('addLaptop', async () => {
    await prisma.laptop.create({
      data: {
        nama,brand,processor,ram,vga,harga
      }
    });
  });
};

const editLaptop = async (id, nama,brand,processor,ram,vga,harga) =>
  executePrismaOperation('editLaptop', async () => {
    const result = await prisma.laptop.update({
      where: {
        id: Number(id)
      },
      data: {
        nama,brand,processor,ram,vga,harga
      }
    });
    return !!result;
  });

  const deleteLaptop = async (id) =>
    executePrismaOperation('deleteLaptop', async () => {
      const result = await prisma.laptop.delete({
        where: {
          id: Number(id)
        }
      });
      return !!result;
    });
module.exports = { getListLaptop,addLaptop,editLaptop, deleteLaptop };

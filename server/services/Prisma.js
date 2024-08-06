const { PrismaClient } = require('@prisma/client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

const CommonHelper = require('../helpers/CommonHelper');

const prisma = new PrismaClient();

const getListPhonebook = async () => {
  try {
    const timeStart = process.hrtime();
    const data = await prisma.phonebook.findMany();

    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
    CommonHelper.log(['Prisma', 'getListPhonebook', 'INFO'], {
      message: { timeTaken },
      data
    });

    return data;
  } catch (error) {
    CommonHelper.log(['Database', 'getListPhonebook', 'ERROR'], {
      message: `${error}`
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

const addPhonebook = async (name, number) => {
  try {
    const timeStart = process.hrtime();
    const data = await prisma.phonebook.create({
      data: {
        name,
        number
      }
    });
    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
    CommonHelper.log(['Prisma', 'addPhonebook', 'INFO'], {
      message: { timeTaken },
      data
    });
  } catch (error) {
    CommonHelper.log(['Prisma', 'addPhonebook', 'ERROR'], {
      message: `${error}`
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

const editPhonebook = async (id, name, number) => {
  try {
    const timeStart = process.hrtime();
    const data = await prisma.phonebook.update({
      where: {
        id: Number(id)
      },
      data: {
        name,
        number
      }
    });
    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
    CommonHelper.log(['Prisma', 'editPhonebook', 'INFO'], {
      message: { timeTaken },
      data
    });
    return true;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      // Handle the case where the record is not found
      CommonHelper.log(['Prisma', 'editPhonebook', 'WARN'], {
        message: `No phonebook entry found with id ${id}`
      });
      return false;
    }

    // Log other errors
    CommonHelper.log(['Prisma', 'editPhonebook', 'ERROR'], {
      message: `${error}`
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

const deletePhonebook = async (id) => {
  try {
    const timeStart = process.hrtime();
    const data = await prisma.phonebook.delete({
      where: {
        id: Number(id)
      }
    });
    const timeDiff = process.hrtime(timeStart);
    const timeTaken = Math.round((timeDiff[0] * 1e9 + timeDiff[1]) / 1e6);
    CommonHelper.log(['Prisma', 'deletePhonebook', 'INFO'], {
      message: { timeTaken },
      data
    });
    return true;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      // Handle the case where the record is not found
      CommonHelper.log(['Prisma', 'deletePhonebook', 'WARN'], {
        message: `No phonebook entry found with id ${id}`
      });
      return false;
    }

    // Log other errors
    CommonHelper.log(['Prisma', 'deletePhonebook', 'ERROR'], {
      message: `${error}`
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = { getListPhonebook, addPhonebook, editPhonebook, deletePhonebook };

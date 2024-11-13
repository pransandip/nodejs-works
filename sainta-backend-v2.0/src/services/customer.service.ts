import { prisma } from '../prisma/prisma.client';
import { CreateCustomerDto } from '../types/dtos/CreateCustomer.dto';

const createCustomer = async (customerDetails: CreateCustomerDto) => {
  try {
    // create customer
    const customer = await prisma.customer.create({
      data: {
        ...customerDetails,
      },
    });

    if (!customer) {
      throw new Error('some issue occurred, while creating customer');
    }

    return customer;
  } catch (err) {
    throw err;
  }
};

async function fetchAllCustomers() {
  try {
    // fetch all customers
    const customers = await prisma.customer.findMany({});

    if (!customers) {
      throw new Error('some issue occured while, fetching customers from db');
    }

    return customers;
  } catch (err) {
    throw err;
  }
}

export default { createCustomer, fetchAllCustomers };

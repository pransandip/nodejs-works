import { Request, Response } from 'express';
import { ICustomer } from '../types/models.types';
import customerService from '../services/customer.service';

export async function createCustomer(req: Request, res: Response) {
  const customerDetails: ICustomer = req.body;
  let { businessId } = req.body.user;
  let {
    name,
    email,
    phone,
    notes,
    address,
    company,
    dateMet,
    dayBirth,
    furigana,
    hearAbout,
    position,
    methodMet,
    customerId,
    nextContact,
    lastContact,
    supportDetails,
    supportRequired,
    languagePreference,
    preferredContactMethod,
    supportSatisfaction,
  } = customerDetails;

  businessId = +businessId;
  customerId = +customerId;
  supportSatisfaction = +supportSatisfaction;

  if (!name || !email || !phone || !address || !dayBirth || !position) {
    throw new Error('全てのフィールドを入力してください。');
  }

  // create customer with customer service
  const created = await customerService.createCustomer({
    name,
    email,
    phone,
    notes,
    address,
    company,
    dateMet,
    dayBirth,
    furigana,
    hearAbout,
    position,
    methodMet,
    customerId,
    nextContact,
    lastContact,
    supportDetails,
    supportRequired,
    languagePreference,
    preferredContactMethod,
    supportSatisfaction,
    businessId,
  });

  if (!created) throw new Error('customer not created');

  res.status(201).send({
    success: 1,
    message: 'successfully created customer',
  });
  try {
  } catch (err) {
    console.log((err as Error).message);
    res.status(500).json({ success: 0, message: (err as Error).message });
  }
}

export async function fetchAllCustomers(_req: Request, res: Response) {
  try {
    const details = await customerService.fetchAllCustomers();

    if (!details.length) throw new Error('customers not found');

    res.status(200).json({
      success: 1,
      message: 'Successfully Fetched all customers',
      data: details,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(500).json({ success: 0, message: (err as Error).message });
  }
}

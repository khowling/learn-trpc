import { z } from 'zod';


// To handel Dates (copied from zod README)
const dateSchema = z.preprocess((arg) => {
  if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
}, z.date());
export type DateSchema = z.infer<typeof dateSchema>;
// type DateSchema = Date


export const factoryOrderModel = z.object({
    status: z.enum(['Draft', 'Required', 'InFactory', 'Cancel', 'Available']),
    product_ref: z.object({
        '_id': z.string().regex(/^[0-9a-fA-F]{24}$/, "require ObjectId").min(1)
    }).required(),
    qty: z.number().min(0)
  }) 
    
  export const itemSKUModel = z.object({
    name: z.string().min(1, 'Name is Required'),
    type: z.enum(['Manufactured', 'Purchased']),
    required: dateSchema,
    additionalInfo: z.string(),
    notifyMe: z.boolean()
  })


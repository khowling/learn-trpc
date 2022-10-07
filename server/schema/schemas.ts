import { z } from 'zod';


export const factoryOrderModel = z.object({
    status: z.enum(['Draft', 'Required', 'InFactory', 'Cancel', 'Available']),
    product_ref: z.object({
        '_id': z.string().regex(/^[0-9a-fA-F]{24}$/, "require ObjectId").min(1)
    }).required(),
    qty: z.number().min(0)
  }) 
    
  export const itemSKUModel = z.object({
    name: z.string(),
    type: z.enum(['Manufactured', 'Purchased']),
    tags: z.string()
  })


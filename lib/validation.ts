import { z } from 'zod';
export const dateSchema = z.object({id:z.string().min(1),label:z.string().min(1),value:z.string().min(1)});
export const activitySchema = z.object({id:z.string().min(1),title:z.string().min(1),description:z.string().optional(),icon:z.string().optional(),imageUrl:z.string().url().optional().or(z.literal(''))});
export const invitationSchema = z.object({recipientName:z.string().min(1),senderName:z.string().min(1),introText:z.string().min(5),questionText:z.string().min(5),acceptedText:z.string().min(5),finalText:z.string().min(5),availableDates:z.array(dateSchema).min(1),activities:z.array(activitySchema).min(1),contactUrl:z.string().optional(),theme:z.enum(['rose','wine','peach']),allowDecline:z.boolean(),multiSelectActivities:z.boolean()});
export const responseSchema = z.object({answer:z.enum(['accepted','declined']),selectedDate:z.string().optional(),customDate:z.string().optional(),selectedActivities:z.array(z.string()).default([]),comment:z.string().max(500).optional()});
export type InvitationFormValues = z.infer<typeof invitationSchema>;

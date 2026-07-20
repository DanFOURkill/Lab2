import { prisma } from './prisma';
import { demoInvitation } from './defaults';
import type { Invitation, InvitationActivity, InvitationDate } from './types';
export const asInvitation = (row: {id:string;slug:string;recipientName:string;senderName:string;introText:string;questionText:string;acceptedText:string;finalText:string;availableDates:unknown;activities:unknown;contactUrl:string|null;theme:string;allowDecline:boolean;multiSelectActivities:boolean;createdAt:Date}): Invitation => ({...row, availableDates: row.availableDates as InvitationDate[], activities: row.activities as InvitationActivity[], theme: row.theme as Invitation['theme']});
export async function ensureDemo() { const found = await prisma.invitation.findUnique({where:{slug:'demo'}}); if (!found) await prisma.invitation.create({data:demoInvitation}); }
export async function getInvitation(slug:string){ await ensureDemo(); const row=await prisma.invitation.findUnique({where:{slug}}); return row ? asInvitation(row) : null; }
export function makeSlug(name:string){ return `${name.toLowerCase().replace(/[^a-zа-я0-9]+/gi,'-').replace(/^-|-$/g,'').slice(0,22)||'invite'}-${Math.random().toString(36).slice(2,8)}`; }

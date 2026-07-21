import type { Metadata } from 'next';import { notFound } from 'next/navigation';import { getInvitation } from '@/lib/data';import { InvitationShell } from '@/components/invitation/InvitationShell';
export const dynamic='force-dynamic';
export async function generateMetadata():Promise<Metadata>{return {title:'Для тебя есть приглашение',description:'Открой персональное приглашение и выбери детали встречи.',robots:{index:false,follow:false},openGraph:{title:'Для тебя есть приглашение',description:'Открой персональное приглашение и выбери детали встречи.',images:['/og.svg']}}}
export default async function InvitePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const inv=await getInvitation(slug);if(!inv)notFound();return <InvitationShell invitation={inv}/>}

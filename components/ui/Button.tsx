import Link from 'next/link';
import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
type Props = ButtonHTMLAttributes<HTMLButtonElement> & {variant?:'primary'|'secondary'|'ghost'; asChild?:false};
type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {variant?:'primary'|'secondary'|'ghost'; asChild:true; href:string; children:ReactNode};
const cls=(v='primary')=>`focus-ring inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed ${v==='primary'?'bg-primary text-white shadow-sm':v==='secondary'?'bg-primarySoft text-text':'bg-transparent text-primary hover:bg-primarySoft/40'}`;
export function Button(p:Props|LinkProps){const {variant='primary',className='',asChild,...rest}=p; if(asChild){const r=rest as LinkProps; return <Link className={`${cls(variant)} ${className}`} href={r.href}>{r.children}</Link>} return <button className={`${cls(variant)} ${className}`} {...(rest as Props)} />}

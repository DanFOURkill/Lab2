import { HTMLAttributes } from 'react';
export function Card({className='',...props}:HTMLAttributes<HTMLDivElement>){return <div className={`rounded-[1.5rem] border border-line bg-surface shadow-sm ${className}`} {...props}/>}

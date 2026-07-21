import { TextareaHTMLAttributes } from 'react';
export function Textarea(props:TextareaHTMLAttributes<HTMLTextAreaElement>){return <textarea {...props} className={`focus-ring w-full rounded-2xl border border-line bg-white/70 px-4 py-3 text-sm ${props.className??''}`} />}

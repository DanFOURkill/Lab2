import { InputHTMLAttributes } from 'react';
export function Input(props:InputHTMLAttributes<HTMLInputElement>){return <input {...props} className={`focus-ring w-full rounded-2xl border border-line bg-white/70 px-4 py-3 text-sm ${props.className??''}`} />}

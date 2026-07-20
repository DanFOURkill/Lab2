import { ReactNode } from 'react';
export function Modal({open,children}:{open:boolean;children:ReactNode}){if(!open)return null; return <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4"><div className="max-w-lg rounded-3xl bg-surface p-5">{children}</div></div>}

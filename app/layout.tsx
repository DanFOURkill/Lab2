import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';
const serif = Cormorant_Garamond({subsets:['cyrillic','latin'],weight:['500','600','700'],variable:'--font-serif'});
const sans = Manrope({subsets:['cyrillic','latin'],variable:'--font-sans'});
export const metadata: Metadata = { title:'Романтическое приглашение', description:'Создайте персональное интерактивное приглашение.' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru" className={`${serif.variable} ${sans.variable}`}><body className="font-sans">{children}</body></html>}

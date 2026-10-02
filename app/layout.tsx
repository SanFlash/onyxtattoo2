import '@fontsource/barlow-condensed/500.css';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/barlow-condensed/800.css';
import '@fontsource/barlow-condensed/900.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/italiana/400.css';
import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:{default:'ONYX Tattoo Studio · Ink. Art. Identity. | Indore',template:'%s · ONYX Tattoo Studio'},description:'Explore tattoo styles and request a personal consultation at ONYX Tattoo Studio, Indore.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}

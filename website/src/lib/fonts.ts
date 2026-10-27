import { Figtree, Inter } from 'next/font/google';

/*
 * Figtree is the website's font (chosen 2026-10-28 from a trial of six).
 * Inter stays loaded for the phone screens and papers, which mirror the app.
 */
export const figtree = Figtree({ subsets: ['latin'], variable: '--font-figtree' });
export const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const fontVariables = `${figtree.variable} ${inter.variable}`;

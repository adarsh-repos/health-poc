import { Figtree, Inter } from 'next/font/google';

/*
 * Figtree is the website's font (chosen 2026-10-28 from a trial of six).
 * Inter stays loaded for the phone screens and papers, which mirror the app.
 */
// latin-ext carries the dotless ı the wordmark uses (its dot is drawn as a paper).
export const figtree = Figtree({ subsets: ['latin', 'latin-ext'], variable: '--font-figtree' });
export const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const fontVariables = `${figtree.variable} ${inter.variable}`;

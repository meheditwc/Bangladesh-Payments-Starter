import './globals.css';
import type { ReactNode } from 'react';

export const metadata = { title: 'Bangladesh Payments Starter 🇧🇩', description: 'bKash + Nagad + SSLCommerz starter kit' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="bn">
      <body>
        <header className="topbar">
          <a href="/" className="brand">🇧🇩 Bangladesh Payments <span>Starter</span></a>
          <nav>
            <a href="/checkout">Checkout</a>
            <a href="/api/orders">Orders API</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="footer">Made with ❤️ in Bangladesh • bKash + Nagad + SSLCommerz • Mock mode: কোনো real টাকা কাটবে না</footer>
      </body>
    </html>
  );
}

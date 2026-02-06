import { Leaf, Instagram, ExternalLink, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAdminCheck } from '@/hooks/useAdminCheck';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck(user?.id);

  const showAdminLink = !authLoading && !adminLoading && user && isAdmin;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="h-6 w-6" />
              <span className="font-serif text-2xl font-semibold">
                Whattheficusthat
              </span>
            </div>
            <p className="text-primary-foreground/80 mb-4 max-w-md">
              Your Plant Plug 🔌🍀 — Rare & Exotic Plants, Shipped to Your Door. 
              Licensed nursery bringing you the most stunning houseplants.
            </p>
            <div className="flex items-center gap-1 text-sm text-primary-foreground/70">
              <span>🏷️ Licensed Nursery</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('shop')}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Shop Plants
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  About Eva
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('live')}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Live Streams
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('shipping')}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Shipping Info
                </button>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://instagram.com/whattheficusthat_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://palmstreet.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  PalmStreet Shop
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/70">
            © {currentYear} Whattheficusthat. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {showAdminLink && (
              <Link
                to="/admin"
                className="flex items-center gap-1 text-sm text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors"
              >
                <Settings className="h-3 w-3" />
                Admin
              </Link>
            )}
            <p className="text-sm text-primary-foreground/70">
              Made with 🌱 for plant lovers everywhere
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

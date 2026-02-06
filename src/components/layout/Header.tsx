import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
const navLinks = [{
  href: '/#shop',
  label: 'Shop'
}, {
  href: '/#about',
  label: 'About'
}, {
  href: '/#live',
  label: 'Live'
}, {
  href: '/#reviews',
  label: 'Reviews'
}, {
  href: '/#contact',
  label: 'Contact'
}];
export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const scrollToSection = (href: string) => {
    const id = href.replace('/#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };
  return <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Leaf className="text-primary transition-transform group-hover:rotate-12 w-[32px] h-[32px]" />
            <span className="font-serif text-xl font-semibold text-primary md:text-3xl">
              Whattheficusthat
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => <button key={link.href} onClick={() => scrollToSection(link.href)} className="text-foreground/80 hover:text-primary transition-colors font-medium">
                {link.label}
              </button>)}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-foreground" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={cn('md:hidden overflow-hidden transition-all duration-300', isOpen ? 'max-h-96 pb-4' : 'max-h-0')}>
          <nav className="flex flex-col gap-2">
            {navLinks.map(link => <button key={link.href} onClick={() => scrollToSection(link.href)} className="text-left px-4 py-3 text-foreground/80 hover:text-primary hover:bg-muted rounded-lg transition-colors font-medium">
                {link.label}
              </button>)}
          </nav>
        </div>
      </div>
    </header>;
}
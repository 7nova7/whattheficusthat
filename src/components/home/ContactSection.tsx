import { useState } from 'react';
import { Send, Mail, Instagram, ExternalLink, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useInView } from '@/hooks/useInView';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email address').max(255),
  message: z.string().trim().min(1, 'Message is required').max(1000),
});

const newsletterSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(255),
});

export function ContactSection() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [contactLoading, setContactLoading] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const { toast } = useToast();
  const [ref, isInView] = useInView<HTMLElement>();

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = contactSchema.safeParse(contactForm);
    if (!result.success) {
      toast({
        title: 'Validation Error',
        description: result.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    setContactLoading(true);
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: result.data.name,
          email: result.data.email,
          message: result.data.message,
        }]);

      if (error) throw error;

      toast({
        title: 'Message Sent! 🌿',
        description: 'Thanks for reaching out. Eva will get back to you soon!',
      });
      setContactForm({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: 'Oops!',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setContactLoading(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = newsletterSchema.safeParse({ email: newsletterEmail });
    if (!result.success) {
      toast({
        title: 'Validation Error',
        description: result.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    setNewsletterLoading(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: result.data.email }]);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Already Subscribed',
            description: 'You\'re already part of the Plant Fam! 🌱',
          });
          return;
        }
        throw error;
      }

      setNewsletterSuccess(true);
      toast({
        title: 'Welcome to the Plant Fam! 🌿',
        description: 'You\'ll be the first to know about new drops and live sales.',
      });
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 3000);
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast({
        title: 'Oops!',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <section id="contact" ref={ref} className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div 
            className={cn(
              'transition-all duration-700',
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            )}
          >
            <span className="text-accent font-medium mb-2 block">Get in Touch</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Contact Eva 💌
            </h2>
            <p className="text-muted-foreground mb-8">
              Have questions about plants or orders? Want to request a specific plant? 
              Drop me a message and I'll get back to you!
            </p>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="bg-muted border-border"
                  required
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="bg-muted border-border"
                  required
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="bg-muted border-border min-h-[120px]"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto"
                disabled={contactLoading}
              >
                {contactLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send Message
              </Button>
            </form>
          </div>

          {/* Newsletter & Social */}
          <div 
            className={cn(
              'transition-all duration-700 delay-200',
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            )}
          >
            {/* Newsletter Card */}
            <Card className="bg-primary text-primary-foreground mb-8">
              <CardContent className="p-8">
                <h3 className="font-serif text-2xl font-bold mb-2">
                  Join the Plant Fam 🌿
                </h3>
                <p className="text-primary-foreground/80 mb-6">
                  Be the first to know about new plant drops, live sales, and exclusive deals!
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                    required
                  />
                  <Button 
                    type="submit"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0"
                    disabled={newsletterLoading || newsletterSuccess}
                  >
                    {newsletterLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : newsletterSuccess ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Social Links */}
            <div>
              <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                Follow Along
              </h3>
              <div className="space-y-3">
                <a
                  href="https://instagram.com/whattheficusthat_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-accent text-accent-foreground">
                    <Instagram className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Instagram</p>
                    <p className="text-sm text-muted-foreground">@whattheficusthat_</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>

                <a
                  href="https://palmstreet.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                    <ExternalLink className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">PalmStreet</p>
                    <p className="text-sm text-muted-foreground">Shop & Watch Live</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

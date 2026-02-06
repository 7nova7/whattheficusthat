import { useState, useEffect } from 'react';
import { Play, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getNextLiveDate(): Date {
  const now = new Date();
  const dayOfWeek = now.getDay();
  
  // Live streams on Monday (1) and Wednesday (3) at 7 PM
  let daysUntilNext = 0;
  
  if (dayOfWeek === 1 || dayOfWeek === 3) {
    // If today is Monday or Wednesday
    const liveTime = new Date(now);
    liveTime.setHours(19, 0, 0, 0);
    if (now < liveTime) {
      return liveTime;
    }
  }
  
  // Calculate days until next Monday or Wednesday
  if (dayOfWeek < 1) daysUntilNext = 1;
  else if (dayOfWeek < 3) daysUntilNext = 3 - dayOfWeek;
  else if (dayOfWeek < 6) daysUntilNext = 8 - dayOfWeek; // Next Monday
  else daysUntilNext = 2; // Saturday -> Monday
  
  const nextLive = new Date(now);
  nextLive.setDate(now.getDate() + daysUntilNext);
  nextLive.setHours(19, 0, 0, 0);
  
  return nextLive;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const difference = targetDate.getTime() - new Date().getTime();
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export function LiveStreamSection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [nextLiveDate, setNextLiveDate] = useState<Date>(getNextLiveDate());
  const [ref, isInView] = useInView<HTMLElement>();

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(nextLiveDate);
      setTimeLeft(newTimeLeft);
      
      // If countdown finished, get next live date
      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && 
          newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        setNextLiveDate(getNextLiveDate());
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextLiveDate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <section 
      id="live" 
      ref={ref}
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2069&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-primary/85 botanical-pattern" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div 
          className={cn(
            'transition-all duration-700',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {/* Live Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
            </span>
            <span className="text-primary-foreground text-sm font-medium">Live Sales</span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Watch Eva Live! 🌿🔴
          </h2>
          
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Join us every Monday & Wednesday at 7 PM EST for live plant sales! 
            See the plants up close, ask questions, and grab the best deals.
          </p>

          {/* Next Live Date */}
          <div className="flex items-center justify-center gap-2 text-secondary mb-8">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">Next Live: {formatDate(nextLiveDate)}</span>
          </div>

          {/* Countdown */}
          <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-10">
            {[
              { value: timeLeft.days, label: 'Days' },
              { value: timeLeft.hours, label: 'Hours' },
              { value: timeLeft.minutes, label: 'Mins' },
              { value: timeLeft.seconds, label: 'Secs' },
            ].map((item) => (
              <div key={item.label} className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4">
                <div className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-primary-foreground/70 text-sm">{item.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg rounded-full"
            asChild
          >
            <a 
              href="https://palmstreet.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Play className="h-5 w-5" />
              Follow on PalmStreet
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

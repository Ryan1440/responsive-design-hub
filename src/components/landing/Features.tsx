import { Wallet, Calendar, Users, ClipboardList, Mail, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Wallet,
    title: 'Budget Planner',
    description: 'Track expenses, manage payments, and stay within budget with detailed financial reports.',
  },
  {
    icon: Calendar,
    title: 'Event Timeline',
    description: 'Create comprehensive timelines from H-90 to the big day with milestone tracking.',
  },
  {
    icon: Users,
    title: 'Vendor Manager',
    description: 'Organize all your vendors, contracts, and communications in one place.',
  },
  {
    icon: ClipboardList,
    title: 'Guest List & RSVP',
    description: 'Manage your guest list, track RSVPs, and organize seating arrangements.',
  },
  {
    icon: Mail,
    title: 'Digital Invitations',
    description: 'Create and send beautiful digital invitations with real-time response tracking.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Get insights into your planning progress with visual reports and statistics.',
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed specifically for wedding planners and organizers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/50 shadow-soft hover:shadow-card transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-pink-soft flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-300">
                <feature.icon className="w-6 h-6 text-pink-dark group-hover:text-primary-foreground transition-colors duration-300" />
              </div>

              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

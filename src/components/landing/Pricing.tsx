import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pricingPlans } from '@/data/mockData';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  return (
    <section id="pricing" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple Pricing
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative bg-card rounded-2xl p-8 border transition-all duration-300 ${
                plan.popular
                  ? 'border-accent shadow-card scale-105'
                  : 'border-border shadow-soft hover:shadow-card hover:-translate-y-1'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {plan.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                <span className="font-display text-4xl font-bold text-foreground">
                  {formatPrice(plan.price)}
                </span>
                {plan.price > 0 && (
                  <span className="text-muted-foreground">/bulan</span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-pink-soft flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-pink-dark" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link to="/register">
                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-accent hover:bg-rose-gold-dark text-accent-foreground shadow-button'
                      : 'bg-primary hover:bg-pink-dark text-primary-foreground'
                  }`}
                >
                  {plan.price === 0 ? 'Get Started' : 'Start Free Trial'}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

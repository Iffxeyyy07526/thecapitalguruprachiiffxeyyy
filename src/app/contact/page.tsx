'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toastSuccess, toastError } from '@/components/ui/Toast';
import { SOCIAL_TELEGRAM_URL } from '@/lib/social';
import { SeoBreadcrumbs } from '@/components/seo/SeoBreadcrumbs';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to send message');
      }

      toastSuccess('Your message has been sent successfully!');
      reset();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Something went wrong.';
      toastError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20 selection:text-white">
      <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <SeoBreadcrumbs items={[{ name: 'Contact', href: '/contact' }]} />
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
              Get in Touch
            </h1>
            <p className="text-secondary text-lg">
              Have questions about our signals or need support? Our team is here to help.
            </p>
          </div>

          <div className="glass-card p-6 md:p-10 animate-slide-up">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Name"
                  placeholder="John Doe"
                  error={errors.name?.message}
                  {...register('name')}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="john@example.com"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>

              <Input
                label="Subject"
                placeholder="How can we help?"
                error={errors.subject?.message}
                {...register('subject')}
              />

              <div className="w-full">
                <label className="input-label">Message</label>
                <textarea
                  className={`input min-h-[150px] resize-y ${errors.message ? 'input-error' : ''}`}
                  placeholder="Your message here..."
                  {...register('message')}
                />
                {errors.message && (
                  <p className="input-error-msg">{errors.message.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                isLoading={isSubmitting}
                size="lg"
              >
                Send Message
              </Button>
            </form>
          </div>

          <div className="mt-12 text-center text-sm text-secondary">
            Prefer direct chat?{' '}
            <a href={SOCIAL_TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-alt transition-colors">
              Message us on Telegram
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

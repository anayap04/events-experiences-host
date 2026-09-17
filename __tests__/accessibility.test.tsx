import React from 'react';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { SkipLink } from '../src/components/SkipLink';
import { LiveAnnouncerProvider } from '../src/components/LiveAnnouncer';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('WCAG 2.2 AA Accessibility Audits', () => {
  it('SkipLink should pass axe accessibility checks with no violations', async () => {
    const { container } = render(<SkipLink targetId="main-content" label="Skip to content" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('LiveAnnouncerProvider should pass accessibility checks', async () => {
    const { container } = render(
      <LiveAnnouncerProvider>
        <div>Test Accessible Content</div>
      </LiveAnnouncerProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

import { MFE_REGISTRY, getRegisteredMfes, getMfeById } from '../src/lib/mfe-registry';

describe('Microfrontend Registry Unit Tests', () => {
  it('should return all registered microfrontends', () => {
    const mfes = getRegisteredMfes();
    expect(mfes.length).toBeGreaterThanOrEqual(2);
    expect(mfes.some((m) => m.id === 'events')).toBe(true);
    expect(mfes.some((m) => m.id === 'experiences')).toBe(true);
  });

  it('should retrieve a specific microfrontend by ID', () => {
    const eventsMfe = getMfeById('events');
    expect(eventsMfe).toBeDefined();
    expect(eventsMfe?.name).toContain('Events');
    expect(eventsMfe?.wcagLevel).toBe('WCAG 2.2 AA');
  });

  it('should return undefined for unregistered microfrontend ID', () => {
    const nonExistent = getMfeById('unknown-mfe');
    expect(nonExistent).toBeUndefined();
  });
});

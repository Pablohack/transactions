import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Mock para CSS imports (incluyendo Tailwind)
vi.mock('../index.css', () => ({}));
vi.mock('tailwindcss', () => ({}));
vi.mock('@tailwindcss/postcss', () => ({}));

// Cleanup después de cada test
afterEach(() => {
  cleanup();
});

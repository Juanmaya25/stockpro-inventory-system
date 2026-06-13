import '@testing-library/jest-dom';

// Recharts' ResponsiveContainer relies on ResizeObserver, which jsdom does
// not implement. A no-op shim keeps component tests from crashing.
globalThis.ResizeObserver ||= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

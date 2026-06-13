import { describe, it, expect } from 'vitest';
import { toCsv } from './csv';

describe('toCsv', () => {
  it('writes a header row from the object keys', () => {
    const csv = toCsv([{ name: 'A', price: 10 }]);
    expect(csv.split('\n')[0]).toBe('name,price');
  });

  it('quotes every value and serializes each row', () => {
    const csv = toCsv([{ name: 'Cable HDMI', price: 12 }]);
    expect(csv).toBe('name,price\n"Cable HDMI","12"');
  });

  it('escapes embedded double quotes by doubling them', () => {
    const csv = toCsv([{ note: 'Monitor LG 27"' }]);
    expect(csv).toBe('note\n"Monitor LG 27"""');
  });

  it('renders null and undefined as empty strings', () => {
    const csv = toCsv([{ a: null, b: undefined, c: 0 }]);
    expect(csv).toBe('a,b,c\n"","","0"');
  });
});

import { formatGreeting } from '../dateUtils';

describe('dateUtils', () => {
  let originalDate: DateConstructor;

  beforeEach(() => {
    originalDate = global.Date;
  });

  afterEach(() => {
    global.Date = originalDate;
  });

  it('returns "Good morning!" before noon', () => {
    const mockDate = new Date('2024-01-01T09:00:00');
    global.Date = class extends Date {
      constructor() {
        super();
        return mockDate;
      }
    } as unknown as DateConstructor;

    expect(formatGreeting()).toBe('Good morning!');
  });

  it('returns "Good afternoon!" between noon and 6 PM', () => {
    const mockDate = new Date('2024-01-01T14:00:00');
    global.Date = class extends Date {
      constructor() {
        super();
        return mockDate;
      }
    } as unknown as DateConstructor;

    expect(formatGreeting()).toBe('Good afternoon!');
  });

  it('returns "Good evening!" after 6 PM', () => {
    const mockDate = new Date('2024-01-01T19:00:00');
    global.Date = class extends Date {
      constructor() {
        super();
        return mockDate;
      }
    } as unknown as DateConstructor;

    expect(formatGreeting()).toBe('Good evening!');
  });
}); 
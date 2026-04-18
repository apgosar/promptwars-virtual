import { describe, it, expect } from 'vitest';
import stadiumData from '../data/stadiums.json';
import type { Stadium } from '../types';

describe('Stadium Data Integrity', () => {
  const stadiums = stadiumData.stadiums as Stadium[];

  it('contains at least one stadium', () => {
    expect(stadiums.length).toBeGreaterThan(0);
  });

  stadiums.forEach(stadium => {
    describe(`Stadium: ${stadium.name}`, () => {
      it('has a valid location', () => {
        expect(stadium.location.lat).toBeGreaterThan(-90);
        expect(stadium.location.lat).toBeLessThan(90);
        expect(stadium.location.lng).toBeGreaterThan(-180);
        expect(stadium.location.lng).toBeLessThan(180);
      });

      it('has gates with serving sections', () => {
        expect(stadium.gates.length).toBeGreaterThan(0);
        stadium.gates.forEach(gate => {
          expect(gate.closestSections.length).toBeGreaterThan(0);
        });
      });

      it('has amenities with wait times', () => {
        expect(stadium.amenities.length).toBeGreaterThan(0);
        stadium.amenities.forEach(amenity => {
          expect(amenity.wait_time_mins).toBeGreaterThanOrEqual(0);
        });
      });
    });
  });
});

import { DateUnitConversionTable } from '../src/date-unit-conversion-map';

describe('DateUnitConversionMap', () => {
  let dateUnitConversionTable: DateUnitConversionTable;

  beforeEach(() => {
    dateUnitConversionTable = new DateUnitConversionTable();
  });

  describe('calculateUnitBetween', () => {
    it('should calculate the number of units between two dates', () => {
      const unit = 'badUnit' as any;
      expect(() => dateUnitConversionTable.get(unit)).toThrow(
        'Invalid date unit: badUnit',
      );
    });
  });
});

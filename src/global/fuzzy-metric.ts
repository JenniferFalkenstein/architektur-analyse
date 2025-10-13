enum Fuzzy {
  EXCELLENT = 1,
  GOOD  = 2,
  OKAY = 3,
  NOT_GOOD = 4,
  HORRIBLE = 5
}

const mapFuzzyToWording = (value: number): string => {
  const roundedNumber = Math.round(value);
  switch(roundedNumber) {
    case Fuzzy.EXCELLENT:
      return 'Hervorragend (=1)';
    case Fuzzy.GOOD:
      return 'Gut (=2)';
    case Fuzzy.OKAY:
      return 'Okay (=3)';
    case Fuzzy.NOT_GOOD:
      return 'Nicht Okay (=4)'
    case Fuzzy.HORRIBLE:
      return 'Grauenvoll (=5)'
  }
}

export {
  Fuzzy,
  mapFuzzyToWording,
}

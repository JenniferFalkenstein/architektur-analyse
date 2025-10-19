enum Grade {
  EXCELLENT = 1,
  GOOD  = 2,
  OKAY = 3,
  NOT_GOOD = 4,
  HORRIBLE = 5
}

const mapGradeToWording = (value: number): string => {
  const roundedNumber = Math.round(value);
  switch(roundedNumber) {
    case Grade.EXCELLENT:
      return 'Hervorragend (=1)';
    case Grade.GOOD:
      return 'Gut (=2)';
    case Grade.OKAY:
      return 'Okay (=3)';
    case Grade.NOT_GOOD:
      return 'Nicht Gut (=4)'
    case Grade.HORRIBLE:
      return 'Grauenvoll (=5)'
  }
}

export {
  Grade,
  mapGradeToWording,
}

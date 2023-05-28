const getNumberType = (stringType: string): number => {
  switch (stringType) {
    case '건강검진':
      return 2;
    case '서류발급':
      return 3;
    case '기타':
      return 4;
    case '일반진료':
    default:
      return 1;
  }
};

export default getNumberType;

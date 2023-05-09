const getStringType = (NumberType: number) => {
  switch (NumberType) {
    case 2:
      return '건강검진';
    case 3:
      return '정밀검사';
    case 4:
      return '기타';
    case 1:
    default:
      return '일반진료';
  }
};
export default getStringType;

const translateCity = (city: string) => {
  let result: string;

  switch (city) {
    case 'Taipei&NewTaipei':
      result = '台北市 ＆ 新北市';
      break;
    case 'Taipei':
      result = '台北市';
      break;
    case 'NewTaipei':
      result = '新北市';
      break;
    case 'Taoyuan':
      result = '桃園市';
      break;
    case 'Taichung':
      result = '台中市';
      break;
    case 'Tainan':
      result = '台南市';
      break;
    case 'Kaohsiung':
      result = '高雄市';
      break;
    case 'Other_City':
      result = '其他城市';
      break;
    default:
      result = city;
  }

  return result;
};

export default translateCity;

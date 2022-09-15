const translateCity = (city: string, lan = 'zh') => {
  let result = '';

  if (lan === 'zh') {
    switch (city) {
      case 'Taipei&NewTaipei':
        result = '臺北市 ＆ 新北市';
        break;
      case 'Taipei':
        result = '臺北市';
        break;
      case 'NewTaipei':
        result = '新北市';
        break;
      case 'Taoyuan':
        result = '桃園市';
        break;
      case 'Taichung':
        result = '臺中市';
        break;
      case 'Tainan':
        result = '臺南市';
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
  } else if (lan === 'en') {
    switch (city) {
      case '臺北市':
        result = 'Taipei';
        break;
      case '新北市':
        result = 'NewTaipei';
        break;
      case '桃園市':
        result = 'Taoyuan';
        break;
      case '臺中市':
        result = 'Taichung';
        break;
      case '臺南市':
        result = 'Tainan';
        break;
      case '高雄市':
        result = 'Kaohsiung';
        break;
      default:
        result = city;
    }
  } else {
    throw new Error('translateCity Fn second parameter should be "zh" or "en"!');
  }

  return result;
};

export default translateCity;

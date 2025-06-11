const desensitizeUtil = {
  /**
   * 身份证号脱敏
   * @param {*} str
   * @return {*}
   */
  idCard: function (str) {
    if (str) {
      return str.replace(/(.{6}).*(.{2})/, "$1**********$2");
    }
    return str;
  },

  /**
   * 手机号脱敏
   * @param {*} str
   * @return {*}
   */
  phone: function (str) {
    if (str && str.length < 11) {
      // 7位手机号将中间三位脱敏
      return str.replace(/(.{2}).{3}(.{2})/, "$1***$2");
    } else if (str) {
      return str.replace(/(.{3}).*(.{4})/, "$1****$2");
    }
    return str;
  },
};

const desensitizeTypeList = Object.keys(desensitizeUtil);

export default desensitizeUtil;
export { desensitizeTypeList };

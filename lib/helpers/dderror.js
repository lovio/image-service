const DEFAULTMSG = '抱歉，遇到未知错误，请重试';

const MSG = {
  invalid_image: '请上传正确的图片',
  json_parse_error: 'JSON解析错误',
  params_error: '参数错误',
};

export default class DDError extends Error {
  constructor(message, httpStatus, more) {
    super(message);
    this.message = message;
    this.status = httpStatus || 400;
    this.errtext = MSG[message] || DEFAULTMSG;
    this.more = more;
  }
}

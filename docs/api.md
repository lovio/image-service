## API

### 上传图片

  `POST /images`

  QueryString
  `name`[option]: 待上传图片的文件名
  `options`: 裁切的参数 是数组对象的JSON.stringify结果
  每一个裁切的参数
  + width 宽度
  + height 高度
  + quality 图片质量
  + prefix 文件名前缀
  以上为必须字段，如果缺少则不进行相应的裁切

  + crop 裁切的起点方向 e.g. `north`


  Content-Type可以有两种

  1. `multipart/form-data`

  `FILE` 待上传的文件
    + key `file`
    + 数量 1个（目前仅支持文件单个上传）

  2. `application/octet-stream`

  `body`为待上传文件的`bianry`内容

  示例见`test/test_api`

  返回值
  最后的文件名数组

### 获取图片EXIF信息

  `GET /images/exif`

  QueryString
  `name`: 文件名

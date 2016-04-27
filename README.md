image-service
=============

图片上传服务
文档见`docs`目录

## Features
1. 多种上传方式
  + `multipart/form-data`
  + `application/octet-stream`
2. 图片处理（裁切、水印等等）[lovell/sharp](https://github.com/lovell/sharp)
3. 多个CDN接入
  + [x] upyun
  + [ ] qiniu
  + [ ] aliyun
4. 默认文件名为图片md5值

## TODO
1. 本地存储图片，多个对象存储服务
2. 数据库追踪所有图片（上传时间、各CDN状态）
3. 服务健康检查
4. 生成二维码
5. 添加权限后，对外开放接口
6. 不同的CDN、存储同步服务

## scripts

```bash
# 编译
npm run build

# 测试
npm test
```
详情见package.json

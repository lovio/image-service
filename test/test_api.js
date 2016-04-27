import request from 'superagent';
import fs from 'fs';
import each from 'async/each';
import * as upyunHelper from '../lib/helpers/cdn/upyun.js';

let filenames = [];

describe('API', () => {
  describe('POST /images', () => {
    it('should upload images using multipart/form-data', (done) => {
      request
        .post(':3001/images')
        .attach('file', './test/fixtures/goddess.jpg')
        .end((err, res) => {
          expect(err).to.be.null;
          filenames = filenames.concat(res.body);
          done();
        });
    });

    it('should upload images using multipart/form-data and only accept file', (done) => {
      request
        .post(':3001/images')
        .attach('image', './test/fixtures/goddess.jpg')
        .end((err, res) => {
          expect(err.status).to.equal(400);
          expect(res.body.message).to.equal('Unexpected field');
          done();
        });
    });

    it('should upload images using `application/octet-stream`', (done) => {
      const imageBuffer = fs.readFileSync('./test/fixtures/goddess.jpg');
      request.post(':3001/images')
        .set('Content-Type', 'application/octet-stream')
        .send(imageBuffer)
        .end((err, res) => {
          expect(err).to.be.null;
          filenames = filenames.concat(res.body);
          done();
        });
    });

    it('should upload images with a given name', (done) => {
      const imageBuffer = fs.readFileSync('./test/fixtures/goddess.jpg');
      request.post(':3001/images')
        .set('Content-Type', 'application/octet-stream')
        .query({
          name: 'testImages.jpg',
        })
        .send(imageBuffer)
        .end((err, res) => {
          expect(err).to.be.null;
          filenames = filenames.concat(res.body);
          done();
        });
    });

    it('should return err if uploaded file is not a image', (done) => {
      const imageBuffer = fs.readFileSync('./test/fixtures/random');
      request.post(':3001/images')
        .set('Content-Type', 'application/octet-stream')
        .send(imageBuffer)
        .end((err, res) => {
          expect(err.status).to.equal(400);
          expect(res.body.message).to.equal('invalid_image');
          done();
        });
    });
    // options是要裁剪的参数
    it('upload a file with options', (done) => {
      const imageBuffer = fs.readFileSync('./test/fixtures/goddess.jpg');
      const prefix2 = 'mid';
      request.post(':3001/images')
        .set('Content-Type', 'application/octet-stream')
        .query({
          options: JSON.stringify([{
            width: 200,
            height: 200,
            quality: 90,
          }, {
            width: 340,
            height: 340,
            quality: 80,
            crop: 'north',
            prefix: prefix2,
          }]),
        })
        .send(imageBuffer)
        .end((err, res) => {
          expect(err).to.be.null;
          filenames = filenames.concat(res.body);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(2);
          done();
        });
    });

    it('all uploaded files should be exist', (done) => {
      each(filenames, (filename, ecb) => {
        upyunHelper.existsFile(filename, (err, rst) => {
          expect(err).to.be.null;
          expect(rst.statusCode).to.equal(200);
          expect(rst.data).to.be.an('object');
          expect(rst.data).to.have.all.keys('type', 'size', 'date');
          return ecb();
        });
      }, done);
    });

    it('get exif info of a image', (done) => {
      request.get(':3001/images/exif')
        .query({
          name: filenames[0],
        })
        .end((err, rst) => {
          expect(err).to.be.null;
          expect(rst.body).to.have.all.keys('width', 'height', 'frames', 'type', 'EXIF');
          done();
        });
    });

    it('get exif info of a image that not exist', (done) => {
      request.get(':3001/images/exif')
        .query({
          name: 1,
        })
        .end((err, rst) => {
          expect(err).to.be.null;
          expect(rst.body).to.deep.equal({});
          done();
        });
    });
  });

  // remove uploaded file form cdn
  after((done) => each(filenames, (filename, ecb) => upyunHelper.removeFile(filename, ecb), done));
});

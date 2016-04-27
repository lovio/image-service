FROM marcbachmann/libvips:8.2.3

# install g++ for node-gyp sharp
RUN echo "deb http://ftp.sjtu.edu.cn/ubuntu/ trusty main restricted universe multiverse\n \
deb http://ftp.sjtu.edu.cn/ubuntu/ trusty-updates main restricted universe multiverse" > /etc/apt/sources.list

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && apt-get install -y \
    curl \
    g++ \
&& apt-get clean \
&& rm -rf /var/lib/apt/lists/*

ENV NODE_VERSION 4.4.3
ENV NPM_CONFIG_LOGLEVEL info
ENV NPM_CONFIG_REGISTRY https://registry.npm.taobao.org

# install node.js v4.2.2
RUN curl -SLO "https://npm.taobao.org/mirrors/node/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz" \
  && tar -xzf "node-v$NODE_VERSION-linux-x64.tar.gz" -C /usr/local --strip-components=1 \
  && rm "node-v$NODE_VERSION-linux-x64.tar.gz"

WORKDIR /www/image-service
# cache dependencies
COPY package.json package.json
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/app.js"]

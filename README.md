# qj-mobile-uploader
QJYD React Image Uploader for Mobile

[![NPM version](https://img.shields.io/npm/v/qj-mobile-uploader.svg?style=flat)](https://www.npmjs.org/package/qj-mobile-uploader)
[![Build Status](https://travis-ci.org/Aus0049/qj-mobile-uploader.svg?branch=master)](https://travis-ci.org/Aus-0049/qj-mobile-uploader)

## Install

```shell
npm install qj-mobile-uploader
```

[![qj-button](https://nodei.co/npm/qj-mobile-uploader.png)](https://npmjs.org/package/qj-mobile-uploader)

## Usage

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import Uploader from 'qj-mobile-uploader'
import 'qj-mobile-uploader/index.css'

const element = document.getElementById('root');

ReactDOM.render(
    <Uploader 
        uploadUrl={'/upload'}
        max={9}
    />
    , element);
```

## API

Uploader

| Name            | Type        | Default           | Description                   |
| --------------- | ----------- | ----------------- | ----------------------------- |
| prefixCls       | string      | 'qj-uploader'     | prefixCls of this component   |
| compress        | boolean     | true              | should compress image         |
| compressionRatio| number      | 20                | number of compression ratio   |
| max             | number      | 9                 | max image queue number        |
| maxSize         | number      | 10 * 1024         | max size of each image        |
| maxUploadSize   | number      | 3                 | max number of uploading image number       |
| typeArray       | array<string>| ['jpeg', 'jpg', 'png', 'gif'] | array of support image type      |
| labelName       | string      | '上传图片'         | name of label                 |
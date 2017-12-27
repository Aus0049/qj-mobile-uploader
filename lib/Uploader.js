'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _exifJs = require('exif-js');

var _exifJs2 = _interopRequireDefault(_exifJs);

var _Figure = require('./Figure');

var _Figure2 = _interopRequireDefault(_Figure);

var _componentFontAwesome = require('component-font-awesome');

var _componentFontAwesome2 = _interopRequireDefault(_componentFontAwesome);

require('babel-polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Aus on 2017/12/27.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


// 统计img总数 防止重复
var imgNumber = 0;

// 生成唯一的id
var getUuid = function getUuid() {
    return 'img-' + new Date().getTime() + '-' + imgNumber++;
};

// 内置的一个获取图片key的format方法
var getImgKey = function getImgKey(item) {
    return item.imgKey;
};

var Uploader = function (_React$Component) {
    _inherits(Uploader, _React$Component);

    function Uploader(props) {
        _classCallCheck(this, Uploader);

        var _this2 = _possibleConstructorReturn(this, (Uploader.__proto__ || Object.getPrototypeOf(Uploader)).call(this, props));

        _this2.state = {
            imgArray: [] // 图片已上传 显示的数组
        };
        _this2.handleInputChange = _this2.handleInputChange.bind(_this2);
        _this2.handleDelete = _this2.handleDelete.bind(_this2);
        _this2.handleReUpload = _this2.handleReUpload.bind(_this2);
        _this2.compress = _this2.compress.bind(_this2);
        _this2.processData = _this2.processData.bind(_this2);
        return _this2;
    }

    _createClass(Uploader, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            // 判断是否有初始化的数据传入
            var data = this.props.data;


            if (data && data.length > 0) {
                this.setState({ imgArray: data });
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this._isMounted = true;
        }
    }, {
        key: 'handleInputChange',
        value: function handleInputChange(event) {
            var _this3 = this;

            var _props = this.props,
                typeArray = _props.typeArray,
                max = _props.max,
                maxSize = _props.maxSize;
            var imgArray = this.state.imgArray;

            var _this = this;
            var uploadedImgArray = []; // 真正在页面显示的图片数组
            var uploadQueue = []; // 图片上传队列 这个队列是在图片选中到上传之间使用的 上传完成则清除

            // event.target.files是个类数组对象 需要转成数组方便处理
            var selectedFiles = Array.prototype.slice.call(event.target.files).map(function (item) {
                return item;
            });

            // 检查文件个数 页面显示的图片个数不能超过限制
            if (imgArray.length + selectedFiles.length > max) {
                // 自定义报错
                // Toast.error('最多只能选择'+max+'张图片', 2000, undefined, false);
                // 清空input
                this.refs.input.value = null;
                return;
            }

            var imgPass = { typeError: false, sizeError: false };

            selectedFiles.map(function (item) {
                // 图片类型检查
                if (typeArray.indexOf(item.type.split('/')[1]) === -1) {
                    imgPass.typeError = true;
                }
                // 图片尺寸检查
                if (item.size > maxSize * 1024) {
                    imgPass.sizeError = true;
                }
            });

            // 有错误跳出
            if (imgPass.typeError) {
                // 自定义报错
                // Toast.error('不支持文件类型', 2000, undefined, false);
                this.refs.input.value = null;
                return;
            }

            if (imgPass.sizeError) {
                // 自定义报错
                // Toast.error('文件大小超过限制', 2000, undefined, false);
                this.refs.input.value = null;
                return;
            }

            // 没问题 处理图片
            var promiseArray = selectedFiles.map(function (item) {
                // 为图片加上位移id
                var uuid = getUuid();
                // 页面显示加入数据
                return _this.transformFileToDataUrl(item).then(function (data) {
                    var orientation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

                    // 上传队列加入该数据
                    uploadQueue.push({ uuid: uuid, file: item, dataUrl: data, orientation: orientation });

                    uploadedImgArray.push({ // 显示在页面的数据的标准格式
                        id: uuid, // 图片唯一id
                        dataUrl: data, // 图片的base64编码
                        imgKey: '', // 图片的key 后端上传保存使用
                        imgUrl: '', // 图片真实路径 后端返回的
                        name: item.name, // 图片的名字
                        orientation: orientation, // 图片旋转
                        status: 1 // status表示这张图片的状态 1：上传中，2上传成功，3：上传失败
                    });
                });
            });
            // 等所有都遍历完成
            Promise.all(promiseArray).then(function () {
                // 检查是否是ios ios图片使用canvas压缩之后图片size为0 原因未知
                var canCompress = true;

                // ios 图片size为0
                if (!!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
                    canCompress = false;
                }

                // 没错误准备上传
                // 页面先显示一共上传图片个数
                _this3.setState({ imgArray: imgArray.concat(uploadedImgArray) });

                // 通过该函数获取每次要上传的数组
                _this3.uploadGen = _this3.uploadGenerator(uploadQueue);
                // 第一次要上传的数量
                var firstUpload = _this3.uploadGen.next();
                // 清空input
                _this3.refs.input.value = null;

                // 真正开始上传流程
                firstUpload.value.map(function (item) {
                    /**
                     * 图片上传分成5步
                     * 图片转dataUrl
                     * 压缩
                     * 处理数据格式
                     * 准备数据上传
                     * 上传
                     *
                     * 前两步是回调的形式 后面是同步的形式
                     */
                    if (canCompress) {
                        _this3.compress(item, _this3.processData);
                    } else {
                        _this3.processFormDataForIos(item);
                    }
                });
            });
        }
    }, {
        key: 'handleReUpload',
        value: function handleReUpload(id) {
            // 根据id重新上传
            var imgArray = this.state.imgArray;


            var errorItem = imgArray.filter(function (item) {
                if (item.id === id) return true;
            })[0];

            // set新的state
            errorItem.status = 1;
            this.setState({ imgArray: imgArray });

            // 检查是否是ios ios图片使用canvas压缩之后图片size为0 原因未知
            // 解决办法更改服务端使用base64上传图片
            var canCompress = true;
            // ios
            if (!!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
                canCompress = false;
            }

            if (canCompress) {
                this.compress(errorItem, this.processData);
            } else {
                this.processFormDataForIos(errorItem);
            }
        }
    }, {
        key: 'handleDelete',
        value: function handleDelete(id) {
            this.setState(function (previousState) {
                previousState.imgArray = previousState.imgArray.filter(function (item) {
                    return item.id !== id;
                });
                return previousState;
            });
        }
    }, {
        key: 'handleProgress',
        value: function handleProgress(id, e) {
            // 监听上传进度 操作DOM 显示进度
            var number = Number.parseInt(e.loaded / e.total * 100) + '%';
            var text = document.querySelector('#text-' + id);

            if (text) text.innerHTML = number;
        }
    }, {
        key: 'handleUploadEnd',
        value: function handleUploadEnd(data, response, status) {
            // 隐藏进度
            var text = document.querySelector('#text-' + data.uuid);
            if (text) text.innerHTML = '';

            // 处理页面卸载的情况
            if (this._isMounted) return;

            // 准备一条标准数据
            var _this = this;
            var obj = {
                id: data.uuid,
                uuid: data.uuid,
                imgKey: response ? response.data.key : '',
                imgUrl: '',
                name: data.file.name,
                dataUrl: data.dataUrl,
                compressedDataUrl: data.compressedDataUrl,
                blob: data.blob,
                file: data.file,
                formData: data.formData,
                status: status
            };

            // 更改状态
            this.setState(function (previousState) {
                previousState.imgArray = previousState.imgArray.map(function (item) {
                    if (item.id === data.uuid) {
                        item = obj;
                    }

                    return item;
                });
                return previousState;
            });

            // 上传下一个
            var nextUpload = this.uploadGen.next();
            if (!nextUpload.done) {

                // 检查是否是ios ios图片使用canvas压缩之后图片size为0 原因未知
                // 解决办法更改服务端使用base64上传图片
                var canCompress = true;
                // ios
                if (!!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
                    canCompress = false;
                }

                nextUpload.value.map(function (item) {
                    if (canCompress) {
                        _this.compress(item, _this.processData);
                    } else {
                        _this.processFormDataForIos(item);
                    }
                });
            }
        }
    }, {
        key: 'transformFileToDataUrl',
        value: function transformFileToDataUrl(file) {
            /**
             * 图片上传流程的第一步
             * @param data file文件
             */
            return new Promise(function (resolve, reject) {
                var orientation = void 0;

                // 封装好的函数
                var reader = new FileReader();

                // ⚠️ 这是个回调过程 不是同步的
                reader.addEventListener('load', function (e) {
                    var result = e.target.result;

                    _exifJs2.default.getData(file, function () {
                        _exifJs2.default.getAllTags(this);
                        orientation = _exifJs2.default.getTag(this, 'Orientation');
                        resolve(result, orientation);
                    });
                });

                reader.readAsDataURL(file);
            });
        }
    }, {
        key: 'uploadGenerator',
        value: /*#__PURE__*/regeneratorRuntime.mark(function uploadGenerator(uploadQueue) {
            var maxUploadSize, result, i;
            return regeneratorRuntime.wrap(function uploadGenerator$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            /**
                             * 多张图片并发上传控制规则
                             * 上传1-max数量的图片
                             * 设置一个最大上传数量
                             * 保证最大只有这个数量的上传请求
                             *
                             */
                            // 最多只有三个请求在上传
                            maxUploadSize = this.props.maxUploadSize;

                            if (!(uploadQueue.length > maxUploadSize)) {
                                _context.next = 19;
                                break;
                            }

                            result = [];
                            i = 0;

                        case 4:
                            if (!(i < uploadQueue.length)) {
                                _context.next = 17;
                                break;
                            }

                            if (!(i < maxUploadSize)) {
                                _context.next = 12;
                                break;
                            }

                            result.push(uploadQueue[i]);

                            if (!(i === maxUploadSize - 1)) {
                                _context.next = 10;
                                break;
                            }

                            _context.next = 10;
                            return result;

                        case 10:
                            _context.next = 14;
                            break;

                        case 12:
                            _context.next = 14;
                            return [uploadQueue[i]];

                        case 14:
                            i++;
                            _context.next = 4;
                            break;

                        case 17:
                            _context.next = 21;
                            break;

                        case 19:
                            _context.next = 21;
                            return uploadQueue.map(function (item) {
                                return item;
                            });

                        case 21:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, uploadGenerator, this);
        })
    }, {
        key: 'compress',
        value: function compress(data, callback) {
            /**
             * 压缩图片
             * @param data file文件 数据会一直向下传递
             * @param callback 下一步回调
             */
            var _props2 = this.props,
                compressionRatio = _props2.compressionRatio,
                compress = _props2.compress;

            var imgCompassMaxSize = 200 * 1024; // 超过 200k 就压缩
            var imgFile = data.file;
            var orientation = data.orientation;
            var img = new window.Image();

            img.src = data.dataUrl;

            img.onload = function () {

                var drawWidth = void 0,
                    drawHeight = void 0,
                    width = void 0,
                    height = void 0;

                drawWidth = this.naturalWidth;
                drawHeight = this.naturalHeight;

                // 改变一下图片大小
                var maxSide = Math.max(drawWidth, drawHeight);

                if (maxSide > 1024) {
                    var minSide = Math.min(drawWidth, drawHeight);
                    minSide = minSide / maxSide * 1024;
                    maxSide = 1024;
                    if (drawWidth > drawHeight) {
                        drawWidth = maxSide;
                        drawHeight = minSide;
                    } else {
                        drawWidth = minSide;
                        drawHeight = maxSide;
                    }
                }

                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');

                canvas.width = width = drawWidth;
                canvas.height = height = drawHeight;
                // 判断图片方向，重置 canvas 大小，确定旋转角度，iphone 默认的是 home 键在右方的横屏拍摄方式
                switch (orientation) {
                    // 1 不需要旋转
                    case 1:
                        {
                            ctx.drawImage(img, 0, 0, drawWidth, drawHeight);
                            ctx.clearRect(0, 0, width, height);
                            ctx.drawImage(img, 0, 0, width, height);
                            break;
                        }
                    // iphone 横屏拍摄，此时 home 键在左侧 旋转180度
                    case 3:
                        {
                            ctx.clearRect(0, 0, width, height);
                            ctx.translate(0, 0);
                            ctx.rotate(Math.PI);
                            ctx.drawImage(img, -width, -height, width, height);
                            break;
                        }
                    // iphone 竖屏拍摄，此时 home 键在下方(正常拿手机的方向) 旋转90度
                    case 6:
                        {
                            canvas.width = height;
                            canvas.height = width;
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            ctx.translate(0, 0);
                            ctx.rotate(90 * Math.PI / 180);
                            ctx.drawImage(img, 0, -height, width, height);
                            break;
                        }
                    // iphone 竖屏拍摄，此时 home 键在上方 旋转270度
                    case 8:
                        {
                            canvas.width = height;
                            canvas.height = width;
                            ctx.clearRect(0, 0, width, height);
                            ctx.translate(0, 0);
                            ctx.rotate(-90 * Math.PI / 180);
                            ctx.drawImage(img, -width, 0, width, height);
                            break;
                        }
                    default:
                        {
                            ctx.clearRect(0, 0, width, height);
                            ctx.drawImage(img, 0, 0, width, height);
                            break;
                        }
                }

                var compressedDataUrl = void 0;

                if (compress && imgFile.length > imgCompassMaxSize) {
                    compressedDataUrl = canvas.toDataURL(imgFile.type, compressionRatio / 100);
                } else {
                    compressedDataUrl = canvas.toDataURL(imgFile.type, 1);
                }

                data.compressedDataUrl = compressedDataUrl;

                callback(data);
            };
        }
    }, {
        key: 'processData',
        value: function processData(data) {
            // 为了兼容性 处理数据
            var dataURL = data.compressedDataUrl;
            var imgFile = data.file;
            var binaryString = window.atob(dataURL.split(',')[1]);
            var arrayBuffer = new ArrayBuffer(binaryString.length);
            var intArray = new Uint8Array(arrayBuffer);

            for (var i = 0, j = binaryString.length; i < j; i++) {
                intArray[i] = binaryString.charCodeAt(i);
            }

            var fileData = [intArray];

            var blob = void 0;

            try {
                blob = new Blob(fileData, { type: imgFile.type });
            } catch (error) {
                window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
                if (error.name === 'TypeError' && window.BlobBuilder) {
                    var builder = new window.BlobBuilder();
                    builder.append(arrayBuffer);
                    blob = builder.getBlob(imgFile.type);
                } else {
                    throw new Error('版本过低，不支持上传图片');
                }
            }

            // blob 转file
            var fileOfBlob = new File([blob], imgFile.name);
            data.blob = fileOfBlob;

            this.processFormData(data);
        }
    }, {
        key: 'processFormData',
        value: function processFormData(data) {
            // 准备上传数据
            var formData = new FormData();
            var imgFile = data.file;
            var blob = data.blob;

            // type
            formData.append('type', imgFile.type);
            // size
            formData.append('size', blob.size);
            // name
            formData.append('name', imgFile.name);
            // lastModifiedDate
            formData.append('lastModifiedDate', imgFile.lastModifiedDate);
            // append 文件
            formData.append('file', blob);

            data.formData = formData;

            this.uploadImg(data);
        }
    }, {
        key: 'processFormDataForIos',
        value: function processFormDataForIos(data) {
            var formData = new FormData();
            var imgFile = data.file;

            // type
            formData.append('type', imgFile.type || 'image/jpeg');
            // size
            formData.append('size', imgFile.size);
            // name
            formData.append('name', imgFile.name);
            // lastModifiedDate
            formData.append('lastModifiedDate', imgFile.lastModifiedDate);
            // append 文件
            formData.append('file', imgFile);

            data.formData = formData;

            this.uploadImg(data);
        }
    }, {
        key: 'uploadImg',
        value: function uploadImg(data) {
            // 开始发送请求上传
            var _this = this;
            var xhr = new XMLHttpRequest();
            var uploadUrl = this.props.uploadUrl;

            var formData = data.formData;

            // 进度监听
            xhr.upload.addEventListener('progress', _this.handleProgress.bind(_this, data.uuid), false);
            // xhr.addEventListener("error", _this.handleUploadEnd(data, undefined, 3), false);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    // 根据接口返回不同 处理请求数据不同
                    // 一般来说 后端会返回给你图片的key 提交的时候，也要提交key
                    // const result = JSON.parse(xhr.responseText);
                    var result = {
                        status: 'ok',
                        code: 200,
                        data: {
                            url: '',
                            key: 'imgKey'
                        }
                    };

                    if (xhr.status === 200 || xhr.status === 201) {
                        // 上传成功
                        _this.handleUploadEnd(data, result, 2);
                    } else {
                        // 上传失败
                        _this.handleUploadEnd(data, undefined, 3);
                    }
                }
            };

            xhr.open('POST', uploadUrl, true);
            xhr.send(formData);
        }
    }, {
        key: 'getImgArray',
        value: function getImgArray() {
            var format = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getImgKey;

            // 获取图片数据，供使用者调用
            var imgArray = this.state.imgArray;


            return imgArray.map(format);
        }
    }, {
        key: 'getImagesListDOM',
        value: function getImagesListDOM() {
            var _this4 = this;

            // 处理显示图片的DOM
            var _props3 = this.props,
                max = _props3.max,
                labelName = _props3.labelName,
                prefixCls = _props3.prefixCls;

            var uploadingArray = [];
            var imgArray = this.state.imgArray;

            var result = imgArray.map(function (item) {
                // 正在上传的图片
                if (item.status === 1) {
                    uploadingArray.push(item);
                }

                return _react2.default.createElement(_Figure2.default, _extends({
                    key: item.id }, item, {
                    onDelete: _this4.handleDelete,
                    onError: _this4.handleReUpload
                }));
            });

            // 图片数量达到最大值
            if (result.length >= max) return result;

            var onPress = function onPress() {
                _this4.refs.input.click();
            };

            // 简单的显示文案逻辑判断
            var text = labelName;

            if (imgArray.length > 0) {
                // 上传成功 / 上传总数
                text = imgArray.filter(function (item) {
                    if (item.status === 2) return true;
                }).length + '/' + imgArray.length;
            }

            result.push(_react2.default.createElement(
                'div',
                { key: 'button', className: prefixCls + '-button', onClick: onPress },
                _react2.default.createElement(_componentFontAwesome2.default, { key: 'icon', type: 'camera' }),
                _react2.default.createElement(
                    'p',
                    { className: 'text' },
                    text
                )
            ));

            return result;
        }
    }, {
        key: 'render',
        value: function render() {
            var prefixCls = this.props.prefixCls;

            var imagesList = this.getImagesListDOM();

            return _react2.default.createElement(
                'div',
                { className: prefixCls },
                imagesList,
                _react2.default.createElement('input', {
                    ref: 'input', type: 'file',
                    className: 'file-input', name: 'image',
                    accept: 'image/*', multiple: 'multiple',
                    onChange: this.handleInputChange
                })
            );
        }
    }]);

    return Uploader;
}(_react2.default.Component);

Uploader.propTypes = {
    uploadUrl: _react2.default.PropTypes.string.isRequired, // 图上传路径
    prefixCls: _react2.default.PropTypes.string, // class前缀
    compress: _react2.default.PropTypes.bool, // 是否进行图片压缩
    compressionRatio: _react2.default.PropTypes.number, // 图片压缩比例 单位：%
    data: _react2.default.PropTypes.array, // 初始化数据 其中的每个元素必须是标准化数据格式
    max: _react2.default.PropTypes.number, // 最大上传图片数
    maxSize: _react2.default.PropTypes.number, // 图片最大体积 单位：KB
    maxUploadSize: _react2.default.PropTypes.number, // 最大同时上传数目
    typeArray: _react2.default.PropTypes.array, // 支持图片类型数组
    labelName: _react2.default.PropTypes.string // 上传图片按钮提示文案
};

Uploader.defaultProps = {
    prefixCls: 'zby-uploader',
    compress: true,
    compressionRatio: 20,
    data: [],
    max: 9,
    maxSize: 10 * 1024, // 10MB
    maxUploadSize: 3,
    typeArray: ['jpeg', 'jpg', 'png', 'gif'],
    labelName: '上传图片'
};

exports.default = Uploader;
//# sourceMappingURL=Uploader.js.map
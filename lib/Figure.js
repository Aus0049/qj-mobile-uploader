'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _componentFontAwesome = require('component-font-awesome');

var _componentFontAwesome2 = _interopRequireDefault(_componentFontAwesome);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Aus on 2017/12/27.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


// Figure就是每个图片的容器 以及实现预览的容器
var Figure = function (_React$Component) {
    _inherits(Figure, _React$Component);

    function Figure(props) {
        _classCallCheck(this, Figure);

        var _this = _possibleConstructorReturn(this, (Figure.__proto__ || Object.getPrototypeOf(Figure)).call(this, props));

        _this.state = {};
        _this.handlePreview = _this.handlePreview.bind(_this);
        _this.handleDelete = _this.handleDelete.bind(_this);
        _this.handleReUpload = _this.handleReUpload.bind(_this);
        _this.handleClosePreview = _this.handleClosePreview.bind(_this);
        return _this;
    }

    _createClass(Figure, [{
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            var id = this.props.id;

            var mask = document.getElementById('preview-' + id);

            if (mask) mask.remove();
        }
    }, {
        key: 'handlePreview',
        value: function handlePreview() {
            var _props = this.props,
                prefixCls = _props.prefixCls,
                id = _props.id,
                imgUrl = _props.imgUrl,
                dataUrl = _props.dataUrl,
                canPreview = _props.canPreview;

            var src = imgUrl ? imgUrl : dataUrl;
            // 打开预览
            if (!canPreview) return;

            // 动态插入dom
            var img = document.createElement('img');
            img.src = src;
            img.onclick = this.handleClosePreview;
            var mask = document.createElement('div');
            mask.id = 'preview-' + id;
            mask.className = prefixCls + '-preview-container';
            mask.onclick = this.handleClosePreview;
            mask.appendChild(img);

            document.body.appendChild(mask);
        }
    }, {
        key: 'handleDelete',
        value: function handleDelete(e) {
            var _props2 = this.props,
                id = _props2.id,
                onDelete = _props2.onDelete;

            e.stopPropagation();
            document.getElementById(id).className += ' deleted';

            // 利用定时器清掉
            var timer = setTimeout(function () {
                clearTimeout(timer);
                onDelete(id);
            }, 300);
        }
    }, {
        key: 'handleReUpload',
        value: function handleReUpload() {
            var _props3 = this.props,
                id = _props3.id,
                onError = _props3.onError;

            onError(id);
        }
    }, {
        key: 'handleClosePreview',
        value: function handleClosePreview(e) {
            var id = this.props.id;

            document.getElementById('preview-' + id).remove();
            e.stopPropagation();
        }
    }, {
        key: 'getPreviewBoxDOM',
        value: function getPreviewBoxDOM() {
            var _props4 = this.props,
                prefixCls = _props4.prefixCls,
                id = _props4.id,
                status = _props4.status,
                imgUrl = _props4.imgUrl,
                dataUrl = _props4.dataUrl,
                canDelete = _props4.canDelete;

            var src = imgUrl ? imgUrl : dataUrl;

            switch (status) {
                case 1:
                    {
                        // 上传中
                        return _react2.default.createElement(
                            'div',
                            {
                                id: id,
                                className: prefixCls + '-preview-box loading',
                                onClick: this.handlePreview
                            },
                            _react2.default.createElement(
                                'div',
                                { className: 'img-box' },
                                _react2.default.createElement('img', { src: src })
                            ),
                            _react2.default.createElement('div', { className: 'progress-text', id: 'text-' + id }),
                            canDelete ? _react2.default.createElement(
                                'div',
                                { className: 'close', onClick: this.handleDelete },
                                _react2.default.createElement(_componentFontAwesome2.default, { type: 'times' })
                            ) : null
                        );
                    }
                case 2:
                    {
                        // 上传成功
                        return _react2.default.createElement(
                            'div',
                            {
                                id: id,
                                className: prefixCls + '-preview-box loaded',
                                onClick: this.handlePreview
                            },
                            _react2.default.createElement(
                                'div',
                                { className: 'img-box' },
                                _react2.default.createElement('img', { src: src })
                            ),
                            _react2.default.createElement('div', { className: 'progress-text', id: 'text-' + id }),
                            canDelete ? _react2.default.createElement(
                                'div',
                                { className: 'close', onClick: this.handleDelete },
                                _react2.default.createElement(_componentFontAwesome2.default, { type: 'times' })
                            ) : null
                        );
                    }
                case 3:
                    {
                        // 上传失败
                        return _react2.default.createElement(
                            'div',
                            {
                                id: id,
                                className: prefixCls + '-preview-box error',
                                onClick: this.handleReUpload
                            },
                            _react2.default.createElement(
                                'div',
                                { className: 'img-box' },
                                _react2.default.createElement('img', { src: src })
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'progress-text', id: 'text-' + id },
                                _react2.default.createElement(_componentFontAwesome2.default, { type: 'refresh' })
                            ),
                            canDelete ? _react2.default.createElement(
                                'div',
                                { className: 'close', onClick: this.handleDelete },
                                _react2.default.createElement(_componentFontAwesome2.default, { type: 'times' })
                            ) : null
                        );
                    }
                default:
                    break;
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var prefixCls = this.props.prefixCls;

            var previewBoxDOM = this.getPreviewBoxDOM();

            return _react2.default.createElement(
                'div',
                { className: (0, _classnames2.default)([prefixCls, prefixCls + '-with-preview']) },
                previewBoxDOM
            );
        }
    }]);

    return Figure;
}(_react2.default.Component);

function empty() {}

Figure.propTypes = {
    id: _react2.default.PropTypes.string.isRequired, // 图片的id
    status: _react2.default.PropTypes.oneOf([1, 2, 3]).isRequired, // 此图片上传的状态 1:上传中,2:上传成功,3:上传失败
    prefixCls: _react2.default.PropTypes.string, // class前缀
    canPreview: _react2.default.PropTypes.bool, // 是否使用预览功能
    canDelete: _react2.default.PropTypes.bool, // 是否可以删除
    dataUrl: _react2.default.PropTypes.string, // 图片的base64编码
    imgUrl: _react2.default.PropTypes.string, // 图片的路径
    onDelete: _react2.default.PropTypes.func, // 删除的回调
    onError: _react2.default.PropTypes.func // 上传失败的回调
};

Figure.defaultProps = {
    prefixCls: 'qj-figure',
    canPreview: true,
    canDelete: true,
    dataUrl: '',
    imgUrl: '',
    onDelete: empty,
    onError: empty
};

exports.default = Figure;
//# sourceMappingURL=Figure.js.map
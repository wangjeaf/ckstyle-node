define('ckstyle/ckservice', function(require, exports, module) {
    var styler = require('./ckstyler');
    var BinaryRule = require('./browsers/BinaryRule');
    var CssChecker = styler.CssChecker;

    exports.doCompress = function(css) {
        var checker = new CssChecker(css);
        checker.prepare()
        return checker.doCompress();
    }

    exports.doFix = function(css) {
        var checker = new CssChecker(css)
        checker.prepare();
        return checker.doFix()
    }

    exports.doFormat = function(css) {
        var checker = new CssChecker(css)
        checker.prepare();
        return checker.doFormat()
    }
})

define('ckstyle/run-ckservice', function(require, exports, module) {

    var service = require('./ckservice');

    var serverRoot;

    var container, content, loading, content, trigger, close, counter, errormsg, ckcssNode

    var TMPLS = {
        container: [
'<div class="ckstyle-container">',
'    <span class="ckstyle-close">&times;</span>',
'    <h3 class="ckstyle-header">CKStyle Service [',
'        <a href="http://ckstyle.github.io" target="_blank">Home</a> | ',
'        <a href="https://github.com/wangjeaf/ckstyle-node" target="_blank">Github</a> | ',
'        <a href="https://www.npmjs.org/package/ckstyle" target="_blank">NpmJS</a>]',
'        <span class="ckstyle-loading">Loading & Parsing <span class="ckstyle-file-count"></span> CSS files, please wait...</span>',
'        <span class="ckstyle-errormsg"></span>',
'    </h3>',
'    <div class="ckstyle-content"></div>',
'</div>',
'<div class="ckstyle-trigger">CKService</div>'
].join(''),

        data: [
'<table border=1 class="ckstyle-result-table">',
'    <thead>',
'        <tr class="header">',
'            <th width="40%">URL</th>',
'            <th>Chars Before</th>',
'            <th>Chars After</th>',
'            <th>Delta Chars</th>',
'            <th>Delta Bytes</th>',
'            <th>Delta %</th>',
'            <th>Saved/1wPVs</th>',
'            <th>Operations</th>',
'        </tr>',
'    </thead>',
'    <tbody>',
'        {{#cssfiles}}',
'        <tr>',
'            <td> <a target="_blank" title="{{url}}" href="{{url}}">{{urlDisplay}}</a> </td>',
'            <td class="before before-{{id}}">-</td>',
'            <td class="after after-{{id}}">-</td>',
'            <td class="delta delta-{{id}}">-</td>',
'            <td class="delta-byte delta-byte-{{id}}">-</td>',
'            <td class="percent percent-{{id}}">-</td>',
'            <td class="total total-{{id}}">-</td>',
'            <td class="replacer replacer-{{id}}" data-index="{{id}}">handling...</td>',
'        <tr>',
'        <tr>',
'            <td class="code-diff code-diff-{{id}}" colspan="8"><div class="differ">Generating Diff...</div></td>',
'        <tr>',
'        {{/cssfiles}}',
'        <tr class="total">',
'            <td> TOTAL </td>',
'            <td class="before before-total">-</td>',
'            <td class="after after-total">-</td>',
'            <td class="delta delta-total">-</td>',
'            <td class="delta-byte delta-byte-total">-</td>',
'            <td class="percent percent-total">-</td>',
'            <td class="total total-total">-</td>',
'            <td class="replacer replacer-total"></td>',
'        <tr>',
'    </tbody>',
'</table>'
].join(''),

        replacer: '<a href="javascript:;" class="status-a ok">Replace</a> | <a href="javascript:;" class="code-diff-trigger">Diff</a> | <a href="javascript:;" class="disable-trigger">Disable</a>',
        replaceAll: ''
    }

    var CSS = [
'.ckstyle-container {text-align: left; color: #333; width:100%;background-color:rgba(255,255,255,.8);position:fixed;top:0;right:0;z-index:2147483647;border-bottom:1px solid #DDD;box-shadow: 1px 1px 12px #AAA;;}',
'.ckstyle-container .ckstyle-close {color: #666; float:right;margin-right:10px;font-size:20px;margin-top:3px;cursor:pointer;}',
'.ckstyle-container .ckstyle-header {padding:5px;margin:0;font-size:16px;line-height:22px;border-bottom:1px solid #DDD;}',
'.ckstyle-container .ckstyle-loading, .ckstyle-container .ckstyle-errormsg {display: none; padding:5px;margin:0; font-weight: normal; margin-left: 100px;}',
'.ckstyle-container .ckstyle-content {padding:5px;display:none;}',
'.ckstyle-trigger {border:1px solid #DDD; border-right: none; border-top: none; color: #666; box-shadow:1px 1px 2px #666;display:none;top:0;right:0;position:fixed;z-index:2147483647;background-color:#EEE;padding:5px;cursor:pointer;}',
'.ckstyle-result-table {border-color: #AAA; width: 100%; text-align:left;font-size:14px; border-spacing: 0;border-collapse:collapse;}',
'.ckstyle-result-table th, .ckstyle-result-table td {padding: 5px; font-size: 12px !important;}',
'.ckstyle-result-table .header td, .ckstyle-result-table .total td {font-weight: bold}',
'.ckstyle-container .differ {background-color: #FFF;margin: 0; white-space: pre-wrap; word-wrap: break-word; max-width: ' + ($(window).width() - 20) + 'px; overflow: auto; max-height: ' + ($(window).height() / 3 * 2) + 'px;}',
'.ckstyle-container .code-diff {display: none;}',
'.ckstyle-container ins {background-color: #E0F2BE; color: #500;}',
'.ckstyle-container del {background-color: #FFCACA; color: #374E0C;}',
'table.diff {width: 99%; border-collapse:collapse; border:1px solid darkgray; white-space:pre-wrap }',
'table.diff tbody {font-family:Courier, monospace }',
'table.diff tbody th {font-family:verdana,arial,"Bitstream Vera Sans",helvetica,sans-serif; background:#EED; font-size:11px; font-weight:normal; border:1px solid #BBC; color:#886; padding:.3em .5em .1em 0; text-align:right; vertical-align:top }',
'table.diff thead {border-bottom:1px solid #BBC; background:#EFEFEF; font-family:Verdana }',
'table.diff thead th.texttitle {text-align:left }',
'table.diff tbody td {padding:0px .4em; padding-top:.4em; max-width: ' + ($(window).width() / 2 - 120) + 'px; vertical-align:top; }',
'table.diff .empty {background-color:#DDD; }',
'table.diff .replace {background-color:#FD8 }',
'table.diff .delete {background-color:#E99; }',
'table.diff .skip {background-color:#EFEFEF; border:1px solid #AAA; border-right:1px solid #BBC; }',
'table.diff .insert {background-color:#9E9 }',
'table.diff th.author {text-align:right; border-top:1px solid #BBC; background:#EFEFEF }'
    ].join('');

    
    var BASE = 2 * 10000 / 1024 / 1024;

    function getSavedTotalGB(delta) {
        return (delta * BASE).toFixed(4);
    }

    function getBytes(delta) {
        return (delta * 2 / 1024).toFixed(2);
    }

    function getUrl(src) {
        var a = document.createElement('a');
        a.href = src;
        return a.href;
    }

    function getHostname(src) {
        var a = document.createElement('a');
        a.href = src;
        return a.hostname;
    }

    function getOrigin(src) {
        var a = document.createElement('a');
        a.href = src;
        return a.origin;
    }

    function cut(url) {
        if (url.length > 70) {
            url = url.substring(0, 70) + '...';
        }
        return url;
    }

    function appendCss(cssText, target) {
        var style, node;
        if (/MSIE/.test(navigator.userAgent)) {
            style = doc.createStyleSheet();
            style.cssText = cssText;
            return style;
        } else {
            var style = $('<style>').attr('type', 'text/css').append(document.createTextNode(cssText)).attr('ck-append-node', 1);
            if (target) {
                style.insertAfter(target);
            } else {
                style.appendTo('head');
            }
            return style;
        }
    }

    function buildCssFileTable(array) {
        array.forEach(function(ele) {
            ele.urlDisplay = cut(ele.url)
        })
        content.html(Mustache.to_html(TMPLS.data, {
            cssfiles: array
        })).show();
    }

    var guid = 0;

    function getTargetCSSFiles() {
        var links = [];
        $('link').each(function(i, link) {
            if ($(link).attr('rel') != 'stylesheet') {
                return;
            }
            var url = $(link).attr('href');
            if (!url) {
                return;
            }
            if (getUrl(url).indexOf('http') != 0) {
                return;
            }
            // if (getOrigin(url) != window.location.origin) {
            //     return;
            // }
            var hostname = getHostname(url)
            // handle localhost files by xhr, remote server can not fetch them.
            var local = hostname == 'localhost' || hostname == '127.0.0.1';
            if (local) {
                url = getUrl(url);
                url = url.replace(getOrigin(url), window.location.origin)
            }
            links.push({
                url: getUrl(url),
                id: guid++,
                node: link,
                local: local
            });
        });
        return links;
    }

    function bindEvents() {
        close.click(function() {
            container.hide('slow');
            trigger.show('slow');
        });
        trigger.click(function() {
            trigger.hide('slow');
            container.show('slow');
        });

        container.delegate('.replacer a.ok', 'click', function() {
            var me = $(this);
            if (me.data('handling')) {
                return;
            }
            me.data('handling', 1)
            var statusA = me.hasClass('status-a');
            me.html(statusA ? 'Recover' : 'Replace')
                .toggleClass('status-a').toggleClass('status-b');
            var index = me.parent().data('index');
            var node = cssfiles[index].node;
            $(node).attr('rel', statusA ? 'stylesheet-bak' : 'stylesheet');
            setTimeout(function() {
                me.data('handling', 0);
                if (statusA) {
                    cssfiles[index].style = appendCss(cssfiles[index].compressed, node);
                    me.parent().find('.disable-trigger').data('replaced', 0).html('Disable')
                } else {
                    $(cssfiles[index].style).remove();
                    delete cssfiles[index].style;
                }
            }, 500)
           
        }).delegate('.code-diff-trigger', 'click', function() {
            var me = $(this);
            var index = me.parent().data('index');
            var target = $('.code-diff-' + index);
            var flag = target.is(':hidden');
            $('.code-diff').hide();
            if (flag) {
                target.show();
            } else {
                target.hide();
            }
            if (!me.data('diffed')) {
                me.data('diffed', 1)
                var code = cssfiles[index].code 
                setTimeout(function() {
                    diffUsingJS(index, service.doFormat(code), service.doFix(code), 'Before(Simply Formatted)')
                }, 0)
            }
        }).delegate('.disable-trigger', 'click', function() {
            var me = $(this);
            var index = me.parent().data('index');
            var node = cssfiles[index].node;
            if (me.data('replaced')) {
                me.html('Disable')
                $(node).attr('rel', 'stylesheet');
                me.data('replaced', 0)
            } else {
                me.data('replaced', 1)
                me.html('Enable')
                $(node).attr('rel', 'stylesheet-bak');
            }
        })
    }

    function loadCss(urls) {
        content.show();
        if (urls.length == 0) {
            errormsg.show().html('No css file.');
            return loading.hide();
        }
        urls.forEach(function(url) {
            loadLink(url);
        })
    }

    var loaderCounter = 0;

    function loadLink(record) {
        var ajaxUrl = '';
        var index = record.id;
        if (record.local) {
            ajaxUrl = record.url
        } else {
            ajaxUrl = serverRoot + '/cssfile/' + encodeURIComponent(record.url)
        }
        $.ajax({
            url: ajaxUrl, 
            type: 'GET',
            data: {
                index: record.id
            }, 
            dataType: record.local ? 'text' : 'jsonp'
        }).done(function(content) {
            index = content.index || index;
            var code = typeof content.code != 'undefined' ? content.code : content;

            var before = code.length;
            var compressed = ''
            if (code) {
                compressed = service.doCompress(code);
            }
            var after = compressed.length;
            var delta = before == 0 ? 0 : (before - after);

            $('.before-' + index).html(before);
            $('.after-' + index).html(after);
            $('.delta-' + index).html(delta)
            $('.delta-byte-' + index).html(getBytes(delta) + 'KB')
            $('.percent-' + index).html(((delta / (before || 1))*100).toFixed(2) + '%')
            $('.total-' + index).html(getSavedTotalGB(delta) + ' MB')
            $('.replacer-' + index).html(TMPLS.replacer)

            record.code = code;
            record.compressed = compressed;
            record.before = before;
            record.after = after;

            loaderCounter++;

            if (loaderCounter == cssfiles.length) {
                loading.hide();
                loaderCounter = 0;
                
                countAll();
            }
        }).error(function(content) {
            $('.replacer-' + index).html(TMPLS.replacerError)
        });
    }

    function diffUsingJS(index, base, newtxt, beforeText, afterText) {
        base = difflib.stringAsLines(base)
        newtxt = difflib.stringAsLines(newtxt)
        var sm = new difflib.SequenceMatcher(base, newtxt),
            opcodes = sm.get_opcodes(),
            diffoutputdiv = $(".code-diff-" + index + ' .differ')[0];

        diffoutputdiv.innerHTML = "";

        diffoutputdiv.appendChild(diffview.buildView({
            baseTextLines: base,
            newTextLines: newtxt,
            opcodes: opcodes,
            baseTextName: beforeText || "Before(Raw)",
            newTextName: afterText || "After(Precisely Fixed)",
            contextSize: 200,
            viewType: 0
        }));

    // if (code.indexOf('\n') != -1) {
    //     diffUsingJS(index, code, service.doFix(code))
    // } else {
        //diffUsingJS(index, service.doFormat(code), service.doFix(code), 'Before(Simply Formatted)')
    // }
    }

    function countAll() {
        var before = 0,
            after = 0;
        for(var i = 0, current; i < cssfiles.length; i++) {
            current = cssfiles[i];
            before += current.before;
            after += current.after;
        }
        var delta = before - after;
        var index = 'total'
        $('.before-' + index).html(before);
        $('.after-' + index).html(after);
        $('.delta-' + index).html(delta)
        $('.delta-byte-' + index).html(getBytes(delta) + 'KB')
        $('.percent-' + index).html(((delta / before)*100).toFixed(2) + '%')
        $('.total-' + index).html(getSavedTotalGB(delta) + ' MB')
        $('.replacer-' + index).html(TMPLS.replacer)
        $('.replacer-total').html(TMPLS.replaceAll)
    }

    function initDOM() {
        ckcssNode = appendCss(CSS);

        $(TMPLS.container).appendTo('body');

        container = $('.ckstyle-container');
        loading = $('.ckstyle-loading');
        errormsg = $('.ckstyle-errormsg');
        content = $('.ckstyle-content');
        trigger = $('.ckstyle-trigger');
        close = $('.ckstyle-close');
        counter = $('.ckstyle-file-count');
    }

    window.__cssfiles = cssfiles = null;

    function handleCSSFiles() {
        window.__cssfiles = cssfiles = getTargetCSSFiles();
        //window.urls = urls;
        buildCssFileTable(cssfiles);
        counter.html(cssfiles.length);
        loading.show();
        loadCss(cssfiles);
    }

    function init(root) {
        if (root) {
            serverRoot = root;
        }
        $('.ckstyle-container').remove();
        $('.ckstyle-trigger').remove();
        $('.ckservice-loading').remove();
        $('[ck-append-node]').remove();
        $('[rel=stylesheet-bak]').attr('rel', 'stylesheet');

        initDOM();
        bindEvents();

        guid = 0;

        handleCSSFiles();
    }

    exports.go = init;
})

seajs.use('ckstyle/run-ckservice', function(runner) {
    var host = window.CK_CONFIG && window.CK_CONFIG.host || 'http://localhost:4567'
    var wrapper = '<div class="ck-detect-error-wrapper" style="z-index: 2147483647; font-size: 14px; position:fixed;left:0;top:0;right:0;bottom:0;background-color:rgba(0,0,0,.75)">\
        <div style="width: 600px; margin: 0 auto; background-color: #F2F2F2; margin-top: 140px; color: #666; text-align: left; padding: 10px;border-radius: 4px;padding-bottom: 20px; ">\
            <h2 style="font-size: 26px; margin-top: 10px; margin-bottom: 20px;">感谢您使用CKService</h2>\
            <p style="font-size: 14px; line-height: 30px;">我们检测到服务主机： <a href="' + host + '" target="_blank">' + host + '</a> 上的服务并没有启动。</p>\
            <p style="font-size: 14px; line-height: 30px;">您通过以下简单3步，即可让CKService在你的机器上运行起来。</p>\
            <ol style="list-style: none;">\
                <li style="padding: 6px;"> 1. [sudo] npm install -g ckstyle</li>\
                <li style="padding: 6px;"> 2. [sudo] npm install -g ckstyle-serve</li>\
                <li style="padding: 6px;"> 3. ckstyle serve</li>\
            </ol>\
            <p style="font-size: 14px; line-height: 30px;">您也可以指定 window.CK_CONFIG.host 属性，指定CKService服务主机</p>\
        </div>\
        <div onclick="$(this).parent().fadeOut()" style="z-index: 2147483647;position: absolute; right: 5px; top: 5px; font-size: 44px; color: #FFF; cursor: pointer;">&times;</div>\
    </div>'

    function detect(callback) {
        $.ajax({
            type: 'get',
            url: host + '/ck_detect',
            dataType: 'jsonp',
            timeout: 3000,
            success: callback,
            error: function(e) {
                $('.ckservice-loading').remove();
                $('.ck-detect-error-wrapper').remove();
                $(wrapper).appendTo('body')
            }
        })
    }

    detect(function() {
        runner.go(host);
    })
})
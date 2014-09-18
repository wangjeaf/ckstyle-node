module.exports = {
    config: {
        flags: '-c, --config [config]',
        description: '指定ckstyle的配置文件 [无]',
        defaultValue: ''
    },
    recursive: {
        flags: '-r, --recursive',
        description: '递归处理目录下所有CSS文件 [false]',
        defaultValue: false
    },
    print: {
        flags: '-p, --print',
        description: '把处理结果打印到控制台 [false]',
        defaultValue: false
    },
    include: {
        flags: '--include [include]',
        description: '包含的规则 [all]',
        defaultValue: 'all'
    },
    exclude: {
        flags: '--exclude [exclude]',
        description: '除外的规则 [none]',
        defaultValue: 'none'
    },
    error: {
        flags: '-e, --error-level [level]',
        description: '检查的异常级别 [0]',
        defaultValue: 2
    },
    ckextension: {
        flags: '--extension [extension]',
        description: '指定检查结果文件的扩展名 [.ckstyle.txt]',
        defaultValue: '.ckstyle.txt'
    },
    standard: {
        flags: '-s, --standard [standard]',
        description: '给一个标准的css文件，检查时遵照此文件来检查 [standard.css]',
        defaultValue: 'standard.css'
    },
    ignores: {
        flags: '--ignore-rulesets [rulesets]',
        description: '忽略的一些规则集 [@unit-test-expecteds]',
        defaultValue: '@unit-test-expecteds'
    },
    fixextension: {
        flags: '--extension [extension]',
        description: '修复后文件的扩展名 [.fixed.css]',
        defaultValue: '.fixed.css'
    },
    formatextension: {
        flags: '--extension [extension]',
        description: '格式化后文件的扩展名 [.fmt.css]',
        defaultValue: '.fmt.css'
    },
    singleline: {
        flags: '--single-line',
        description: '是否自动修复成单行模式（所有selector在一行） [false]',
        defaultValue: false
    },
    safe: {
        flags: '-s, --safe',
        description: '是否尝试做某些“本工具不能完全保证正确”的修复，true为不尝试，false为尝试 [false]',
        defaultValue: false
    },
    minextension: {
        flags: '--extension [extension]',
        description: '压缩后的文件扩展名 [.min.css]',
        defaultValue: '.min.css'
    },
    combine: {
        flags: '--combine [filename]',
        description: '压缩多个文件合并成一个的文件名 [all.min.css]',
        defaultValue: 'all.min.css'
    },
    browsers: {
        flags: '--browsers [browsers]',
        description: '针对不同浏览器生成不同的压缩后文件，使用时如果多个浏览器，用逗号分隔 [无]',
        defaultValue: ''
    },
    tabs: {
        flags: '--tabs [tabs]',
        description: '一个tab占用的空格个数配置 [4]',
        defaultValue: 4
    },
    nobak: {
        flags: '--nobak',
        description: '修复和压缩时，内容直接替换，不备份源文件 [false]',
        defaultValue: false
    },
    port: {
        flags: "-p, --port [port]",
        description: '启动服务的端口号 [4567]',
        defaultValue: 4567
    },
    json: {
        flags: '--json',
        description: '用JSON格式导出检查结果 [false]',
        defaultValue: false
    }
}
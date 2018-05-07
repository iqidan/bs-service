
(function(definition){
    "use strict";
    // Montage Require
    if (typeof bootstrap === "function") {
        bootstrap("promise", definition);

    // CommonJS
    } else if (typeof exports === "object" && typeof module === "object") {
        module.exports = definition();

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

    // SES (Secure EcmaScript)
    } else if (typeof ses !== "undefined") {
        if (!ses.ok()) {
            return;
        } else {
            ses.makeQ = definition;
        }

    // <script>
    } else if (typeof window !== "undefined" || typeof self !== "undefined") {
        // Prefer window over self for add-on scripts. Use self for
        // non-windowed contexts.
        var global = typeof window !== "undefined" ? window : self;
        // Get the `window` object, save the previous BSService global
        // and initialize BSService as a global.
        global.BSService = definition();
    } else {
        throw new Error("This environment was not anticipated by bs-service!");
    }
})(function(){
    var BSService = {};
    /**
    * [dateStartEnd 获取当天、本周、当本月的起始和结束时间(返回秒数)(适配前端dateStartEnd的服务)]
    */
    function dateStartEnd(date){
        date = date||new Date();
        if(typeof date!=='object') {
            date = new Date(date);
        }
        var year = date.getFullYear();
        var month = date.getMonth()+1<10?'0'+(date.getMonth()+1):date.getMonth()+1;
        var week = date.getDay()==0?7:date.getDay();
        var day = date.getDate()<10?'0'+date.getDate():date.getDate();
        var month_end_day = new Date(year,date.getMonth()+1,0);
        var day_count = month_end_day.getDate();
        var day_start_str = year + '/' + month + '/' + day + " 00:00:00";
        var day_end_str = year + '/' + month + '/' + day + " 23:59:59";
        var year_start_str = year + '/' + '01' + '/' + '01' + " 00:00:00";
        //当天
        var day_start = Number(new Date(day_start_str).getTime()/1000);
        var day_end = Number(new Date(day_end_str).getTime()/1000);
        //本周
        var week_start = day_start-(week - 1) * 86400;
        var week_end = day_end+(7-week) * 86400;

        //本月
        var month_start = day_start-(date.getDate() - 1) * 86400;
        var month_end = day_end+(day_count-date.getDate()) * 86400;
        var year_start = Number(new Date(year_start_str).getTime()/1000);
        
        return {
            day_start:day_start,
            day_end:day_end,
            week_start:week_start, //本周起始时间
            week_end:week_end,  //本周结束时间
            month_start:month_start,  //本月开始日期
            month_end:month_end, //本月结束时间
            year_start:year_start
        }
    };
    BSService.dateStartEnd = dateStartEnd;

    /**
    * 格式化时间方法 适配前端timeStamp2String服务
    * @param {number|date} time 时间戳，0代表当前时间, 其他时间请传入date类型对象
    * @param {string} type 输出类型,支持日期和时间：datetime格式化为2015-05-01 12:12:12; date格式化为2015-05-01
    * @return {string} 返回时间字符串
    */
    function timeStamp2String(time, type) {
        var datetime = new Date();
        if (0 !== time) {
            datetime = time;
        }
        if (typeof time === 'string') {
            //替换日期中的-为/
            time = time.replace(/-/g, '/');
            datetime = new Date(time);
        }
        if (typeof time === 'number' && 0 !== time) {
            datetime = new Date(time);

        }

        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
        var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
        var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
        var day = datetime.getDay();
        //返回周几 周日为0
        if (type === 'datetime') {
            return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
        }
        //年月日时分秒 年以2位 
        if (type === 'datetime2') {
            return year.toString().substr(2, 2) + "" + month + "" + date + "" + hour + "" + minute + "" + second;
        }
        if (type === 'date') {
            return year + "-" + month + "-" + date;
        }
        if (type === 'date2') {
            return year +  month  + date;
        }
        if (type === 'time') {
            return (hour + ":" + minute + ' ') + ((hour <= 12) ? 'AM' : 'PM');
        }
        if (type === 'time_2') {
            return (hour + ":" + minute + ' ');
        }
        if (type === 'day') {
            return day == 0 ? 7 : day;
        }
        if (type === 'month') {
            return month;
        }
        if (type === 'year') {
            return year;
        }
        if (type === 'month-day') {
            return month + "-" + date;
        }
        if (type === 'birthday') {
            return year + month + date;
        }
    };
    BSService.timeStamp2String = timeStamp2String;

    /**
     * [isString 是否是字符串]
     * @param  {[type]}  str [description]
     * @return {Boolean}     [description]
     */
    function isString(str){
        return (typeof str == 'string');
    }
    BSService.isString = isString;

    /**
     * [isRightString 是否是非空字符串]
     * @param  {[type]}  str [description]
     * @return {Boolean}     [description]
     */
    function isRightString(str){
        return isString(str) && (str.length > 0);
    }
    BSService.isRightString = isRightString;

    /**
     * [isArray 是否是数据]
     * @param  {Array}  arr [?]
     * @return {Boolean}     [description]
     */
    function isArray(arr){
        return (arr instanceof Array);
    }
    BSService.isArray = isArray;

    /**
     * [isRightArray 是否是非空数组]
     * @param  {[type]}  arr [description]
     * @return {Boolean}     [description]
     */
    function isRightArray(arr){
        return isArray(arr) && arr.length > 0;
    }
    BSService.isRightArray = isRightArray;

    /**
     * [isUndefined 是不是undefined]
     * @param  {[type]}  obj [description]
     * @return {Boolean}     [description]
     */
    function isUndefined(obj){
        return (obj === undefined);
    }
    BSService.isUndefined = isUndefined;

    /**
     * [isNull 是不是null]
     * @param  {[type]}  obj [description]
     * @return {Boolean}     [description]
     */
    function isNull(obj){
        return (obj === null);
    }
    BSService.isNull = isNull;

    /**
     * [isUndefinedOrNull 是不是undefined或者null]
     * @param  {[type]}  obj [description]
     * @return {Boolean}     [description]
     */
    function isUndefinedOrNull(obj){
        return (obj == null);
    }
    BSService.isUndefinedOrNull = isUndefinedOrNull;
    
    /**
     * [each 遍历对象]
     * @param  {要遍历的对象}   obj [description]
     * @param  {Function} cb  [回调函数function(下标,值,该对象){},当返回false的时候，停止遍历]
     * @return {}       [description]
     */
    function each(obj, cb){
        if(obj == null || typeof cb !== "function"){
            return "each param is error";//参数有误
        }

        if(obj instanceof Array){//是数据？
            var length = obj.length;
            for(var i = 0; i < length; ++i){
                //先屏蔽绑定当前元素
                // if(cb.call(obj[i],i, obj[i], obj) === false){
                //     break;
                // }
                if(cb(i, obj[i], obj) === false){
                    break;
                }
            }
        }else{//普通对象
            for(var k in obj){
                // if(cb.call(obj[i],k, obj[k], obj) === false){
                //     break;
                // }
                if(cb(k, obj[k], obj) === false){
                    break;
                }
            }
        }
            
        return obj;
    }
    BSService.each = each;


    /**
     * [setNullOrUndefinedAllDefault 将对象中的null或undefined空值(包括字符串)置为def]
     * @param  {anyone}  arr [要判断的参数]
     * @return {Boolean}     [true:是正确的Array]
     */
    function setNullOrUndefinedAllDefault(obj, def){
        if(obj instanceof Array){//是数组?
            obj.forEach(function(data, index){//遍历数组
                for(var key in data){
                    if(data[key] == null || data[key] === "null" || data[key] === "undefined"){//属性值为空或null字符?
                        data[key] = def;
                    }
                }
            });

            return obj;
        }else if(typeof obj == "object"){//是普通对象
            for(var key in obj){
                if(obj[key] == null || obj[key] === "null" || data[key] === "undefined"){//属性值为空?
                    obj[key] = def;
                }
            }
        }
        
        return obj;
    };
    BSService.setNullOrUndefinedAllDefault = setNullOrUndefinedAllDefault;

    function md5 (string, key, raw) {
        /*
        * Add integers, wrapping at 2^32. This uses 16-bit operations internally
        * to work around bugs in some JS interpreters.
        */
        function safeAdd (x, y) {
          var lsw = (x & 0xFFFF) + (y & 0xFFFF)
          var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
          return (msw << 16) | (lsw & 0xFFFF)
        }

        /*
        * Bitwise rotate a 32-bit number to the left.
        */
        function bitRotateLeft (num, cnt) {
          return (num << cnt) | (num >>> (32 - cnt))
        }

        /*
        * These functions implement the four basic operations the algorithm uses.
        */
        function md5cmn (q, a, b, x, s, t) {
          return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
        }
        function md5ff (a, b, c, d, x, s, t) {
          return md5cmn((b & c) | ((~b) & d), a, b, x, s, t)
        }
        function md5gg (a, b, c, d, x, s, t) {
          return md5cmn((b & d) | (c & (~d)), a, b, x, s, t)
        }
        function md5hh (a, b, c, d, x, s, t) {
          return md5cmn(b ^ c ^ d, a, b, x, s, t)
        }
        function md5ii (a, b, c, d, x, s, t) {
          return md5cmn(c ^ (b | (~d)), a, b, x, s, t)
        }

        /*
        * Calculate the MD5 of an array of little-endian words, and a bit length.
        */
        function binlMD5 (x, len) {
          /* append padding */
          x[len >> 5] |= 0x80 << (len % 32)
          x[(((len + 64) >>> 9) << 4) + 14] = len

          var i
          var olda
          var oldb
          var oldc
          var oldd
          var a = 1732584193
          var b = -271733879
          var c = -1732584194
          var d = 271733878

          for (i = 0; i < x.length; i += 16) {
            olda = a
            oldb = b
            oldc = c
            oldd = d

            a = md5ff(a, b, c, d, x[i], 7, -680876936)
            d = md5ff(d, a, b, c, x[i + 1], 12, -389564586)
            c = md5ff(c, d, a, b, x[i + 2], 17, 606105819)
            b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
            a = md5ff(a, b, c, d, x[i + 4], 7, -176418897)
            d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
            c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
            b = md5ff(b, c, d, a, x[i + 7], 22, -45705983)
            a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
            d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
            c = md5ff(c, d, a, b, x[i + 10], 17, -42063)
            b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
            a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
            d = md5ff(d, a, b, c, x[i + 13], 12, -40341101)
            c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
            b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329)

            a = md5gg(a, b, c, d, x[i + 1], 5, -165796510)
            d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
            c = md5gg(c, d, a, b, x[i + 11], 14, 643717713)
            b = md5gg(b, c, d, a, x[i], 20, -373897302)
            a = md5gg(a, b, c, d, x[i + 5], 5, -701558691)
            d = md5gg(d, a, b, c, x[i + 10], 9, 38016083)
            c = md5gg(c, d, a, b, x[i + 15], 14, -660478335)
            b = md5gg(b, c, d, a, x[i + 4], 20, -405537848)
            a = md5gg(a, b, c, d, x[i + 9], 5, 568446438)
            d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
            c = md5gg(c, d, a, b, x[i + 3], 14, -187363961)
            b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
            a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
            d = md5gg(d, a, b, c, x[i + 2], 9, -51403784)
            c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
            b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734)

            a = md5hh(a, b, c, d, x[i + 5], 4, -378558)
            d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
            c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
            b = md5hh(b, c, d, a, x[i + 14], 23, -35309556)
            a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
            d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
            c = md5hh(c, d, a, b, x[i + 7], 16, -155497632)
            b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
            a = md5hh(a, b, c, d, x[i + 13], 4, 681279174)
            d = md5hh(d, a, b, c, x[i], 11, -358537222)
            c = md5hh(c, d, a, b, x[i + 3], 16, -722521979)
            b = md5hh(b, c, d, a, x[i + 6], 23, 76029189)
            a = md5hh(a, b, c, d, x[i + 9], 4, -640364487)
            d = md5hh(d, a, b, c, x[i + 12], 11, -421815835)
            c = md5hh(c, d, a, b, x[i + 15], 16, 530742520)
            b = md5hh(b, c, d, a, x[i + 2], 23, -995338651)

            a = md5ii(a, b, c, d, x[i], 6, -198630844)
            d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
            c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
            b = md5ii(b, c, d, a, x[i + 5], 21, -57434055)
            a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
            d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
            c = md5ii(c, d, a, b, x[i + 10], 15, -1051523)
            b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
            a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
            d = md5ii(d, a, b, c, x[i + 15], 10, -30611744)
            c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
            b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
            a = md5ii(a, b, c, d, x[i + 4], 6, -145523070)
            d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
            c = md5ii(c, d, a, b, x[i + 2], 15, 718787259)
            b = md5ii(b, c, d, a, x[i + 9], 21, -343485551)

            a = safeAdd(a, olda)
            b = safeAdd(b, oldb)
            c = safeAdd(c, oldc)
            d = safeAdd(d, oldd)
          }
          return [a, b, c, d]
        }

        /*
        * Convert an array of little-endian words to a string
        */
        function binl2rstr (input) {
          var i
          var output = ''
          var length32 = input.length * 32
          for (i = 0; i < length32; i += 8) {
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF)
          }
          return output
        }

        /*
        * Convert a raw string to an array of little-endian words
        * Characters >255 have their high-byte silently ignored.
        */
        function rstr2binl (input) {
          var i
          var output = []
          output[(input.length >> 2) - 1] = undefined
          for (i = 0; i < output.length; i += 1) {
            output[i] = 0
          }
          var length8 = input.length * 8
          for (i = 0; i < length8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32)
          }
          return output
        }

        /*
        * Calculate the MD5 of a raw string
        */
        function rstrMD5 (s) {
          return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
        }

        /*
        * Calculate the HMAC-MD5, of a key and some data (raw strings)
        */
        function rstrHMACMD5 (key, data) {
          var i
          var bkey = rstr2binl(key)
          var ipad = []
          var opad = []
          var hash
          ipad[15] = opad[15] = undefined
          if (bkey.length > 16) {
            bkey = binlMD5(bkey, key.length * 8)
          }
          for (i = 0; i < 16; i += 1) {
            ipad[i] = bkey[i] ^ 0x36363636
            opad[i] = bkey[i] ^ 0x5C5C5C5C
          }
          hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
          return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
        }

        /*
        * Convert a raw string to a hex string
        */
        function rstr2hex (input) {
          var hexTab = '0123456789abcdef'
          var output = ''
          var x
          var i
          for (i = 0; i < input.length; i += 1) {
            x = input.charCodeAt(i)
            output += hexTab.charAt((x >>> 4) & 0x0F) +
            hexTab.charAt(x & 0x0F)
          }
          return output
        }

        /*
        * Encode a string as utf-8
        */
        function str2rstrUTF8 (input) {
          return unescape(encodeURIComponent(input))
        }

        /*
        * Take string arguments and return either raw or hex encoded strings
        */
        function rawMD5 (s) {
          return rstrMD5(str2rstrUTF8(s))
        }
        function hexMD5 (s) {
          return rstr2hex(rawMD5(s))
        }
        function rawHMACMD5 (k, d) {
          return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
        }
        function hexHMACMD5 (k, d) {
          return rstr2hex(rawHMACMD5(k, d))
        }
        if (!key) {
          if (!raw) {
            return hexMD5(string)
          }
          return rawMD5(string)
        }
        if (!raw) {
          return hexHMACMD5(key, string)
        }
        return rawHMACMD5(key, string)
    }
    BSService.md5 = md5;
    
    return BSService;
});
    
/**
 * 문자열 공통 기능을 지원하는 스크립트이다.
 *
 * =============================================================================
 * Name                Description
 * -----------------------------------------------------------------------------
 * bytes               문자열의 바이트 배열길이를 반환한다.
 * ellipsis            문자열의 일정한 길이만큼만 반환한다.
 * quota               문자열의 전역의 인용부호를 치환한다.
 * meta                문자열의 정규식 특수문자를 치환한다.
 * trim                문자열의 측면의 특정문자를 제거한다.
 * btrim               문자열의 양측의 특정문자를 제거한다.
 * ltrim               문자열의 좌측의 특정문자를 제거한다.
 * rtrim               문자열의 우측의 특정문자를 제거한다.
 * strip               문자열의 전역의 특정문자를 제거한다.
 * pad                 문자열의 측면에 특정문자를 덧붙인다.
 * lpad                문자열의 좌측에 특정문자를 덧붙인다.
 * rpad                문자열의 우측에 특정문자를 덧붙인다.
 * isEmpty             문자열이 널 문자열인지 확인한다.
 * isBlank             문자열이 빈 문자열인지 확인한다.
 * isBytes             문자열의 바이트 배열길이를 확인한다.
 * isLength            문자열의 캐릭터 배열길이를 확인한다.
 * isNumeric           문자열이 숫자인지 확인한다.
 * isInteger           문자열이 정수인지 확인한다.
 * isDecimal           문자열이 실수인지 확인한다.
 * isDate              문자열이 날짜인지 확인한다.
 * isTime              문자열이 시간인지 확인한다.
 * isPhone             문자열이 유선전화번호인지 확인한다.
 * isMobile            문자열이 무선전화번호인지 확인한다.
 * isEmail             문자열이 전자우편주소인지 확인한다.
 * isPostcode          문자열이 배달우편번호인지 확인한다.
 * isResRegNo          문자열이 주민등록번호인지 확인한다.
 * isCorRegNo          문자열이 법인등록번호인지 확인한다.
 * isForRegNo          문자열이 외국인등록번호인지 확인한다.
 * isBizRegNo          문자열이 사업자등록번호인지 확인한다.
 * isAlpha             문자열이 영어인지 확인한다.
 * isKorean            문자열이 한글인지 확인한다.
 * isAlphaNumeric      문자열이 영어와 숫자인지 확인한다.
 * isKoreanNumeric     문자열이 한글과 숫자인지 확인한다.
 * isImage             문자열이 이미지 파일인지 확인한다.
 * isUpload            문자열이 업로드 파일인지 확인한다.
 * isIp                문자열이 아이피인지 확인한다.
 * isMac               문자열이 맥주소인지 확인한다.
 * toNumeric           문자열을 숫자로 변환한다.
 * toInteger           문자열을 정수로 변환한다.
 * toDecimal           문자열을 실수로 변환한다.
 * toCurrency          문자열을 통화로 변환한다.
 * toDate              문자열을 날짜로 변환한다.
 * toTime              문자열을 시간으로 변환한다.
 * toPhone             문자열을 유선전화번호로 변환한다.
 * toMobile            문자열을 무선전화번호로 변환한다.
 * toPostcode          문자열을 배달우편번호로 변환한다.
 * toResRegNo          문자열을 주민등록번호로 변환한다.
 * toCorRegNo          문자열을 법인등록번호로 변환한다.
 * toForRegNo          문자열을 외국인등록번호로 변환한다.
 * toBizRegNo          문자열을 사업자등록번호로 변환한다.
 * toMac               문자열을 맥주소로 변환한다.
 * toCommaWon		   문자열을 원단위 콤마로 변환한다.
 * toByte			   숫자를 KB, MB 단위로 변환한다.
 * =============================================================================

////////////////////////////////////////////////////////////////////////////////
// 날짜
////////////////////////////////////////////////////////////////////////////////
/**
 * 마지막 일자를 반환한다.
 *
 * Usage: com.util.str.lastDate(date)
 * 
 * @param d {Date} 날짜
 * @returns {Number} 마지막 일자
 */
com.util.str.lastDate = function(d) {
    var date = d ? d : new Date();
    
    var month = date.getMonth() + 1;
   
    switch (month) {
        case 2:
            var year = date.getFullYear();
            
            if (year % 4 == 0 && year % 100 != 0) {
                return 29;
            }
            
            if (year % 400 == 0) {
                return 29;
            }
            
            return 28;
        case 4:
        case 6:
        case 9:
        case 11:
            return 30;
    }
    
    return 31;
};

/**
 * 파싱한 날짜를 반환한다.
 *
 * Usage: com.util.str.parseDate(string)
 *        com.util.str.parseDate(string, parsePattern)
 *
 * Pattern:
 * =============================================================================
 * Letters          Component
 * -----------------------------------------------------------------------------
 * yyyy             Year
 * MM               Month
 * dd               Date
 * HH               Hour
 * mm               Minute
 * ss               Second
 * SSS              Milli-Second
 * =============================================================================
 * 
 * @param s {String} 문자열
 * @param p {String} 파싱패턴
 * @returns {Date} 날짜
 */
com.util.str.parseDate = function(s, p) {
    var string        = s ? s : "";
    var parsePattern  = p ? p : "yyyy-MM-dd";
    
    if (string.length != parsePattern.length) {
        return null;
    }
    
    var year        = parsePattern.indexOf("yyyy") >= 0 ? string.substr(parsePattern.indexOf("yyyy"), 4) : "";
    var month       = parsePattern.indexOf("MM")   >= 0 ? string.substr(parsePattern.indexOf("MM"),   2) : "";
    var day         = parsePattern.indexOf("dd")   >= 0 ? string.substr(parsePattern.indexOf("dd"),   2) : "";
    var hour        = parsePattern.indexOf("HH")   >= 0 ? string.substr(parsePattern.indexOf("HH"),   2) : "";
    var minute      = parsePattern.indexOf("mm")   >= 0 ? string.substr(parsePattern.indexOf("mm"),   2) : "";
    var second      = parsePattern.indexOf("ss")   >= 0 ? string.substr(parsePattern.indexOf("ss"),   2) : "";
    var millisecond = parsePattern.indexOf("SSS")  >= 0 ? string.substr(parsePattern.indexOf("SSS"),  3) : "";
    
    if (!com.util.str.isDate(year + month + day, "yyyyMMdd")) {
        return null;
    }
    
    var iYear        = com.util.str.toInteger(year);
    var iMonth       = com.util.str.toInteger(month) - 1;
    var iDay         = com.util.str.toInteger(day);
    var iHour        = !com.util.str.isBlank(hour)        ? com.util.str.toInteger(hour)        : 0;
    var iMinute      = !com.util.str.isBlank(minute)      ? com.util.str.toInteger(minute)      : 0;
    var iSecond      = !com.util.str.isBlank(second)      ? com.util.str.toInteger(second)      : 0;
    var iMillisecond = !com.util.str.isBlank(millisecond) ? com.util.str.toInteger(millisecond) : 0;
    
    return new Date(iYear, iMonth, iDay, iHour, iMinute, iSecond, iMillisecond);
};

/**
 * 포맷한 날짜를 반환한다.
 *
 * Usage: com.util.str.formatDate(date)
 *        com.util.str.formatDate(date, pattern)
 *
 * Pattern:
 * =============================================================================
 * Letters          Component
 * -----------------------------------------------------------------------------
 * yyyy             Year
 * MM               Month
 * dd               Date
 * HH               Hour
 * mm               Minute
 * ss               Second
 * SSS              Milli-Second
 * =============================================================================
 * 
 * @param d {Date} 날짜
 * @param p {String} 패턴
 * @returns {String} 날짜
 */
com.util.str.formatDate = function(d, p) {
    var date    = d ? d : new Date();
    var pattern = p ? p : "yyyy-MM-dd";
    
    return pattern.replace(new RegExp("(yyyy|MM|dd|HH|mm|ss|SSS)", "g"), function($1) {
        switch ($1) {
            case "yyyy":
                var year = date.getFullYear();
                
                return com.util.str.lpad(year.toString(), 4);
            case "MM":
                var month = date.getMonth() + 1;
                
                return com.util.str.lpad(month.toString(), 2);
            case "dd":
                var day = date.getDate();
                
                return com.util.str.lpad(day.toString(), 2);
            case "HH":
                var hour = date.getHours();
                
                return com.util.str.lpad(hour.toString(), 2);
            case "mm":
                var minute = date.getMinutes();
                
                return com.util.str.lpad(minute.toString(), 2);
            case "ss":
                var second = date.getSeconds();
                
                return com.util.str.lpad(second.toString(), 2);
            case "SSS":
                var millisecond = date.getMilliseconds();
                
                return com.util.str.lpad(millisecond.toString(), 3);
        }
    });
};

////////////////////////////////////////////////////////////////////////////////
// 문자열
////////////////////////////////////////////////////////////////////////////////
/**
 * 문자열의 바이트 배열길이를 반환한다.
 *
 * Usage: com.util.str.bytes(string)
 * 
 * @param s {String} 문자열
 * @returns {Number} 길이
 */
com.util.str.bytes = function(s) {
    var string = s ? s : "";
    
    return string.length + (escape(string) + "%u").match(new RegExp("%u", "g")).length - 1;
};

/**
 * UTF-8 문자열의 바이트 배열길이를 반환한다.
 *
 * Usage: com.util.str.bytes(string)
 * 
 * @param s {String} 문자열
 * @returns {Number} 길이
 */
com.util.str.bytesUtf8 = function(s) {
    var string = s ? s : "";
    
    return string.length + ((escape(string) + "%u").match(new RegExp("%u", "g")).length * 2)- 2;
};

/**
 * 문자열의 일정한 길이만큼만 반환한다.
 *
 * Usage: com.util.str.ellipsis(string, length)
 *        com.util.str.ellipsis(string, length, mark)
 * 
 * @param s {String} 문자열
 * @param l {Number} 길이
 * @param m {String} 생략 부호
 * @returns {String} 문자열
 */
com.util.str.ellipsis = function(s, l, m) {
    var string = s ? s : "";
    var length = l ? l : string.length;
    var mark   = m ? m : "...";
    
    if (string.length > length) {
        return string.substr(0, length) + mark;
    }
    
    return string;
};

/**
 * 문자열의 전역의 인용부호를 치환한다.
 *
 * Usage: com.util.str.quota(string)
 * 
 * @param s {String} 문자열
 * @returns {String} 문자열
 */
com.util.str.quota = function(s) {
    var string = s ? s : "";
    
    return string.replace(new RegExp("\"", "g"), "&#34;").replace(new RegExp("\'", "g"), "&#39;");
};

/**
 * 문자열의 정규식 특수문자를 치환한다.
 *
 * Usage: com.util.str.meta(string)
 * 
 * @param s {String} 문자열
 * @returns {String} 문자열
 */
com.util.str.meta = function(s) {
    var string = s ? s : "";
    
    var replace = "";
    
    var pattern = new RegExp("([\\$\\(\\)\\*\\+\\.\\[\\]\\?\\\\\\^\\{\\}\\|]{1})", "");
    
    for (var i = 0; i < string.length; i++) {
        if (pattern.test(string.charAt(i))) {
            replace += string.charAt(i).replace(pattern, "\\$1");
        }
        else {
            replace += string.charAt(i);
        }
    }
    
    return replace;
};

/**
 * 문자열의 측면의 특정문자를 제거한다.
 *
 * Usage: com.util.str.trim(string)
 *        com.util.str.trim(string, character)
 *        com.util.str.trim(string, character, "both|left|right")
 * 
 * @param s {String} 문자열
 * @param c {String} 문자
 * @param d {String} 방향
 * @returns {String} 문자열
 */
com.util.str.trim = function(s, c, d) {
    var string    = s ? s : "";
    var character = c ? c : "\\s";
    var direction = d ? d : "both";
    
    switch (direction) {
        case "both":
            return com.util.str.btrim(string, character);
        case "left":
            return com.util.str.ltrim(string, character);
        case "right":
            return com.util.str.rtrim(string, character);
    }
    
    return string;
};

/**
 * 문자열의 양측의 특정문자를 제거한다.
 *
 * Usage: com.util.str.btrim(string)
 *        com.util.str.btrim(string, character)
 * 
 * @param s {String} 문자열
 * @param c {String} 문자
 * @returns {String} 문자열
 */
com.util.str.btrim = function(s, c) {
    var string    = s ? s : "";
    var character = c ? c : "\\s";
    
    character = character == "\\s" ? character : com.util.str.meta(character);
    
    return string.replace(new RegExp("(^" +character + "*)|(" + character + "*$)", "g"), "");
};

/**
 * 문자열의 좌측의 특정문자를 제거한다.
 *
 * Usage: com.util.str.ltrim(string)
 *        com.util.str.ltrim(string, character)
 * 
 * @param s {String} 문자열
 * @param c {String} 문자
 * @returns {String} 문자열
 */
com.util.str.ltrim = function(s, c) {
    var string    = s ? s : "";
    var character = c ? c : "\\s";
    
    character = character == "\\s" ? character : com.util.str.meta(character);
    
    return string.replace(new RegExp("(^" + character + "*)", "g"), "");
};

/**
 * 문자열의 우측의 특정문자를 제거한다.
 *
 * Usage: com.util.str.rtrim(string)
 *        com.util.str.rtrim(string, character)
 * 
 * @param s {String} 문자열
 * @param c {String} 문자
 * @returns {String} 문자열
 */
com.util.str.rtrim = function(s, c) {
    var string    = s ? s : "";
    var character = c ? c : "\\s";
    
    character = character == "\\s" ? character : com.util.str.meta(character);
    
    return string.replace(new RegExp("(" + character + "*$)", "g"), "");
};

/**
 * 문자열의 전역의 특정문자를 제거한다.
 *
 * Usage: com.util.str.strip(string)
 *        com.util.str.strip(string, character)
 * 
 * @param s {String} 문자열
 * @param c {String} 문자
 * @returns {String} 문자열
 */
com.util.str.strip = function(s, c) {
    var string    = s ? s : "";
    var character = c ? c : "\\s";
    
    character = character == "\\s" ? character : com.util.str.meta(character);
    
    return string.replace(new RegExp("[" + character + "]", "g"), "");
};

/**
 * 문자열의 측면에 특정문자를 덧붙인다.
 *
 * Usage: com.util.str.pad(string, length)
 *        com.util.str.pad(string, length, character)
 *        com.util.str.pad(string, length, character, "left|right")
 * 
 * @param s {String} 문자열
 * @param l {Number} 길이
 * @param c {String} 문자
 * @param d {String} 방향
 * @returns {String} 문자열
 */
com.util.str.pad = function(s, l, c, d) {
    var string    = s ? s : "";
    var length    = l ? l : 0;
    var character = c ? c : "0";
    var direction = d ? d : "left";
    
    switch (direction) {
        case "left":
            return com.util.str.lpad(string, length, character);
        case "right":
            return com.util.str.rpad(string, length, character);
    }
    
    return string;
};

/**
 * 문자열의 좌측에 특정문자를 덧붙인다.
 *
 * Usage: com.util.str.lpad(string, length)
 *        com.util.str.lpad(string, length, character)
 * 
 * @param s {String} 문자열
 * @param l {Number} 길이
 * @param c {String} 문자
 * @returns {String} 문자열
 */
com.util.str.lpad = function(s, l, c) {
    var string    = s ? s : "";
    var length    = l ? l : 0;
    var character = c ? c : "0";
    
    var padding = "";
    
    if (string.length < length) {
        for (var i = 0; i < length - string.length; i++) {
            padding += character;
        }
    }
    
    return padding + string;
};

/**
 * 문자열의 우측에 특정문자를 덧붙인다.
 *
 * Usage: com.util.str.rpad(string, length)
 *        com.util.str.rpad(string, length, character)
 * 
 * @param s {String} 문자열
 * @param l {Number} 길이
 * @param c {String} 문자
 * @returns {String} 문자열
 */
com.util.str.rpad = function(s, l, c) {
    var string    = s ? s : "";
    var length    = l ? l : 0;
    var character = c ? c : "0";
    
    var padding = "";

    if (string.length < length) {
        for (var i = 0; i < length - string.length; i++) {
            padding += character;
        }
    }
    
    return string + padding;
};

/**
 * 문자열이 널 문자열인지 확인한다.
 *
 * Usage: com.util.str.isEmpty(string)
 * 
 * @param s {String} 문자열
 * @returns {Boolean} 널 문자열 여부
 */
com.util.str.isEmpty = function(s) {
    var string = s ? s : "";
    
    return string.length == 0;
};

/**
 * 문자열이 빈 문자열인지 확인한다.
 *
 * Usage: com.util.str.isBlank(string)
 * 
 * @param s {String} 문자열
 * @returns {Boolean} 빈 문자열 여부
 */
com.util.str.isBlank = function(s) {
    var string = s ? s : "";
    
    return com.util.str.trim(string).length == 0;
};

/**
 * 문자열이 빈 값인지 확인한다.(존재하지 않는 엘리먼트인지도 확인한다.)
 *
 * Usage: isNull(string)
 * 
 * @param s {String} 문자열
 * @returns {Boolean} 빈 문자열 여부
 */
com.util.str.isNull = function(s) {
	if (s == null) return true;
	if (s == "NaN") return true;
	if (s == "null") return true;
	if (new String(s).valueOf() == "undefined") return true;    
    var chkStr = new String(s);
    if( chkStr.valueOf() == "undefined" ) return true;
    if (chkStr == null) return true;    
    if (chkStr.toString().length == 0 ) return true;   
    return false; 
}

/**
 * 문자열이 빈 값이 아닌지 확인한다.
 *
 * Usage: isNotNull(string)
 * 
 * @param s {String} 문자열
 * @returns {Boolean} 비어있지 않은 문자열 여부
 */
com.util.str.isNotNull = function(s) {
	return !(com.util.str.isNull(s));
}

/**
 * 문자열의 바이트 배열길이를 확인한다.
 *
 * Usage: com.util.str.isBytes(string, minimum)
 *        com.util.str.isBytes(string, minimum, maximum)
 * 
 * @param s {String} 문자열
 * @param n {Number} 최소값
 * @param x {Number} 최대값
 * @returns {Boolean} 길이 확인 여부
 */
com.util.str.isBytes = function(s, n, x) {
    var string  = s ? s : "";
    var minimum = n ? n : 0;
    var maximum = x ? x : 0;
    
    if (minimum > 0 && com.util.str.bytes(string) < minimum) {
        return false;
    }
    
    if (maximum > 0 && com.util.str.bytes(string) > maximum) {
        return false;
    }
    
    return true;
};

/**
 * UTF-8 문자열의 바이트 배열길이를 확인한다.
 *
 * Usage: com.util.str.isBytes(string, minimum)
 *        com.util.str.isBytes(string, minimum, maximum)
 * 
 * @param s {String} 문자열
 * @param n {Number} 최소값
 * @param x {Number} 최대값
 * @returns {Boolean} 길이 확인 여부
 */
com.util.str.isBytesUtf8 = function(s, n, x) {
    var string  = s ? s : "";
    var minimum = n ? n : 0;
    var maximum = x ? x : 0;
    
    if (minimum > 0 && com.util.str.bytesUtf8(string) < minimum) {
        return false;
    }
    
    if (maximum > 0 && com.util.str.bytesUtf8(string) > maximum) {
        return false;
    }
    
    return true;
};

/**
 * 문자열의 캐릭터 배열길이를 확인한다.
 *
 * Usage: com.util.str.isLength(string, minimum)
 *        com.util.str.isLength(string, minimum, maximum)
 * 
 * @param s {String} 문자열
 * @param n {Number} 최소값
 * @param x {Number} 최대값
 * @returns {Boolean} 길이 확인 여부
 */
com.util.str.isLength = function(s, n, x) {
    var string  = s ? s : "";
    var minimum = n ? n : 0;
    var maximum = x ? x : 0;
    
    if (minimum > 0 && string.length < minimum) {
        return false;
    }
    
    if (maximum > 0 && string.length > maximum) {
        return false;
    }
    
    return true;
};

/**
 * 문자열이 숫자인지 확인한다.
 *
 * Usage: com.util.str.isNumeric(string)
 * 
 * @param s {String} 문자열
 * @returns {Boolean} 숫자 여부
 */
com.util.str.isNumeric = function(s) {
    var string = s ? s : "";
    
    return new RegExp("^[0-9]+$", "").test(string);
};

/**
 * 문자열이 정수인지 확인한다.
 *
 * Usage: com.util.str.isInteger(string)
 * 
 * @param s {String} 문자열
 * @returns {Boolean} 정수 여부
 */
com.util.str.isInteger = function(s) {
    var string = s ? s : "";
    
    return new RegExp("^\\-?[0-9]+$", "").test(string);
};

/**
 * 문자열이 실수인지 확인한다.
 *
 * Usage: com.util.str.isDecimal(string)
 * 
 * @param s {String} 문자열
 * @returns {Boolean} 실수 여부
 */
com.util.str.isDecimal = function(s) {
    var string = s ? s : "";
    
    return new RegExp("^\\-?[0-9]*(\\.[0-9]*)?$", "").test(string);
};

/**
 * 문자열이 날짜인지 확인한다.
 *
 * Usage: com.util.str.isDate(string)
 *        com.util.str.isDate(string, pattern)
 *
 * Pattern:
 * =============================================================================
 * Letters          Component
 * -----------------------------------------------------------------------------
 * yyyy             Year
 * MM               Month
 * dd               Date
 * =============================================================================
 * 
 * @param s {String} 문자열
 * @param p {String} 패턴
 * @returns {Boolean} 날짜 여부
 */
com.util.str.isDate = function(s, p) {
    var string  = s ? s : "";
    var pattern = p ? p : "yyyy-MM-dd";
    
    if (string.length != pattern.length) {
        return false;
    }
    
    var year  = pattern.indexOf("yyyy") >= 0 ? parseInt(string.substr(pattern.indexOf("yyyy"), 4), 10) : 0;
    var month = pattern.indexOf("MM")   >= 0 ? parseInt(string.substr(pattern.indexOf("MM"),   2), 10) : 0;
    var day   = pattern.indexOf("dd")   >= 0 ? parseInt(string.substr(pattern.indexOf("dd"),   2), 10) : 0;
    
    if (year < 1) {
        return false;
    }
    if (month < 1) {
        return false;
    }
    if (month > 12) {
        return false;
    }
    if (day < 1) {
        return false;
    }
    if (day > 31) {
        return false;
    }
    
    switch (month) {
        case 2:
            if (year % 4 == 0 && year % 100 != 0) {
                return day <= 29;
            }
            
            if (year % 400 == 0) {
                return day <= 29;
            }
            
            return day <= 28;
        case 4:
        case 6:
        case 9:
        case 11:
            return day <= 30;
    }
    
    return day <= 31;
};

/**
 * 문자열이 시간인지 확인한다.
 *
 * Usage: com.util.str.isTime(string)
 *        com.util.str.isTime(string, pattern)
 *
 * Pattern:
 * =============================================================================
 * Letters          Component
 * -----------------------------------------------------------------------------
 * HH               Hour
 * mm               Minute
 * ss               Second
 * =============================================================================
 * 
 * @param s {String} 문자열
 * @param p {String} 패턴
 * @returns {Boolean} 시간 여부
 */
com.util.str.isTime = function(s, p) {
    var string  = s ? s : "";
    var pattern = p ? p : "HH:mm";
    
    if (string.length != pattern.length) {
        return false;
    }
    
    var hour   = pattern.indexOf("HH") >= 0 ? parseInt(string.substr(pattern.indexOf("HH"), 2), 10) : 0;
    var minute = pattern.indexOf("mm") >= 0 ? parseInt(string.substr(pattern.indexOf("mm"), 2), 10) : 0;
    var second = pattern.indexOf("ss") >= 0 ? parseInt(string.substr(pattern.indexOf("ss"), 2), 10) : 0;
    
    if (hour < 0) {
        return false;
    }
    if (hour > 23) {
        return false;
    }
    if (minute < 0) {
        return false;
    }
    if (minute > 59) {
        return false;
    }
    if (second < 0) {
        return false;
    }
    if (second > 59) {
        return false;
    }
    
    return true;
};

/**
 * 문자열이 유선전화번호인지 확인한다.
 *
 * Usage: com.util.str.isPhone(string)
 *        com.util.str.isPhone(string, delimiter)
 * 
 * @param s {String} 문자열
 * @param d {String} 구분자
 * @returns {Boolean} 유선전화번호 여부
 */
com.util.str.isPhone = function(s, d) {
    var string    = s ? s : "";
    var delimiter = d ? d : "";
    
    delimiter = com.util.str.meta(delimiter);
    
    return new RegExp("(02|0[3-9]{1}[0-9]{1})" + delimiter + "[1-9]{1}[0-9]{2,3}" + delimiter + "[0-9]{4}$", "").test(string);
};

/**
 * 문자열이 무선전화번호인지 확인한다.
 *
 * Usage: com.util.str.isMobile(string)
 *        com.util.str.isMobile(string, delimiter)
 * 
 * @param s {String} 문자열
 * @param d {String} 구분자
 * @returns {Boolean} 무선전화번호 여부
 */
com.util.str.isMobile = function(s, d) {
    var string    = s ? s : "";
    var delimiter = d ? d : "";
    
    delimiter = com.util.str.meta(delimiter);
    
    return new RegExp("01[016789]" + delimiter + "[1-9]{1}[0-9]{2,3}" + delimiter + "[0-9]{4}$", "").test(string);
};

/**
 * 문자열이 전자우편주소인지 확인한다.
 *
 * Usage: com.util.str.isEmail(string)
 * 
 * @param s {String} 문자열
 * @returns {Boolean} 전자우편주소 여부
 */
com.util.str.isEmail = function(s) {
    var string = s ? s : "";
    
    return new RegExp("\\w+([\\-\\+\\.]\\w+)*@\\w+([\\-\\.]\\w+)*\\.[a-zA-Z]{2,4}$", "").test(string);
};

/**
 * 문자열이 배달우편번호인지 확인한다.
 *
 * Usage: com.util.str.isPostcode(string)
 *        com.util.str.isPostcode(string, delimiter)
 * 
 * @param s {String} 문자열
 * @param d {String} 구분자
 * @returns {Boolean} 배달우편번호 여부
 */
com.util.str.isPostcode = function(s, d) {
    var string    = s ? s : "";
    var delimiter = d ? d : "-";
    
    delimiter = com.util.str.meta(delimiter);
    
    return new RegExp("^[0-9]{3}" + delimiter +"[0-9]{3}$", "").test(string);
};

/**
 * 문자열이 주민등록번호인지 확인한다.
 *
 * Usage: com.util.str.isResRegNo(string)
 *        com.util.str.isResRegNo(string, delimiter)
 * 
 * @param s {String} 문자열
 * @param d {String} 구분자
 * @returns {Boolean} 주민등록번 여부
 */
com.util.str.isResRegNo = function(s, d) {
    var string    = s ? s : "";
    var delimiter = d ? d : "-";
    
    delimiter = com.util.str.meta(delimiter);
    
    if (new RegExp("[0-9]{2}[01]{1}[0-9]{1}[0123]{1}[0-9]{1}" + delimiter + "[1234]{1}[0-9]{6}$", "").test(string)) {
        var number = com.util.str.toNumeric(string);
        
        var birthdate = number.substr(0, 6);
        
        var sex = number.charAt(6);
        
        switch (sex) {
            case "1":
            case "2":
                birthdate = "19" + birthdate;
                break;
            case "3":
            case "4":
                birthdate = "20" + birthdate;
                break;
            default:
                return false;
        }
        
        if (!com.util.str.isDate(birthdate, "yyyyMMdd")) {
            return false;
        }
        
        var checksum = 0;
        
        for (var i = 0; i < 12; i++) {
            checksum += parseInt(number.charAt(i), 10) * (i % 8 + 2);
        }
        
        return (11 - checksum % 11) % 10 == parseInt(number.charAt(12), 10);
    }
    
    return false;
};

/**
 * 문자열이 법인등록번호인지 확인한다.
 *
 * Usage: com.util.str.isCorRegNo(string)
 *        com.util.str.isCorRegNo(string, delimiter)
 * 
 * @param s {String} 문자열
 * @param d {String} 구분자
 * @returns {Boolean} 법인등록번호 여부
 */
com.util.str.isCorRegNo = function(s, d) {
    var string    = s ? s : "";
    var delimiter = d ? d : "-";
    
    delimiter = com.util.str.meta(delimiter);
    
    if (new RegExp("[0-9]{6}" + delimiter + "[0-9]{7}$", "").test(string)) {
        var number = com.util.str.toNumeric(string);
        
        var checksum = 0;
        
        for (var i = 0; i < 12; i++) {
            checksum += parseInt(number.charAt(i), 10) * (i % 2 + 1);
        }
        
        return (10 - checksum % 10) % 10 == parseInt(number.charAt(12), 10);
    }
    
    return false;
};

/**
 * 문자열이 외국인등록번호인지 확인한다.
 *
 * Usage: com.util.str.isForRegNo(string)
 *        com.util.str.isForRegNo(string, delimiter)
 * 
 * @param s {String} 문자열
 * @param d {String} 구분자
 * @returns {Boolean} 외국인등록번호 여부
 */
com.util.str.isForRegNo = function(s, d) {
    var string    = s ? s : "";
    var delimiter = d ? d : "-";
    
    delimiter = com.util.str.meta(delimiter);
    
    if (new RegExp("[0-9]{2}[01]{1}[0-9]{1}[0123]{1}[0-9]{1}" + delimiter + "[5678]{1}[0-9]{1}[02468]{1}[0-9]{2}[6789]{1}[0-9]{1}$", "").test(string)) {
        var number = com.util.str.toNumeric(string);
        
        var birthdate = number.substr(0, 6);
        
        var sex = number.charAt(6);
        
        switch (sex) {
            case "5":
            case "6":
                birthdate = "19" + birthdate;
                break;
            case "7":
            case "8":
                birthdate = "20" + birthdate;
                break;
            default:
                return false;
        }
        
        if (!com.util.str.isDate(birthdate, "yyyyMMdd")) {
            return false;
        }
        
        if (parseInt(number.substr(7, 2), 10) % 2 != 0) {
            return false;
        }
        
        var checksum = 0;
        
        for (var i = 0; i < 12; i++) {
            checksum += parseInt(number.charAt(i), 10) * (i % 8 + 2);
        }
        
        return ((11 - checksum % 11) % 10 + 2) %10 == parseInt(number.charAt(12), 10);
    }
    
    return false;
};

/**
 * 문자열이 사업자등록번호인지 확인한다.
 *
 * Usage: com.util.str.isBizRegNo(string)
 *        com.util.str.isBizRegNo(string, delimiter)
 * 
 * @param s {String} 문자열
 * @param d {String} 구분자
 * @returns {Boolean} 사업자등록번호 여부
 */
com.util.str.isBizRegNo = function(s, d) {
    var string    = s ? s : "";
    var delimiter = d ? d : "-";
    
    delimiter = com.util.str.meta(delimiter);
    
    if (new RegExp("[0-9]{3}" + delimiter + "[0-9]{2}" + delimiter + "[0-9]{5}$", "").test(string)) {
        var number = com.util.str.toNumeric(string);
        
        var checksum = parseInt(number.charAt(0), 10);
        
        for (var i = 1; i < 8; i++) {
            checksum += parseInt(number.charAt(i), 10) * ((i % 3) * (i % 3 + 1) + 1) % 10;
        }
        
        checksum += Math.floor(parseInt(number.charAt(8), 10) * 5 / 10);
        
        checksum += parseInt(number.charAt(8), 10) * 5 % 10;
        
        checksum += parseInt(number.charAt(9), 10);
        
        return checksum % 10 == 0;
    }
    
    return false;
};

/**
 * 문자열이 영어인지 확인한다.
 *
 * Usage: com.util.str.isAlpha(string)
 *        com.util.str.isAlpha(string, ignores)
 * 
 * @param s {String} 문자열
 * @param i {String} 허용된 문자
 * @returns {Boolean} 영어 여부
 */
com.util.str.isAlpha = function(s, i) {
    var string  = s ? s : "";
    var ignores = i ? i : "";
    
    return new RegExp("^[a-zA-Z]+$", "").test(com.util.str.strip(string, ignores));
};

/**
 * 문자열이 한글인지 확인한다.
 *
 * Usage: com.util.str.isKorean(string)
 *        com.util.str.isKorean(string, ignores)
 * 
 * @param s {String} 문자열
 * @param i {String} 허용된 문자
 * @returns {Boolean} 한글 여부
 */
com.util.str.isKorean = function(s, i) {
    var string  = s ? s : "";
    var ignores = i ? i : "";
    
    return new RegExp("^[ㄱ-ㅎㅏ-ㅣ가-힣]+$", "").test(com.util.str.strip(string, ignores));
};

/**
 * 문자열이 영어와 숫자인지 확인한다.
 *
 * Usage: com.util.str.isAlphaNumeric(string)
 *        com.util.str.isAlphaNumeric(string, ignores)
 * 
 * @param s {String} 문자열
 * @param i {String} 허용된 문자
 * @returns {Boolean} 영어와 숫자 여부
 */
com.util.str.isAlphaNumeric = function(s, i) {
    var string  = s ? s : "";
    var ignores = i ? i : "";
    
    return new RegExp("^[0-9a-zA-Z]+$", "").test(com.util.str.strip(string, ignores));
};

/**
 * 문자열이 한글과 숫자인지 확인한다.
 *
 * Usage: com.util.str.isKoreanNumeric(string)
 *        com.util.str.isKoreanNumeric(string, ignores)
 * 
 * @param s {String} 문자열
 * @param i {String} 허용된 문자
 * @returns {Boolean} 한글과 숫자 여부
 */
com.util.str.isKoreanNumeric = function(s, i) {
    var string  = s ? s : "";
    var ignores = i ? i : "";
    
    return new RegExp("^[0-9ㄱ-ㅎㅏ-ㅣ가-힣]+$", "").test(com.util.str.strip(string, ignores));
};

/**
 * 문자열이 한글과 영문과 숫자인지 확인한다.
 *
 * Usage: com.util.str.isKoreanAlphaNumeric(string)
 *        com.util.str.isKoreanAlphaNumeric(string, ignores)
 * 
 * @param s {String} 문자열
 * @param i {String} 허용된 문자
 * @returns {Boolean} 한글과 숫자 여부
 */
com.util.str.isKoreanAlphaNumeric = function(s, i) {
    var string  = s ? s : "";
    var ignores = i ? i : "";
    
    return new RegExp("^[0-9a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]+$", "").test(com.util.str.strip(string, ignores));
};

/**
 * 문자열이 이미지 파일인지 확인한다.
 *
 * Usage: com.util.str.isImage(string)
 *        com.util.str.isImage(string, extensions)
 * 
 * @param s {String} 문자열
 * @param e {Array} 이미지 확장자
 * @returns {Boolean} 이미지 파일 여부
 */
com.util.str.isImage = function(s, e) {
    var string     = s ? s : "";
    var extensions = e ? e : [ "jpeg", "jpg", "gif", "png", "bmp" ];
    
    var extension = "";
    
    for (var i = 0; i < extensions.length; i++) {
        if (i > 0) {
            extension += "|";
        }
        
        extension += com.util.str.meta(extensions[i]);
    }
    
    return new RegExp("\\.(" + extension + ")$", "i").test(string);
};

/**
 * 문자열이 업로드 파일인지 확인한다.
 *
 * Usage: com.util.str.isUpload(string)
 *        com.util.str.isUpload(string, extensions)
 * 
 * @param s {String} 문자열
 * @param e {Array} 제한된 확장자
 * @returns {Boolean} 업로드 파일 여부
 */
com.util.str.isUpload = function(s, e) {
    var string     = s ? s : "";
    var extensions = e ? e : [ "jsp", "php", "php3", "php5", "phtml", "asp", "aspx", "asc", "ascx", "cfm", "cfc", "pl", "bat", "exe", "dll", "reg", "cgi" ];
    
    var extension = "";
    
    for (var i = 0; i < extensions.length; i++) {
        if (i > 0) {
            extension += "|";
        }
        
        extension += com.util.str.meta(extensions[i]);
    }
    
    return !new RegExp("\\.(" + extension + ")$", "i").test(string);
};

/**
 * 문자열이 아이피인지 확인한다.
 *
 * Usage: com.util.str.isIp(string)
 * 
 * @param s {String} 문자열
 * @returns {Boolean} 아이피 여부
 */
com.util.str.isIp = function(s) {
    var string = s ? s : "";
    
    return new RegExp("\\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b", "").test(string);
};

/**
 * 문자열이 맥주소인지 확인한다.
 *
 * Usage: com.util.str.isMac(string)
 *        com.util.str.isMac(string, delimiter)
 * 
 * @param s {String} 문자열
 * @param d {String} 구분자
 * @returns {Boolean} 맥주소 여부
 */
com.util.str.isMac = function(s, d) {
    var string    = s ? s : "";
    var delimiter = d ? d : "-";
    
    delimiter = com.util.str.meta(delimiter);
    
    return new RegExp("^([0-9a-fA-F][0-9a-fA-F]" + delimiter + "){5}([0-9a-fA-F][0-9a-fA-F])$", "").test(string);
};

/**
 * 문자열을 숫자로 변환한다.
 *
 * Usage: com.util.str.toNumeric(string)
 * 
 * @param s {String} 문자열
 * @returns {String} 숫자
 */
com.util.str.toNumeric = function(s) {
    var string = s ? s : "";
    
    return string.replace(new RegExp("[^0-9]", "g"), "");
};

/**
 * 문자열을 정수로 변환한다.
 *
 * Usage: com.util.str.toInteger(string)
 *        com.util.str.toInteger(string, radix)
 * 
 * @param s {String} 문자열
 * @param r {Number} 진법
 * @return {Number} 정수
 */
com.util.str.toInteger = function(s, r) {
    var string = s ? s : "";
    var radix  = r ? r : 10;
    
    return parseInt(string.replace(new RegExp("[^\\-0-9\\.]", "g"), ""), radix);
};

/**
 * 문자열을 실수로 변환한다.
 *
 * Usage: com.util.str.toDecimal(string)
 *        com.util.str.toDecimal(string, radix)
 * 
 * @param s {String} 문자열
 * @param r {Number} 진법
 * @return {Number} 실수
 */
com.util.str.toDecimal = function(s, r) {
    var string = s ? s : "";
    var radix  = r ? r : 10;
    
    return parseFloat(string.replace(new RegExp("[^\\-0-9\\.]", "g"), ""), radix);
};

/**
 * 문자열을 통화로 변환한다.
 *
 * Usage: com.util.str.toCurrency(string)
 *        com.util.str.toCurrency(string, fixed)
 *        com.util.str.toCurrency(string, fixed, "round|floor|ceil")
 * 
 * @param s {String} 문자열
 * @param f {Number} 소수점 자리수
 * @param r {String} 반올림
 * @return {String} 통화
 */
com.util.str.toCurrency = function(s, f, r) {
    var string = s ? s : "";
    var fixed  = f ? f : 0;
    var round  = r ? r : "round";
    
    var sign = 1;
    
    var decimal = com.util.str.toDecimal(string);
    
    if (decimal < 0) {
        sign = -1;
        
        decimal = Math.abs(decimal);
    }
    
    var power = Math.pow(10, fixed);
    
    switch (round) {
        case "round":
            decimal = Math.round(decimal * power) / power * sign;
            break;
        case "floor":
            decimal = Math.floor(decimal * power) / power * sign;
            break;
        case "ceil":
            decimal = Math.ceil(decimal * power) / power * sign;
            break;
        default:
            return string;
    }
    
    var number = decimal.toString();
    
    var extra = "";
    
    var index = number.indexOf(".");
    
    if (index > 0) {
        number = number.substring(0, index);
        
        extra = number.substring(index + 1);
    }
    
    if (fixed > 0) {
        extra = "." + com.util.str.rpad(extra, "0", fixed);
    }
    
    var pattern = new RegExp("(\\-?[0-9]+)([0-9]{3})", "");
    
    while (pattern.test(number)) {
        number = number.replace(pattern, "$1,$2");
    }
    
    return number + extra;
};

/**
 * 문자열을 날짜로 변환한다.
 *
 * Usage: com.util.str.toDate(string)
 *        com.util.str.toDate(string, parsePattern)
 *        com.util.str.toDate(string, parsePattern, formatPattern)
 *
 * Pattern:
 * =============================================================================
 * Letters          Component
 * -----------------------------------------------------------------------------
 * yyyy             Year
 * MM               Month
 * dd               Date
 * =============================================================================
 * 
 * @param s {String} 문자열
 * @param p {String} 파싱패턴
 * @param f {String} 포맷패턴
 * @returns {String} 날짜
 */
com.util.str.toDate = function(s, p, f) {
    var string        = s ? s : "";
    var parsePattern  = p ? p : "yyyyMMdd";
    var formatPattern = f ? f : "yyyy-MM-dd";
    
    if (string.length != parsePattern.length) {
        return string;
    }
    
    var year  = parsePattern.indexOf("yyyy") >= 0 ? string.substr(parsePattern.indexOf("yyyy"), 4) : "";
    var month = parsePattern.indexOf("MM")   >= 0 ? string.substr(parsePattern.indexOf("MM"),   2) : "";
    var day   = parsePattern.indexOf("dd")   >= 0 ? string.substr(parsePattern.indexOf("dd"),   2) : "";
    
    return formatPattern.replace("yyyy", year).replace("MM", month).replace("dd", day);
};

/**
 * 문자열을 시간으로 변환한다.
 *
 * Usage: com.util.str.toTime(string)
 *        com.util.str.toTime(string, parsePattern)
 *        com.util.str.toTime(string, parsePattern, formatPattern)
 *
 * Pattern:
 * =============================================================================
 * Letters          Component
 * -----------------------------------------------------------------------------
 * HH               Hour
 * mm               Minute
 * ss               Second
 * =============================================================================
 * 
 * @param s {String} 문자열
 * @param p {String} 파싱패턴
 * @param f {String} 포맷패턴
 * @returns {String} 시간
 */
com.util.str.toTime = function(s, p, f) {
    var string        = s ? s : "";
    var parsePattern  = p ? p : "HHmm";
    var formatPattern = f ? f : "HH:mm";
    
    if (string.length != parsePattern.length) {
        return string;
    }
    
    var hour   = parsePattern.indexOf("HH") >= 0 ? string.substr(parsePattern.indexOf("HH"), 2) : "";
    var minute = parsePattern.indexOf("mm") >= 0 ? string.substr(parsePattern.indexOf("mm"), 2) : "";
    var second = parsePattern.indexOf("ss") >= 0 ? string.substr(parsePattern.indexOf("ss"), 2) : "";
    
    return formatPattern.replace("HH", hour).replace("mm", minute).replace("ss", second);
};

/**
 * 문자열을 유선전화번호로 변환한다.
 *
 * Usage: com.util.str.toPhone(string)
 *        com.util.str.toPhone(string, delimiter)
 * 
 * @param s {String} 문자열
 * @param d {String} 구분자
 * @returns {String} 유선전화번호
 */
com.util.str.toPhone = function(s, d) {
    var string    = s ? s : "";
    var delimiter = d ? d : "-";
    
    var number = com.util.str.toNumeric(string);
    
    if (number.indexOf("02") == 0) {
        if (number.length == 10) {
            return number.substr(0, 2) + delimiter + number.substr(2, 4) + delimiter + number.substr(6, 4);
        }
        if (number.length == 9) {
            return number.substr(0, 2) + delimiter + number.substr(2, 3) + delimiter + number.substr(5, 4);
        }
    }
    else {
        if (number.length == 11) {
            return number.substr(0, 3) + delimiter + number.substr(3, 4) + delimiter + number.substr(7, 4);
        }
        if (number.length == 10) {
            return number.substr(0, 3) + delimiter + number.substr(3, 3) + delimiter + number.substr(6, 4);
        }
    }
    
    return string;
};

/**
 * 문자열을 무선전화번호로 변환한다.
 *
 * Usage: com.util.str.toMobile(string)
 *        com.util.str.toMobile(string, delimiter)
 * 
 * @param s {String} 문자열
 * @param d {String} 구분자
 * @returns {String} 무선전화번호
 */
com.util.str.toMobile = function(s, d) {
    var string    = s ? s : "";
    var delimiter = d ? d : "-";
    
    var number = com.util.str.toNumeric(string);
    
    if (number.length == 11) {
        return number.substr(0, 3) + delimiter + number.substr(3, 4) + delimiter + number.substr(7, 4);
    }
    if (number.length == 10) {
        return number.substr(0, 3) + delimiter + number.substr(3, 3) + delimiter + number.substr(6, 4);
    }
    
    return string;
};

/**
 * 문자열을 배달우편번호로 변환한다.
 *
 * Usage: com.util.str.toPostcode(string)
 *        com.util.str.toPostcode(string, delimiter)
 * 
 * @param s {String} 문자열
 * @param d {String} 구분자
 * @returns {String} 배달우편번호
 */
com.util.str.toPostcode = function(s, d) {
    var string    = s ? s : "";
    var delimiter = d ? d : "-";
    
    var number = com.util.str.toNumeric(string);
    
    if (number.length == 6) {
        return number.substr(0, 3) + delimiter + number.substr(3, 3);
    }
    
    return string;
};

/**
 * 문자열을 주민등록번호로 변환한다.
 *
 * Usage: com.util.str.toResRegNo(string)
 *        com.util.str.toResRegNo(string, delimiter)
 * 
 * @param s {String} 문자열
 * @param d {String} 구분자
 * @returns {String} 주민등록번호
 */
com.util.str.toResRegNo = function(s, d) {
    var string    = s ? s : "";
    var delimiter = d ? d : "-";
    
    var number = com.util.str.toNumeric(string);
    
    if (number.length == 13) {
        return number.substr(0, 6) + delimiter + number.substr(6, 7);
    }
    
    return string;
};

/**
 * 문자열을 법인등록번호로 변환한다.
 *
 * Usage: com.util.str.toCorRegNo(string)
 *        com.util.str.toCorRegNo(string, delimiter)
 * 
 * @param s {String} 문자열
 * @param d {String} 구분자
 * @returns {String} 법인등록번호
 */
com.util.str.toCorRegNo = function(s, d) {
    var string    = s ? s : "";
    var delimiter = d ? d : "-";
    
    var number = com.util.str.toNumeric(string);
    
    if (number.length == 13) {
        return number.substr(0, 6) + delimiter + number.substr(6, 7);
    }
    
    return string;
};

/**
 * 문자열을 외국인등록번호로 변환한다.
 *
 * Usage: com.util.str.toForRegNo(string)
 *        com.util.str.toForRegNo(string, delimiter)
 * 
 * @param s {String} 문자열
 * @param d {String} 구분자
 * @returns {String} 외국인등록번호
 */
com.util.str.toForRegNo = function(s, d) {
    var string    = s ? s : "";
    var delimiter = d ? d : "-";
    
    var number = com.util.str.toNumeric(string);
    
    if (number.length == 13) {
        return number.substr(0, 6) + delimiter + number.substr(6, 7);
    }
    
    return string;
};

/**
 * 문자열을 사업자등록번호로 변환한다.
 *
 * Usage: com.util.str.toBizRegNo(string)
 *        com.util.str.toBizRegNo(string, delimiter)
 * 
 * @param s {String} 문자열
 * @param d {String} 구분자
 * @returns {String} 사업자등록번호
 */
com.util.str.toBizRegNo = function(s, d) {
    var string    = s ? s : "";
    var delimiter = d ? d : "-";
    
    var number = com.util.str.toNumeric(string);
    
    if (number.length == 10) {
        return number.substr(0, 3) + delimiter + number.substr(3, 2) + delimiter + number.substr(5, 5);
    }
    
    return string;
};

/**
 * 문자열을 맥주소로 변환한다.
 *
 * Usage: com.util.str.toMac(string)
 *        com.util.str.toMac(string, delimiter)
 * 
 * @param s {String} 문자열
 * @param d {String} 구분자
 * @returns {String} 맥주소
 */
com.util.str.toMac = function(s, d) {
    var string    = s ? s : "";
    var delimiter = d ? d : "-";
    
    var letters = string.replace(new RegExp("[^0-9a-fA-F]", "g"), "").toUpperCase();
    
    if (letters.length == 12) {
        return letters.substr( 0, 2) + delimiter +
                letters.substr( 2, 2) + delimiter +
                letters.substr( 4, 2) + delimiter +
                letters.substr( 6, 2) + delimiter +
                letters.substr( 8, 2) + delimiter +
                letters.substr(10, 2);
    }
    
    return string;
};

/**
 * 문자열을 원단위 콤마로 변환한다.
 *
 * Usage: com.util.str.toCommaWon(string)
 * 
 * @param s {String} 문자열
 * @returns {String} 원단위 콤마
 */
com.util.str.toCommaWon = function(s) {
	var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
	s += '';                          // 숫자를 문자열로 변환

	while (reg.test(s))
		s = s.replace(reg, '$1' + ',' + '$2');

	return s;
};

/**
 * 숫자를 KB, MB 단위로 변환한다.
 *
 * @param fileSize  byte 값
 * @param fixed     환산된 용량의 소수점 자릿수
 * @returns {String}
 */
com.util.str.toByte = function(fileSize, fixed) {
    var str

    //MB 단위 이상일때 MB 단위로 환산
    if (fileSize >= 1024 * 1024) {
        fileSize = fileSize / (1024 * 1024);
        fileSize = (fixed === undefined) ? fileSize : fileSize.toFixed(fixed);
        str = com.util.str.toCommaWon(fileSize) + ' MB';
    }
    //KB 단위 이상일때 KB 단위로 환산
    else if (fileSize >= 1024) {
        fileSize = fileSize / 1024;
        fileSize = (fixed === undefined) ? fileSize : fileSize.toFixed(fixed);
        str = com.util.str.toCommaWon(fileSize) + ' KB';
    }
    //KB 단위보다 작을때 byte 단위로 환산
    else {
        fileSize = (fixed === undefined) ? fileSize : fileSize.toFixed(fixed);
        str = com.util.str.toCommaWon(fileSize) + ' byte';
    }
    return str;
}

/**
 * 언더스코어 방식으로 변경한다.
 *
 * @param string  변환될 값
 * @returns {String}
 */
com.util.str.toUnderScore = function(string) {
	if (typeof string == 'number') {
		return string.toString()
	}
	var upper = /[A-Z]/g
	var index = 0;
	var upLoca = string.substring(index + 1).search(upper)
	var newSt = ''
	var restWord
	while (upLoca > -1) {
		var word = string.substring(index, index + upLoca + 1).toLowerCase()
		if (newSt == '') {
			newSt += word
		} else {
			newSt += '_' + word
		}
		index = index + upLoca + 1
		upLoca = string.substring(index + 1).search(upper)
		restWord = string.substring(index + upLoca + 1).toLowerCase()
	}
	newSt += '_' + restWord
	return newSt
}

/**
 * 문자열을 날짜서식으로로 변환한다.
 *
 * Usage: com.util.str.toDateFormat(string)
 *        com.util.str.toDateFormat(string, delimiter)
 * 
 * @param s {String} 문자열
 * @param d {String} 구분자
 * @returns {String} 날짜
 */
com.util.str.toDateFormat = function(s, d) {
    var string    = s ? s : "";
    var delimiter = d ? d : "-";
    
    
    if (string.length == 8) {
        return string.substr(0, 4) + delimiter + string.substr(4, 2) + delimiter + string.substr(6, 6);
    }
    
    return string;
};
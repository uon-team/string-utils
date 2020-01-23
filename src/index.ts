


/**
 * Transform an hypenated(with : - _ .) to camelcase
 * @param str the subject
 * @param upperCamelCase if true, capitalize the first letter
 */
export function CamelCase(str: string, upperCamelCase?: boolean) {
    return str.replace(/([\:\-\_\.]+(.))/g, (_, separator, letter, offset) => {

        return offset || upperCamelCase ? letter.toUpperCase() : letter;
    });
}

/**
 * Hypenate a camelcased string
 * @param str the camelCase string
 * @param sep the separator to use, defaults to '-'
 */
export function Hyphenate(str: string, sep: string = '-') {

    return String(str)
        .replace(/[A-Z]/g, (match) => {
            return (sep + match.charAt(0).toLowerCase());
        })
        .replace(new RegExp(`^${sep}`), '');

}

/**
 * Quotes a string and escapes quotation marks
 * @param str 
 */
export function Quote(str: string) {
    return `"${str.replace(/"/g, '\"')}"`;
}

/**
 * Unquotes a string only if it starts and ends with "
 * This function assumse the strig is trimmed
 * This will also unescape quotation marks
 * @param str 
 */
export function Unquote(str: string, quoteChar: string = '"') {
    if (str.charAt(0) === quoteChar && str.charAt(str.length - 1) === quoteChar) {
        return str.substr(1, str.length - 2).replace(new RegExp(`\\${quoteChar}`), quoteChar);
    }

    return str;
}

/**
 * Hashes a string to a number, taken from the Java implementation
 * @param s 
 */
export function Hash(s: string) {
    var h = 0, l = s.length, i = 0;
    if (l > 0)
        while (i < l)
            h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
}

/**
 * Format a string with {0}, {1} etc..
 * @param str 
 * @param args 
 */
export function Format(str: string, ...args: any[]) {

    return str.replace(/{(\d+)}/g, (ss, index) => {
        return typeof args[index] != 'undefined'
            ? args[index]
            : ss
            ;
    });
}

/**
 * Pad a string or number from the left side.
 * If {padWith} length does not exactly fit, it is sliced from the back.
 * @param val 
 * @param maxLen The length of the resulting string
 * @param padWith The content to pad with, can be longer then 1 character
 */
export function PadLeft(val: number | string, maxLen: number, padWith: string) {

    const str = String(val);
    const pad_len = padWith.length;
    const padding_width = maxLen - str.length;
    const pad_count = Math.floor(padding_width / pad_len);
    const remainder_len = padding_width % pad_len;
    let result = remainder_len ? padWith.slice(-remainder_len) : '';

    for (let i = 0; i < pad_count; ++i) {
        result += padWith;
    }

    return result + str;

}

/**
 * Pad a string or number to the right
 * @param val 
 * @param maxLen 
 * @param padWith 
 */
export function PadRight(val: number | string, maxLen: number, padWith: string) {

    const str = String(val);
    const pad_len = padWith.length;
    const padding_width = maxLen - str.length;
    const pad_count = Math.floor(padding_width / pad_len);
    const remainder_len = padding_width % pad_len;
    let result = str;

    for (let i = 0; i < pad_count; ++i) {
        result += padWith;
    }

    return result + (remainder_len ? padWith.substr(0, remainder_len) : '');

}


/**
 * Compute the similarity of 2 strings using the cosine algorithm
 * @param str1 
 * @param str2 
 */
export function Similarity(str1: string, str2: string): number {

    if (str1 === str2) return 1.0;
    if (str1.length == 0 || str2.length == 0) return 0.0;

    let v1 = SimilarityVector(str1);
    let v2 = SimilarityVector(str2);

    let dot = SimilarityDot(v1, v2);

    let magnitude = SimilarityMag(v1) * SimilarityMag(v2);

    return dot / magnitude;
}


function SimilarityVector(str: string): { [k: string]: number } {

    const res: { [k: string]: number } = {};

    for (let i = 0; i < str.length; ++i) {
        res[str[i]] = (res[str[i]] || 0) + 1;
    }

    return res;
}

function SimilarityDot(v1: { [k: string]: number }, v2: { [k: string]: number }) {
    let product = 0;

    for (let k in v1) {
        product += v1[k] * (v2[k] || 0);
    }

    return product;
}

function SimilarityMag(v: { [k: string]: number }) {

    let product = 0;

    for (let k in v) {
        product += v[k] * v[k];
    }

    return Math.sqrt(product);
}
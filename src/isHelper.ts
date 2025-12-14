/**
 * Validates if the given text is not empty.
 */
export function notEmpty(value: string): boolean {
    return value.length > 0;
}

/**
 * Validate the given regular expression against the specified value.
 */
export function validRegExp(pattern: string, value: string): boolean {
    return (new RegExp(pattern)).test(value);
}

/**
 * Validate email address.
 */
export function validEmail(value: string): boolean {
    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
}

/**
 * Validate url address.
 */
export function validUrl(value: string): boolean {
    return /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4])|(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*\.[a-z\u00a1-\uffff]{2,}\.?)(?::\d{2,5})?(?:[\/?#]\S*)?$/i.test(value)
}

/**
 * Validates if the given value is a valid number.
 */
export function validNumber(value: string): boolean {
    return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
}

/**
 * Checks if a given input contains only numeric digits.
 *
 * @param {string} value - The string to be validated.
 * @return {boolean} Returns true if the input contains only numeric digits, otherwise false.
 */
export function validDigits(value: string): boolean {
    return /^\d+$/.test(value);
}

/**
 * Validates the phone number.
 */
export function validPhone(value: string): boolean {
    return /^\s{0,2}[\+]?[\s0-9]{6,20}\s{0,2}$/.test(value);
}

/**
 * Validates the date input provided in the HTMLInputElement field.
 *
 * @param {HTMLInputElement} field - The input field to validate for a date format.
 * @return {boolean} Returns true if the input field contains a valid date format that falls within any specified min/max attributes, otherwise false.
 */
export function validDate(field: HTMLInputElement): boolean {
    const fieldValue = field.value;
    let value = Date.parse(fieldValue);
    if (value) {
        if (field.hasAttribute('min')) {
            let attrMin = field.getAttribute('min');
            if (attrMin && attrMin != '') {
                let minValue = Date.parse(attrMin);
                if (value < minValue) {
                    return false;
                }
            }
        }
        if (field.hasAttribute('max')) {
            let attrMax = field.getAttribute('max');
            if (attrMax && attrMax != '') {
                let maxValue = Date.parse(attrMax);
                if (value > maxValue) {
                    return false;
                }
            }
        }
        return true;
    }
    return false;
}

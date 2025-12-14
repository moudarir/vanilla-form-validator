/**
 * Validates if the given text is not empty.
 */
export declare function notEmpty(value: string): boolean;
/**
 * Validate the given regular expression against the specified value.
 */
export declare function validRegExp(pattern: string, value: string): boolean;
/**
 * Validate email address.
 */
export declare function validEmail(value: string): boolean;
/**
 * Validate url address.
 */
export declare function validUrl(value: string): boolean;
/**
 * Validates if the given value is a valid number.
 */
export declare function validNumber(value: string): boolean;
/**
 * Checks if a given input contains only numeric digits.
 *
 * @param {string} value - The string to be validated.
 * @return {boolean} Returns true if the input contains only numeric digits, otherwise false.
 */
export declare function validDigits(value: string): boolean;
/**
 * Validates the phone number.
 */
export declare function validPhone(value: string): boolean;
/**
 * Validates the date input provided in the HTMLInputElement field.
 *
 * @param {HTMLInputElement} field - The input field to validate for a date format.
 * @return {boolean} Returns true if the input field contains a valid date format that falls within any specified min/max attributes, otherwise false.
 */
export declare function validDate(field: HTMLInputElement): boolean;

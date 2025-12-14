import { FormSettings } from "./types";
export default class FormValidator {
    private form?;
    private fields?;
    private settings?;
    private messages;
    /**
     * Creates an instance of the form handler with the specified settings and binds it to a form element.
     *
     * @param {HTMLFormElement | string} selector - The form element or the string selector used to identify the form in the DOM.
     * @param {FormSettings} [settings] - Optional configuration settings for initializing the form handler, including validation rules and error handling options.
     * @return {void} Initializes the form handler with the provided form element and settings and prepares it for use.
     */
    constructor(selector: HTMLFormElement | string, settings?: FormSettings);
    /**
     * Load and merge messages from a JSON file into the settings.
     *
     * @param {string} jsonFile - The path of the JSON file containing the messages.
     *
     * @return {void}
     */
    loadMessages(jsonFile: string): void;
    /**
     * Initialize the form validation by setting up event listeners on form fields for blur, keyup, change events.
     * Also adds a listener for form reset event.
     *
     * @return {void}
     */
    private init;
    /**
     * Handles the field validation event triggered by a user action.
     *
     * @param {Event} e - The event object representing the user action.
     * @return {void}
     */
    fieldValidationEvent(e: Event): void;
    /**
     * Validates a field based on its type and any additional rules provided.
     *
     * @param {HTMLInputElement} field - The input field to be validated.
     * @return {boolean} Returns true if the field is valid, false if it is not.
     */
    validateField(field: HTMLInputElement): boolean;
    /**
     * Escapes characters with special meaning in CSS for a given string
     *
     * @param {string} string - The input string to escape CSS special characters
     * @return {string|undefined} - The escaped string with CSS special characters properly escaped
     */
    escapeCssMeta(string: string): string | undefined;
    /**
     * Find all elements in the DOM with the specified name attribute.
     *
     * @param {string} name - The name attribute value to search for.
     * @return {Array<Element>} - An array of elements matching the given name attribute.
     */
    findByName(name: string): Array<Element>;
    /**
     * Check if the given HTML input element is a radio button or checkbox.
     *
     * @param {HTMLInputElement} element - The HTML input element to be checked.
     * @return {boolean} - True if the element is a radio button or checkbox, false otherwise.
     */
    checkable(element: HTMLInputElement): boolean;
    /**
     * Calculates the length of a value based on the type of HTML input element.
     *
     * @param {string} value - The input value to calculate the length for.
     * @param {HTMLInputElement} element - The input element associated with the value.
     *
     * @return {number} The length of the value based on the type of the input element.
     */
    getLength(value: string, element: HTMLInputElement): number;
    /**
     * Checks if the length of a string or array is greater than or equal to a specified minimum length.
     *
     * @param {string | Array} value - The input value to be checked.
     * @param {HTMLInputElement} element - The HTML input element associated with the value.
     * @param {number} param - The minimum length that the value should have.
     *
     * @return {boolean} Returns true if the length of the input value is greater than or equal to the specified minimum length, false otherwise.
     */
    minlength(value: string, element: HTMLInputElement, param: number): boolean;
    /**
     * Check if the length of the given value is less than or equal to a specified parameter.
     *
     * @param {string} value - The value to check the length of. If value is an array, its length is used. Otherwise, the length is calculated based on the provided element.
     * @param {HTMLInputElement} element - The HTML input element to calculate the length from if value is not an array.
     * @param {number} param - The maximum length allowed.
     *
     * @return {boolean} Returns true if the length of the value is less than or equal to the param, otherwise false.
     */
    maxlength(value: string, element: HTMLInputElement, param: number): boolean;
    /**
     * Checks if the length of a value falls within a specified range.
     *
     * @param {string | Array} value - The value to check the length of. If an array is provided, its length is directly used.
     * @param {HTMLInputElement} element - The input element associated with the value.
     * @param {number[]} param - An array containing two numbers that represent the range limits [minimumLength, maximumLength].
     *
     * @return {boolean} Returns true if the length of the value falls within the specified range, otherwise returns false.
     */
    rangelength(value: string, element: HTMLInputElement, param: number[]): boolean;
    /**
     * Validates the form fields and returns true if all fields are valid.
     *
     * @return {boolean} True if all form fields are valid, otherwise false.
     */
    validateForm(): boolean;
    /**
     * Validates if at least one radio button or checkbox with the specified name is checked.
     *
     * @param {string} name - The name of the radio buttons or checkboxes to validate.
     * @return {boolean} - Returns true if at least one radio button or checkbox with the specified name is checked, false otherwise.
     */
    validateCheckboxRadio(name: string): boolean;
    /**
     * Attaches a submit event listener to the form element and prevents the default form submission behavior.
     *
     * @return {void}
     */
    checkSubmit(): void;
    /**
     * Submit the form action.
     *
     * //@param {object} $this - The reference to the current object.
     * @return {void}
     */
    submitAction(): void;
    /**
     * Resets the form by removing the "was-validated" class and resetting the form fields.
     *
     * @return {void}
     */
    resetForm(): void;
}

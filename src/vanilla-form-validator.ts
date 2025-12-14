import {FormMessages, FormSettings} from "./types";
import {deepMerge} from "./utils";
import {notEmpty, validDate, validDigits, validEmail, validPhone, validRegExp, validUrl} from "./isHelper";

export default class FormValidator {

    private form?: HTMLFormElement;
    private fields?: Element[] | null;
    private settings?: FormSettings;
    private messages: FormMessages = {
        required: 'This field is required.',
        remote: 'Please fix this field.',
        email: 'Please enter a valid email address.',
        url: 'Please enter a valid URL.',
        date: 'Please enter a valid date.',
        number: 'Please enter a valid number.',
        phone: 'Please enter a valid phone.',
        file: 'Please select a file.',
        equalTo: 'Please enter the same value again.',
        maxlength: 'Please enter no more than {0} characters.',
        minlength: 'Please enter at least {0} characters.',
        rangelength: 'Please enter a value between {0} and {1} characters long',
        max: 'Please enter a value than {0}.',
        min: 'Please enter a value at least {0}.',
        range: 'Please enter a value between {0} and {1}',
        regExp: 'Please enter a value matching the requested format.'
    }

    /**
     * Creates an instance of the form handler with the specified settings and binds it to a form element.
     *
     * @param {HTMLFormElement | string} selector - The form element or the string selector used to identify the form in the DOM.
     * @param {FormSettings} [settings] - Optional configuration settings for initializing the form handler, including validation rules and error handling options.
     * @return {void} Initializes the form handler with the provided form element and settings and prepares it for use.
     */
    constructor(selector: HTMLFormElement | string, settings?: FormSettings) {
        if (typeof selector === 'string') {
            this.form = <HTMLFormElement>document.querySelector(selector);
        } else if (typeof selector === 'object') {
            this.form = selector;
        }
        if (this.form) {
            this.settings = deepMerge({
                ignore: null,
                fields: null,
                autoValidate: true,
                errorPlacement: null,
                errorElement: 'p',
                errorClass: 'error',
                errorFieldClass: null,
                validFormClass: 'was-validated',
                submitHandler: null,
                messages: this.messages
            }, settings as Object) as FormSettings;
            this.messages = deepMerge(this.settings.messages as Object, this.messages) as FormMessages;

            this.init();
        }
    }

    /**
     * Load and merge messages from a JSON file into the settings.
     *
     * @param {string} jsonFile - The path of the JSON file containing the messages.
     *
     * @return {void}
     */
    loadMessages(jsonFile: string): void {
        fetch(jsonFile)
            .then(response => response.json())
            .then(data => {
                if (this.settings && data.messages) {
                    this.messages = deepMerge(data.messages, this.messages);
                }
            })
            .catch(error => console.log(error));
    }

    /**
     * Initialize the form validation by setting up event listeners on form fields for blur, keyup, change events.
     * Also adds a listener for form reset event.
     *
     * @return {void}
     */
    private init(): void {
        if (this.form) {
            this.form.setAttribute('novalidate', '');

            this.checkSubmit();

            this.fields = Array.from(this.form.querySelectorAll('input[name], textarea, select'));
            if (this.settings && this.settings.ignore) {
                const ignoreFields = Array.from(this.form.querySelectorAll(this.settings.ignore));
                this.fields = this.fields.filter(element => !ignoreFields.includes(element));
            }
            this.fields.forEach(field => {
                field.addEventListener('blur', this.fieldValidationEvent.bind(this));
                field.addEventListener('keyup', this.fieldValidationEvent.bind(this));
                field.addEventListener('change', this.fieldValidationEvent.bind(this));
            });

            this.form.addEventListener("reset", (_) => {
                this.resetForm();
            });
        }
    }

    /**
     * Handles the field validation event triggered by a user action.
     *
     * @param {Event} e - The event object representing the user action.
     * @return {void}
     */
    fieldValidationEvent(e: Event): void {
        this.validateField(e.target as HTMLInputElement);
    }

    /**
     * Validates a field based on its type and any additional rules provided.
     *
     * @param {HTMLInputElement} field - The input field to be validated.
     * @return {boolean} Returns true if the field is valid, false if it is not.
     */
    validateField(field: HTMLInputElement): boolean {
        let fieldId = field.id;
        const fieldName = field.name;
        const fieldType = field.type;
        const pattern = field.pattern;
        switch (fieldType) {
            case 'checkbox':
            case 'radio':
                fieldId = fieldName;
                break;
        }
        const fieldValue = field.value;
        let customErrorMessage = field.dataset.errorMessage ? field.dataset.errorMessage : '';
        let errorMessage = '';
        if (customErrorMessage) {
            errorMessage = customErrorMessage;
        }
        let isValid = true;
        if (field.hasAttribute('required')) {
            switch (fieldType) {
                case 'checkbox':
                case 'radio':
                    isValid = this.validateCheckboxRadio(fieldName);
                    break;
                default:
                    isValid = notEmpty(fieldValue);
            }
            if (!isValid && !customErrorMessage) {
                errorMessage = this.messages.required;
            }
        }
        if (isValid && fieldValue && fieldValue !== '') {
            switch (fieldType) {
                case 'email':
                    isValid = validEmail(fieldValue);
                    if (!isValid && !customErrorMessage) {
                        errorMessage = this.messages.email;
                    }
                    break;
                case 'tel':
                    isValid = validPhone(fieldValue);
                    if (!isValid && !customErrorMessage) {
                        errorMessage = this.messages.phone;
                    }
                    break;
                case 'url':
                    isValid = validUrl(fieldValue);
                    if (!isValid && !customErrorMessage) {
                        errorMessage = this.messages.url;
                    }
                    break;
                // case 'number':
                //     isValid = this.validateNumber(fieldValue);
                //     if (!isValid && !customErrorMessage) {
                //         errorMessage = this.messages.number;
                //     }
                //     break;
                case 'file':
                    isValid = !!(field.files && field.files.length > 0);
                    if (!isValid && !customErrorMessage) {
                        errorMessage = this.messages.file;
                    }
                    break;
                case 'date':
                    isValid = validDate(field);
                    if (!isValid && !customErrorMessage) {
                        errorMessage = this.messages.date;
                    }
                    break;
                default:
                    let minlength = field.getAttribute('minlength') ? field.getAttribute('minlength') : field.getAttribute('min');
                    if (minlength && validDigits(minlength)) {
                        isValid = this.minlength(fieldValue, field, parseInt(minlength));
                        if (!isValid && !customErrorMessage) {
                            if (field.getAttribute('min'))
                                errorMessage = this.messages.min.replace('{0}', minlength);
                            else
                                errorMessage = this.messages.minlength.replace('{0}', minlength);
                        }
                    }
                    let maxlength = field.getAttribute('maxlength') ? field.getAttribute('maxlength') : field.getAttribute('max');
                    if (maxlength && validDigits(maxlength)) {
                        isValid = this.maxlength(fieldValue, field, parseInt(maxlength));
                        if (!isValid && !customErrorMessage) {
                            if (field.getAttribute('max'))
                                errorMessage = this.messages.max.replace('{0}', maxlength);
                            else
                                errorMessage = this.messages.maxlength.replace('{0}', maxlength);
                        }
                    }
                    if (minlength && validDigits(minlength) && maxlength && validDigits(maxlength)) {
                        isValid = this.rangelength(fieldValue, field, [parseInt(minlength), parseInt(maxlength)]);
                        if (!isValid && !customErrorMessage) {
                            if (field.getAttribute('max') && field.getAttribute('min'))
                                errorMessage = this.messages.range
                                    .replace('{0}', minlength)
                                    .replace('{1}', maxlength);
                            else
                                errorMessage = this.messages.rangelength
                                    .replace('{0}', minlength)
                                    .replace('{1}', maxlength);
                        }
                    }
            }
            if (isValid && fieldValue && fieldValue !== '' && pattern !== '') {
                isValid = validRegExp(pattern, fieldValue);
                if (!isValid && !customErrorMessage) {
                    errorMessage = this.messages.regExp;
                }
            }
            if (isValid && this.settings && this.settings.fields) {
                this.settings.fields.forEach(fieldSetting => {
                    if (fieldSetting.name == fieldName && fieldSetting.rules) {
                        fieldSetting.rules.forEach(rule => {
                            if (isValid) {
                                if (typeof rule.method === 'function') {
                                    isValid = rule.method(fieldValue, field);
                                    if (!isValid && !customErrorMessage) {
                                        errorMessage = rule.errorMessage ? rule.errorMessage : this.messages.remote;
                                    }
                                } else {
                                    let min = rule.min;
                                    let max = rule.max;
                                    switch (rule.method) {
                                        case 'equalTo':
                                            if (rule.field) {
                                                let equalToField = <HTMLInputElement>this.form?.querySelector(rule.field);
                                                if (equalToField) {
                                                    isValid = (fieldValue == equalToField.value);
                                                    if (!isValid && !customErrorMessage) {
                                                        errorMessage = rule.errorMessage ? rule.errorMessage : this.messages.equalTo;
                                                    }
                                                }
                                            }
                                            break;
                                        case 'minlength':
                                            if (min) {
                                                isValid = this.minlength(fieldValue, field, min);
                                                if (!isValid && !customErrorMessage) {
                                                    if (field.getAttribute('min')) {
                                                        errorMessage = rule.errorMessage ? rule.errorMessage : this.messages.min;
                                                    } else {
                                                        errorMessage = rule.errorMessage ? rule.errorMessage : this.messages.minlength;
                                                    }
                                                    errorMessage = errorMessage.replace('{0}', min.toString());
                                                }
                                            }
                                            break;
                                        case 'maxlength':
                                            if (max) {
                                                isValid = this.maxlength(fieldValue, field, max);
                                                if (!isValid && !customErrorMessage) {
                                                    if (field.getAttribute('max')) {
                                                        errorMessage = rule.errorMessage ? rule.errorMessage : this.messages.max;
                                                    } else {
                                                        errorMessage = rule.errorMessage ? rule.errorMessage : this.messages.maxlength;
                                                    }
                                                    errorMessage = errorMessage.replace('{0}', max.toString());
                                                }
                                            }
                                            break;
                                        case 'rangelength':
                                            if (min && max) {
                                                isValid = this.rangelength(fieldValue, field, [min, max]);
                                                if (!isValid && !customErrorMessage) {
                                                    if (field.getAttribute('max') && field.getAttribute('min')) {
                                                        errorMessage = rule.errorMessage ? rule.errorMessage : this.messages.range;
                                                    } else {
                                                        errorMessage = rule.errorMessage ? rule.errorMessage : this.messages.rangelength;
                                                    }
                                                    errorMessage = errorMessage
                                                        .replace('{0}', min.toString())
                                                        .replace('{1}', max.toString());
                                                }
                                            }
                                            break;
                                    }
                                }
                            }
                        });
                    }
                });
            }
        }
        let errorHelpId = (fieldId ? fieldId : fieldName) + '-error';
        let errorHelp = <HTMLElement>document.querySelector('#' + errorHelpId);
        if (!errorHelp && this.settings) {
            const errorHelpItem = document.createElement(this.settings.errorElement ? this.settings.errorElement : 'p');
            errorHelpItem.className = this.settings.errorClass ? this.settings.errorClass : 'error';
            errorHelpItem.id = errorHelpId;

            if (typeof this.settings.errorPlacement === 'function') {
                this.settings.errorPlacement(field, errorHelpItem);
            } else {
                field.insertAdjacentElement('afterend', errorHelpItem);
            }

            errorHelp = <HTMLElement>document.querySelector('#' + errorHelpId);
        }
        if (errorHelp) {
            if (isValid) {
                if (errorHelp) {
                    errorHelp.style.setProperty('display', 'none');
                }
                if (this.settings && this.settings.errorFieldClass) {
                    field.classList.remove(this.settings.errorFieldClass);
                }
            } else {
                errorHelp.innerText = errorMessage;
                if (errorHelp) {
                    errorHelp.style.setProperty('display', '');
                }
                if (this.settings && this.settings.errorFieldClass) {
                    field.classList.add(this.settings.errorFieldClass);
                }
            }
        }

        return isValid;
    }

    /**
     * Escapes characters with special meaning in CSS for a given string
     *
     * @param {string} string - The input string to escape CSS special characters
     * @return {string|undefined} - The escaped string with CSS special characters properly escaped
     */
    escapeCssMeta (string: string): string | undefined {
        if ( string === undefined ) {
            return "";
        }
        return string.replace( /([\\!"#$%&'()*+,./:;<=>?@\[\]^`{|}~])/g, "\\$1" );
    }

    /**
     * Find all elements in the DOM with the specified name attribute.
     *
     * @param {string} name - The name attribute value to search for.
     * @return {Array<Element>} - An array of elements matching the given name attribute.
     */
    findByName(name: string): Array<Element> {
        return Array.from((this.form) ? this.form.querySelectorAll( "[name='" + this.escapeCssMeta(name) + "']" ) : []);
    }

    /**
     * Check if the given HTML input element is a radio button or checkbox.
     *
     * @param {HTMLInputElement} element - The HTML input element to be checked.
     * @return {boolean} - True if the element is a radio button or checkbox, false otherwise.
     */
    checkable(element: HTMLInputElement): boolean {
        return (/radio|checkbox/i).test( element.type );
    }

    /**
     * Calculates the length of a value based on the type of HTML input element.
     *
     * @param {string} value - The input value to calculate the length for.
     * @param {HTMLInputElement} element - The input element associated with the value.
     *
     * @return {number} The length of the value based on the type of the input element.
     */
    getLength(value: string, element: HTMLInputElement): number {
        switch ( element.nodeName.toLowerCase() ) {
            case "select":
                return Array.from(element.querySelectorAll('option')).filter(element => (<HTMLOptionElement>element).selected).length;
            case "input":
                if (this.checkable( element )) {
                    return this.findByName(element.name).filter(element => (<HTMLInputElement>element).checked).length;
                } else {
                    switch (element.type) {
                        case "number":
                            return parseInt(value);
                        case "file":
                            if (element.files) {
                                return element.files.length;
                            } else {
                                return 0;
                            }
                    }
                }
        }
        return value.length;
    }

    /**
     * Checks if the length of a string or array is greater than or equal to a specified minimum length.
     *
     * @param {string | Array} value - The input value to be checked.
     * @param {HTMLInputElement} element - The HTML input element associated with the value.
     * @param {number} param - The minimum length that the value should have.
     *
     * @return {boolean} Returns true if the length of the input value is greater than or equal to the specified minimum length, false otherwise.
     */
    minlength(value: string, element: HTMLInputElement, param: number): boolean {
        const length = Array.isArray(value) ? value.length : this.getLength(value, element);
        return length >= param;
    }

    /**
     * Check if the length of the given value is less than or equal to a specified parameter.
     *
     * @param {string} value - The value to check the length of. If value is an array, its length is used. Otherwise, the length is calculated based on the provided element.
     * @param {HTMLInputElement} element - The HTML input element to calculate the length from if value is not an array.
     * @param {number} param - The maximum length allowed.
     *
     * @return {boolean} Returns true if the length of the value is less than or equal to the param, otherwise false.
     */
    maxlength(value: string, element: HTMLInputElement, param: number): boolean {
        const length = Array.isArray(value) ? value.length : this.getLength(value, element);
        return length <= param;
    }

    /**
     * Checks if the length of a value falls within a specified range.
     *
     * @param {string | Array} value - The value to check the length of. If an array is provided, its length is directly used.
     * @param {HTMLInputElement} element - The input element associated with the value.
     * @param {number[]} param - An array containing two numbers that represent the range limits [minimumLength, maximumLength].
     *
     * @return {boolean} Returns true if the length of the value falls within the specified range, otherwise returns false.
     */
    rangelength(value: string, element: HTMLInputElement, param: number[]): boolean {
        const length = Array.isArray(value) ? value.length : this.getLength(value, element);
        return ( length >= param[0] && length <= param[1] );
    }

    /**
     * Validates the form fields and returns true if all fields are valid.
     *
     * @return {boolean} True if all form fields are valid, otherwise false.
     */
    validateForm(): boolean {
        let isValid = true;
        if (this.fields) {
            this.fields.forEach(field => {
                let isValidField = this.validateField(<HTMLInputElement>field);
                if (!isValidField) {
                    isValid = false;
                }
            });
        }
        return isValid;
    }

    /**
     * Validates if at least one radio button or checkbox with the specified name is checked.
     *
     * @param {string} name - The name of the radio buttons or checkboxes to validate.
     * @return {boolean} - Returns true if at least one radio button or checkbox with the specified name is checked, false otherwise.
     */
    validateCheckboxRadio(name: string): boolean {
        let element = <HTMLInputElement[]>Array.from((this.form) ? this.form.querySelectorAll('input[name="' + name + '"]') : []);
        for (let i = 0; i < element.length; i++) {
            let checked = element[i].checked;
            if (checked) {
                element.forEach((item) => {
                    if (this.settings && this.settings.errorFieldClass) {
                        item.classList.remove(this.settings.errorFieldClass);
                    }
                });
                return true;
            }
        }
        return false;
    }

    /**
     * Attaches a submit event listener to the form element and prevents the default form submission behavior.
     *
     * @return {void}
     */
    checkSubmit(): void {
        if (this.form) {
            this.form.addEventListener('submit', (event) => {
                event.preventDefault();
                this.submitAction();
            });
        }
    }

    /**
     * Submit the form action.
     *
     * //@param {object} $this - The reference to the current object.
     * @return {void}
     */
    submitAction(): void {
        if (this.form) {
            if (this.settings && this.settings.validFormClass) {
                this.form.classList.add(this.settings.validFormClass)
            }
            if (this.validateForm()) {
                if (this.settings && this.settings.submitHandler) {
                    this.settings.submitHandler();
                } else {
                    this.form.submit();
                }
            } else {
                console.log('Invalid form, please check the errors.');
                if (this.settings && this.settings.validFormClass) {
                    this.form.classList.remove(this.settings.validFormClass);
                }
            }
        }
    }

    /**
     * Resets the form by removing the "was-validated" class and resetting the form fields.
     *
     * @return {void}
     */
    resetForm(): void {
        if (this.form) {
            if (this.settings && this.settings.validFormClass) {
                this.form.classList.remove(this.settings.validFormClass);
            }
            this.form.reset();
        }
    }
}
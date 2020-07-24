export default class FormValidator {
  constructor(
    {
      inputSelector, //"donations__input"
      submitButtonSelector, //"donations__submit-button"
      inactiveButtonClass, // "donations__submit-button_type_inactive"
      inputErrorClass, // "donations__input_type_error"
      errorClass, //"donations__input-error_type_active"
    },
    formElement //"donations__form"
  ) {
    this._element = formElement;
    this._inputSelector = inputSelector;
    this._submitButtonSelector = submitButtonSelector;
    this._inactiveButtonClass = inactiveButtonClass;
    this._inputErrorClass = inputErrorClass;
    this._errorClass = errorClass;
  }

  //Show error
  _showInputError(input, errorMessage) {
    const errorElement = this._element.querySelector(`#${input.id}-error`);
    input.classList.add(this._inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(this._errorClass);
  }

  //Hide error
  _hideInputError(input) {
    const errorElement = this._element.querySelector(`#${input.id}-error`);
    input.classList.remove(this._inputErrorClass);
    errorElement.classList.remove(this._errorClass);
    errorElement.textContent = "";
  }

  //Check form field
  _isValid(input) {
    if (!input.validity.valid) {
      this._showInputError(input, input.validationMessage);
    } else {
      this._hideInputError(input);
    }
  }

  //Check all fields in form
  _setEventListeners() {
    const inputList = Array.from(
      this._element.querySelectorAll(this._inputSelector)
    );
    const submitBtn = this._element.querySelector(this._submitButtonSelector);
    this._toggleButtonState(inputList, submitBtn);

    inputList.forEach((input) => {
      this._isValid(input);
      input.addEventListener("input", () => {
        this._isValid(input);
        this._toggleButtonState(inputList, submitBtn);
      });
    });
  }

  //Check if any field from list is invalid
  _hasInvalidInput(inputList) {
    return inputList.some((input) => {
      return !input.validity.valid;
    });
  }

  //Toggle submit button depending on validity of fields
  _toggleButtonState(inputList, button) {
    if (this._hasInvalidInput(inputList)) {
      button.classList.add(this._inactiveButtonClass);
      button.disabled = true;
    } else {
      button.classList.remove(this._inactiveButtonClass);
      button.disabled = false;
    }
  }

  //Check form
  enableValidation() {
    this._setEventListeners();
  }
}

const mortgageResult = document.getElementById("result");
mortgageResult.style.display = "none";

const mortgageResultEmpty = document.getElementById("empty_result");
mortgageResultEmpty.style.display = "";

function addFocusAndBlurEvents(inputId, wrapperSelector, errorMessageId) {
  const inputField = document.getElementById(inputId);
  const wrapper = document.querySelector(wrapperSelector);

  inputField.addEventListener("focus", function () {
    if (!document.getElementById(errorMessageId).textContent) {
      wrapper.style.backgroundColor = "hsl(61, 70%, 52%)";
      inputField.style.borderColor = "hsl(61, 70%, 52%)";
    }
  });

  inputField.addEventListener("blur", function () {
    if (!document.getElementById(errorMessageId).textContent) {
      wrapper.style.backgroundColor = "";
      inputField.style.borderColor = "";
    }
  });
}

addFocusAndBlurEvents(
  "mortgage_amount",
  ".mortgage__calculator_form-icon_wrapper",
  "mortgage_amount_error_message"
);
addFocusAndBlurEvents(
  "mortgage_term",
  ".mortgage__calculator_form-group-two_inline-label-years",
  "mortgage_term_error_message"
);
addFocusAndBlurEvents(
  "interest_rate",
  ".mortgage__calculator_form-group-two_inline_percentage_icon",
  "interest_rate_error_message"
);

function errorMessageIcon(elementId, element, color) {
  if (element === "svg")
    document
      .querySelector("#" + elementId + " path")
      .setAttribute("fill", color);
  else if (document.getElementById(elementId))
    document.getElementById(elementId).style.color = color;
}

function errorMessage(
  inputField,
  errorMessageId,
  inputFieldId,
  wrapperSelector,
  iconId,
  elementTag,
  errorType
) {
  const errorMessage = document.getElementById(errorMessageId);

  if (!inputField) {
    errorMessage.textContent = "This field is required";
    errorMessage.style.display = "block";

    if (inputFieldId)
      document.getElementById(inputFieldId).style.borderColor = "red";

    if (wrapperSelector)
      document.querySelector(wrapperSelector).style.backgroundColor = "red";

    if (iconId && elementTag) errorMessageIcon(iconId, elementTag, "white");
  } else if (inputField && errorType === "negative-check" && inputField < 0) {
    errorMessage.textContent = "This field cannot be negative";
    errorMessage.style.display = "block";

    document.getElementById(inputFieldId).style.borderColor = "red";
    document.querySelector(wrapperSelector).style.backgroundColor = "red";
    errorMessageIcon(iconId, elementTag, "white");
  } else {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
    if (document.getElementById(inputFieldId))
      document.getElementById(inputFieldId).style.borderColor = "";
    if (document.querySelector(wrapperSelector))
      document.querySelector(wrapperSelector).style.backgroundColor = "";
    errorMessageIcon(iconId, elementTag, "#4e6e7e");
  }

  return errorMessage.textContent;
}

document
  .getElementById("mortgage__calculator-btn")
  .addEventListener("click", function () {
    const mortgageAmount = document.getElementById("mortgage_amount").value;
    const mortgageAmountError = errorMessage(
      mortgageAmount,
      "mortgage_amount_error_message",
      "mortgage_amount",
      ".mortgage__calculator_form-icon_wrapper",
      "currency-icon",
      "svg",
      "negative-check"
    );

    const mortgageTerm = document.getElementById("mortgage_term").value;
    const mortgageTermError = errorMessage(
      mortgageTerm,
      "mortgage_term_error_message",
      "mortgage_term",
      ".mortgage__calculator_form-group-two_inline-label-years",
      "year-text-block",
      "div",
      "negative-check"
    );

    const interestRate = document.getElementById("interest_rate").value;
    const interestRateError = errorMessage(
      interestRate,
      "interest_rate_error_message",
      "interest_rate",
      ".mortgage__calculator_form-group-two_inline_percentage_icon",
      "percentage-icon",
      "svg"
    );

    const mortgageType = document.querySelector(
      'input[name="mortgage_type"]:checked'
    );
    const mortgageTypeError = errorMessage(
      mortgageType,
      "mortgage_type_error_message"
    );

    if (
      !(mortgageAmountError ||
      mortgageTermError ||
      interestRateError ||
      mortgageTypeError)
    ) {
      if (mortgageType.value === "repayment") {
        const mortgageTermInMonths = Number(mortgageTerm) * 12;
        const interestRatePerYear = Number(interestRate) / (12 * 100);

        const powerTerm = (1 + interestRatePerYear) ** mortgageTermInMonths;

        const monthlyRepayment =
          mortgageAmount *
          ((interestRatePerYear * powerTerm) / (powerTerm - 1));

        const termRepayment = monthlyRepayment * Number(mortgageTermInMonths);

        document.getElementById("mortgage_monthly_repayment").textContent =
          monthlyRepayment.toFixed(2);

        document.getElementById("mortgage_term_repayment").textContent =
          termRepayment.toFixed(2);

        mortgageResultEmpty.style.display = "none";
        mortgageResult.style.display = "";
      } else if (mortgageType.value === "interest_only") {
        const mortgageTermInMonths = Number(mortgageTerm) * 12;
        const interestRatePerYear = Number(interestRate) / (12 * 100);

        const monthlyRepayment = mortgageAmount * Number(interestRatePerYear);

        const termRepayment = monthlyRepayment * mortgageTermInMonths;

        document.getElementById("mortgage_monthly_repayment").textContent =
          monthlyRepayment.toFixed(2);

        document.getElementById("mortgage_term_repayment").textContent =
          termRepayment.toFixed(2);

        mortgageResultEmpty.style.display = "none";
        mortgageResult.style.display = "";
      }
    } else {
      mortgageResultEmpty.style.display = "";
      mortgageResult.style.display = "none";
    }
  });

document.getElementById("clear-all").addEventListener("click", function () {
  document.getElementById("mortgage_amount").value = "";
  document.getElementById("mortgage_term").value = "";
  document.getElementById("interest_rate").value = "";
  const radios = document.querySelectorAll('input[name="mortgage_type"]');

  radios.forEach(function (radio) {
    radio.checked = false;
  });

  const mortgageAmount = document.getElementById("mortgage_amount").value;
  errorMessage(
    !mortgageAmount,
    "mortgage_amount_error_message",
    "mortgage_amount",
    ".mortgage__calculator_form-icon_wrapper",
    "currency-icon",
    "svg"
  );

  const mortgageTerm = document.getElementById("mortgage_term").value;
  errorMessage(
    !mortgageTerm,
    "mortgage_term_error_message",
    "mortgage_term",
    ".mortgage__calculator_form-group-two_inline-label-years",
    "year-text-block",
    "div"
  );

  const interestRate = document.getElementById("interest_rate").value;
  errorMessage(
    !interestRate,
    "interest_rate_error_message",
    "interest_rate",
    ".mortgage__calculator_form-group-two_inline_percentage_icon",
    "percentage-icon",
    "svg"
  );

  const mortgageType = document.querySelector(
    'input[name="mortgage_type"]:checked'
  );
  errorMessage(!mortgageType, "mortgage_type_error_message");

  mortgageResultEmpty.style.display = "";
  mortgageResult.style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("welcome-btn").addEventListener("click", () => {
    document.getElementById("welcome").style.display = "none";
    document.getElementById("myform").style.display = "block";
  });
  document.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      if (document.getElementById("myform").style.display == "none") {
        document.getElementById("welcome").style.display = "none";
        document.getElementById("myform").style.display = "block";
      }else{

        document.querySelector("#step-1").querySelector(".btn_next").click()
      }
    }
  });
});
/**
 * Define a function to navigate betweens form steps.
 * It accepts one parameter. That is - step number.
 */
const navigateToFormStep = (stepNumber) => {
  /**
   * Hide all form steps.
   */
  document.querySelectorAll(".form-step").forEach((formStepElement) => {
    formStepElement.classList.add("d-none");

  });
  /**
   * Mark all form steps as unfinished.
   */
  document.querySelectorAll(".form-stepper-list").forEach((formStepHeader) => {
    formStepHeader.classList.add("form-stepper-unfinished");
    formStepHeader.classList.remove("form-stepper-active", "form-stepper-completed");
  });
  /**
   * Show the current form step (as passed to the function).
   */
  ding =  document.querySelector("#ding-step-" + stepNumber)
  
  if (stepNumber != 6){
    ding.classList.add("fade")
  }
  
  document.querySelector("#step-" + stepNumber).classList.remove("d-none")
  document.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      document.querySelector("#step-" + stepNumber).querySelector(".btn_next").click()

    }
  });

  /**
   * Select the form step circle (progress bar).
   */
  const formStepCircle = document.querySelector('li[step="' + stepNumber + '"]');
  /**
   * Mark the current form step as active.
   */
  formStepCircle.classList.remove("form-stepper-unfinished", "form-stepper-completed");
  formStepCircle.classList.add("form-stepper-active");
  /**
   * Loop through each form step circles.
   * This loop will continue up to the current step number.
   * Example: If the current step is 3,
   * then the loop will perform operations for step 1 and 2.
   */
  for (let index = 0; index < stepNumber; index++) {
    /**
     * Select the form step circle (progress bar).
     */
    const formStepCircle = document.querySelector('li[step="' + index + '"]');
    /**
     * Check if the element exist. If yes, then proceed.
     */
    if (formStepCircle) {
      /**
       * Mark the form step as completed.
       */
      formStepCircle.classList.remove("form-stepper-unfinished", "form-stepper-active");
      formStepCircle.classList.add("form-stepper-completed");
    }
  }
};
/**
 * Select all form navigation buttons, and loop through them.
 */
document.querySelectorAll(".btn-navigate-form-step").forEach((formNavigationBtn) => {
  /**
   * Add a click event listener to the button.
   */
  formNavigationBtn.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      /**
       * Get the value of the step.
       */
      const stepNumber = parseInt(formNavigationBtn.getAttribute("step_number"));
      /**
       * Call the function to navigate to the target form step.
       */
      navigateToFormStep(stepNumber);
    }
  });
  formNavigationBtn.addEventListener("click", () => {
    /**
     * Get the value of the step.
     */
     const stepNumber = parseInt(formNavigationBtn.getAttribute("step_number"));
    /**
     * Call the function to navigate to the target form step.
     */
     navigateToFormStep(stepNumber);
  });
});


var q1 = new SlimSelect({
  select: '#q1',
  closeOnSelect: false,
  hideSelectedOption: true,
  limit: 2,
  placeholder: 'Choose a maximum of 2 options',
  onChange: () => {
    if (q1.selected().length >= 2 ){
      q1.close();
    }
  }
});


new SlimSelect({
  select: '#q2',
});

new SlimSelect({
  select: '#q3',
});

var q4 = new SlimSelect({
  select: '#q4',
  closeOnSelect: false,
  hideSelectedOption: true,
  limit: 2,
  placeholder: 'Choose a maximum of 2 options',
  onChange: () => {
    if (q4.selected().length >= 2) {
      q4.close();
    }
  }

});
var q5 = new SlimSelect({
  select: '#q5',
  closeOnSelect: false,
  hideSelectedOption: true,
  limit: 3,
  placeholder: 'Choose a maximum of 3 options',
  onChange: () => {
    if (q5.selected().length >= 3) {
      q5.close();
    }
  }
});


document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("answers").style.display = "none";
  document.getElementById("result").style.display = "none";
  const form = document.getElementById("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    answers = {
      Q1: [...document.getElementById("q1").options].filter(({ selected }) => selected).map(({ value }) => value),
      Q2: [...document.getElementById("q2").options].filter(({ selected }) => selected).map(({ value }) => value),
      Q3: [...document.getElementById("q3").options].filter(({ selected }) => selected).map(({ value }) => value),
      Q4: [...document.getElementById("q4").options].filter(({ selected }) => selected).map(({ value }) => value),
      Q5: [...document.getElementById("q5").options].filter(({ selected }) => selected).map(({ value }) => value),
    };
    console.log(answers);
    callingAirtable(answers);
  });
});

function callingAirtable(answers) {
  formula = "AND(";
  for (i = 1; i <= Object.keys(answers).length; i++) {
    if (answers["Q" + i].length >= 1) {
      formula += "OR(";
      for (j = 0; j < answers["Q" + i].length; j++) {
        formula += 'SEARCH("' + answers["Q" + i][j] + '",Q' + i + "),";
      }
      formula = formula.slice(0, -1);
      formula += "),";
      console.log(formula);
    }
  }
  formula = formula.slice(0, -1);
  formula += ")";
  console.log(formula);
  var Airtable = require("airtable");
  var base = new Airtable({ apiKey: "keysUzYibkWIvTiv1" }).base("appX1PqOi2LUwjIwF");
  base("Main")
    .select({
      filterByFormula: formula,
    })
    .eachPage(
      function page(records, fetchNextPage) {
        console.log(records);
        if (records.length == 0) {
          document.getElementById("result").style.display = "block";
          document.getElementById("result").innerHTML = "No results found";
          document.getElementById("answers").style.display = "none";
        } else {
          var i = 0;
          document.getElementById("result").innerHTML = "Our Recommendations";
          document.getElementById("result").style.display = "block";
          document.getElementById("answers").style.display = "block";
          document.getElementById("theTable").innerHTML = "";
          for (i = 0; i < records.length; i++) {
            console.log("Answer number ", i);
            console.log("Resource:", records[i].get("Name"));
            console.log("Resource:", records[i].get("Description"));
            console.log("Website:", records[i].get("Website"));
            $("#theTable").append(
              `<tr>
                <th scope="row">${i + 1}</th>
                ${
                  records[i].get("Logo")
                    ? `<td><img class="img-fluid img-thumbnail"  src="${records[i].get("Logo")[0].url}"></td>`
                    : "<td></td>"
                }
                <td>${records[i].get("Name")}</td>
                ${
                  records[i].get("Description")
                    ? `<td class="des">${records[i].get("Description")}</td>`
                    : "<td class='des'></td>"
                }
                <td><a href="${records[i].get("Website")}">Learn more</a></td>
                </tr>`
            );
          }
        }

        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
}

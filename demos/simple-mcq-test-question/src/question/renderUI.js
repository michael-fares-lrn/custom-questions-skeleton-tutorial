
import { v4 as uuidv4 } from "uuid";

export const renderUI = (el, question, response, state) => {
    const responseArea = el.querySelector(".lrn_response_input");
    const form = document.createElement("form");
      question.choices.forEach((choice) => {
            // create a container div for each choice
            const containerDiv = document.createElement("div");
            // for styling later we will add the option-container classname to our container div
            containerDiv.classList.add("option-container");
            // create unique id for each radio button input and label pair
            const uniqueID = uuidv4();
            // create a radio button input and corresponding label for each choice 
            const input = document.createElement("input");
            input.setAttribute("type", "radio");
            const label = document.createElement("label");
            // assign the uniqueID to each radio button input and label pair
            input.setAttribute("id", uniqueID);
            label.setAttribute("for", uniqueID);
            // give each radio button input it's respective value from our question JSON's choices array
            input.setAttribute("value", choice.value);
            // give each radio button label it's respective label (text) from our question JSON's choices array
            label.innerHTML = choice.label;
            // use the unique response_id for this question for the "name" attribute of each radio button input
            // so they are all grouped together
            input.setAttribute("name", question.response_id);
            // finish appending everything to our question's response area 
            containerDiv.appendChild(input);
            containerDiv.appendChild(label);
            form.appendChild(containerDiv);
            responseArea.appendChild(form);
        });
    /**
     * handle updating our UI with the saved student response in review and resume states, if a saved response exists
     */
    if ((state === "resume" || state === "review") && response) {

   
        
      el.querySelector(`input[value="${response.value}"]`).checked = true;
          /**
        * EXAMPLE JS ERROR THROWN IN authoring.php but not assessment.php:
        * The above code will will work in assessment.php to update the UI with the saved student response.
        *  However in authoring.php, will throw the following error:
        * 
        *  | renderUI.js?06b7:53 Uncaught (in promise) TypeError: Cannot set properties of null (setting 'checked')
           | at renderUI (renderUI.js?06b7:53:8)
           | at eval (index.js?b5f2:44:21)
        * 
           | 10024: Failed loading external resource (Detail: Custom Question did not trigger ready event). View this error on LearnosityApp.errors[0]
        */
    
    }
};
// first, we will import the UUID library installed via `yarn add uuid`
// we will use this library to assign a unique id pair to each of our multiple choice radio buttons and their corresponding labels
import { v4 as uuidv4 } from "uuid";
/**
 * @param { Jquery selection } el - the unique DOM element to which this unique question instance is scoped.
 * @param { Object } question - the JSON for the custom question as we definied it in assessment.php
 * @param { Object } response - the saved response for this question if in "resume" or "review" state (see below)
 * this will be used to update the UI with the saved response
 * @param { String } state - the state of questions API.
 * state can be any of the following 3 strings
 * "initial" for first starting the assessment,
 * "resume" for coming back to a previously started assessmnet,
 * "review" for showing the completed assessment and results to the learner or teacher
 */
export const renderUI = (el, question, response, state) => {
    const responseArea = el.querySelector(".lrn_response_input");
    const form = document.createElement("form");

    // we will loop though the choices array on our question JSON and for each choice, create a continer div
    // and place inside it a radio button input followed by a label for the choice.
    // the final result is appended to the form, which is appened to the responseArea
    // for type safety, it is a good practice to check that question.choices is in fact an Array. 
    // This example performs the check with the Javascript Array.isArray() method
    Array.isArray(question.choices) &&
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
        /** check if the radio button that matches the learners saved response has been rendered,
         * and if so, update the UI to show it as selected by setting its "checked" property to true
         */
        const inputToUpdate = el.querySelector(`input[value="${response.value}"]`);
        if (inputToUpdate) {
            inputToUpdate.checked = true;
        }
    }
};
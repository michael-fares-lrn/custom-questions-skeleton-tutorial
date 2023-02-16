// if applicable, import any libraries of frameworks here you wish to use for rendering your custom question. (react, vue etc)

// note the 4 key paramaters that this function should manage
/**
 * @param { Jquery selection } el - the unique DOM element to which this unique question instance is scoped.
 * If applicable to your usecase you can use vanilla javascript to select any children of this element 
 * with assurance you are selecting elements scoped to this question instance
 * e.g. el.querySelector('input'), el.querySelector('.myclassname')
 * @param { Object } question - the JSON for the custom question as we definied it in assessment.php. You may loop over any of its data you choose
 * in order to render corresponding UI components
 * @param { Object } response - the saved response for this question if in "resume" or "review" state (see below)
 * this will be used to update the UI with the saved response
 * @param { String } state - the state of questions API.
 * state can be any of the following 3 strings
 *  - "initial" for first starting the assessment,
 * - "resume" for coming back to a previously started assessmnet,
 * - "review" for showing the completed assessment and results to the learner or teacher
 */
export const renderUI = (el, question, response, state) => {
    /**
     * @const responseArea - this is parent element hook, or root of your question UI. 
     * All question UI components should be rendered inside of this parent element hook
     */
    const responseArea = el.querySelector(".lrn_response_input")

    // add the logic for rendering your question UI here and appending it to responseArea here

    // uncomment the follwing lines for a simple vanilla JS example: 
    // const input = document.createElement('input')
    // responseArea.appendChild(input)
  
    /**
     * In this if statement, you need to handle updating the question UI with the saved student response in review and resume states, if a saved response exists
     */
    if ((state === "resume" || state === "review") && response) {
        // if you want to use your custom quesiton in resume and review states, then 
        // write the logic for updating your question UI with the saved learner response here.
    }
};
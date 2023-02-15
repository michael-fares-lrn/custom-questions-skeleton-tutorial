# Creating a Simple Custom Question with the custom-questions-skeleton - an illustrated tutorial
### In this tutorial, we will create a simple multiple choice custom question using the custom questions skeleton
### Each step below inclues a short description, code references, and finally a link to a `cheat commit` so you can see what the final result should look like.  

### If you are the kind of developer who likes to have a destination fully in mind first, then you can download and run the end result of this tutorial under `demos/simple-multiple-choice-tutorial` located in [the custom-questions-skeleton-tutorial repository](https://github.com/michael-fares-lrn/custom-questions-skeleton-tutorial): 

### Prerequisites to get started: 
- Copy, fork, and/or clone the [Learnosity custom-questions-skeleton repo](https://github.com/Learnosity/custom-questions-skeleton)
- cd into custom-questions-skeleton/demos:   `cd custom-questions-skeleton/demos`
- In the same directory, you will find a folder called `custom-question-skeleton` Copy it and rename it to `simple-multiple-choice-tutorial` - the name of our custom question project for this tutorial.
- cd into simple-multiple-choice-tutorial `cd simple-multiple-choice-tutorial`
- run the command `yarn dev` to install necessary dependencies and start the development server
- open [localhost:12345/assessment.php](https://localhost:12345/assessment.php) in the broswer. 
- for additional info see [Starting your Custom Question project](https://help.learnosity.com/hc/en-us/articles/4414363148561-Getting-Started-with-Custom-Questions-and-Features#starting-your-custom-question-project)


### Now let's get to coding!

## Step 1: define the stimulus of your custom question by editing the [JSON for your custom question](https://github.com/Learnosity/custom-questions-skeleton/blob/c1eb549f37ad54534ee0dc0bfb9cfbf4efac1a3a/demos/custom-question-skeleton/assessment.php#L10) in `assessment.php`  


```json
assessment.php:
...
"stimulus": "Which city is located in the US state of Texas?",
...
```  
:rocket: [Step 1 Cheat Commit](https://github.com/michael-fares-lrn/custom-questions-skeleton-tutorial/commit/9534618e63b9be95d4b62fa7436a06922f4ee92e)

## Step 2: On the same question JSON  in `assessment.php` we will also define two additional key properties:
1. `"choices"`: the list of possible choices for this particular question
AND
2. `"valid_response"`: this property specifies the correct answer for the question and is required
for all Learnosity autograded questions. In this example, we specify the valid response by giving the value of the choice from the choices array that is the correct answer. (Houston)

NOTE: we will refer to this again when building our question UI in `src/question/index.js`  


```json
assessment.php:
...
          "valid_response" : {
              "value" : "1"
          },
          "choices" : [
            {"label": "Denver", "value": "0"},
            {"label": "Houston", "value": "1"},
            {"label": "Chicago", "value": "2"},
            {"label": "New York", "value": "3"}
          ],
...
```  

:rocket: [Step 2 Cheat Commit](https://github.com/michael-fares-lrn/custom-questions-skeleton-tutorial/commit/7ce4496a501d5d1feb9623702fd6ec7c063613ef)

## Step 3: Finally, on the question JSON  in `assessment.php` we will also define the score possible for this particular question:  

```json
assessment.php:
...
  "score" : 1,
...
```  
NOTE: we will refer to the `"score"` property again when coding the scoring logic for our question in `src/scorer/index.js`  

:rocket: [Step 3 Cheat Commit](https://github.com/michael-fares-lrn/custom-questions-skeleton-tutorial/commit/87e3460a5559a2b2ef6cab0c35c9c8e5b31842fb)

## Step 4: Write the UI rendering logic for your custom question based on its JSON definition. 
For this example we will write a component function in a separate file called `renderUI.js`. We'll place the file inside the `src/quesiton` folder. We will then export the function for use in `src/question/index.js`.  

This example uses the `uuid` npm library to generate unique ids for our radio button and label pairs, so first we will install this library by running `yarn add uuid` in the terminal.

Alternatively, you can name the dependency in package.json and then run `yarn dev` again to install it

```json
package.json:
...
"dependencies": {
    "uuid": "^9.0.0"
  }
...
```
Now onto writing our renderUI function:

```javascript
src/question/renderUI.js:

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
};
```  
:rocket: [Step 4 Cheat Commit](https://github.com/michael-fares-lrn/custom-questions-skeleton-tutorial/commit/5b813aa3ff7d8ea55b7320eec67bc8aecd3ba103)

## Step 5: Now we will call our UI rendering function inside of `src/question/index.js`, and we will be sure to pass in the 4 key parameters from the Question class set up by the custom-questions-skeleton: `el, question, response, state` 
[These are the same 4 key properties documented in step 4 above](https://github.com/michael-fares-lrn/custom-questions-skeleton-tutorial/blob/main/demos/simple-multiple-choice-tutorial/src/question/renderUI.js#L4-L14).

- [ ] first, we need to import our function into `index.js` at the top of the file:  `import { renderUI } from './renderUI.js';`  

- [ ] next we need to add the `state` property to the destructured Question.init propeties on [line 24](https://github.com/Learnosity/custom-questions-skeleton/blob/master/demos/custom-question-skeleton/src/question/index.js#L24):  `const { question, response, state } = init;` 

 - [ ] next we can replace the [placeholder on line 45](https://github.com/Learnosity/custom-questions-skeleton/blob/master/demos/custom-question-skeleton/src/question/index.js#L45) with the call to our renderUI function, passing in the 4 key parameters: `renderUI(el, question, response, state)` 

- [ ] finally we can delete the [placeholder on line 30](https://github.com/Learnosity/custom-questions-skeleton/blob/master/demos/custom-question-skeleton/src/question/index.js#L30) since we now have our question content rendered. 

Our resultant question UI should look something like this:
![Step 5 image](https://raw.githubusercontent.com/michael-fares-lrn/custom-questions-skeleton-tutorial/main/images/Step5.png "Question UI as of step 5")


:rocket: [Step 5 Cheat Commit](https://github.com/michael-fares-lrn/custom-questions-skeleton-tutorial/commit/94b230543f808099ed70a3b3272d5083a675a30b)

## Step 6: Saving responses via the `handleEvents()` function  


 We will handle the saving of our responses inside of the `handleEvents()` function in `src/question/index.js`. At the top of the function, [replace these lines](https://github.com/Learnosity/custom-questions-skeleton/blob/master/demos/custom-question-skeleton/src/question/index.js#L78-L81) with the following code, and note the comments:  

```javascript
src/question/index.js @`handleEvents() function`:
        // we are going to need all of these properties eventually, so let's desctructure them now
        const { events, el, init } = this;
        const { question } = init; 
     
        // first we will access the runtime facade of our custom question
        // this is important, because we are going to call the getResponse() method on this facade
        // after saving our responses to verify that Questions API has picked them up and saved them.
        const facade = init.getFacade();

        // get an HTML collection of the choices in our question
        const choices = el.querySelectorAll(`input[type="radio"]`);

        // for each choice in the collection, add a click event listner to detect a change in the choice the user clicks
        choices.forEach((choice) => {
            choice.addEventListener("click", (event) => {
                // whenever the user clicks a choice radio button input, 
                // we will set the "value" of the questions response
                // to the value of the clicked input (event.target.value)
                // this will allow for easy comparision between valid_response.value and response.value when we 
                // work on scoring the question later
                let responseObject = { value: event.target.value };
                /**
                 * IMPORTANT: we now must MAKE SURE TO TRIGGER a "changed" event 
                 * in order to tell the Questions API to register whenever there is a change to the repsonse object
                 * above. This tells Questions API that the user has changed their response and to keep track of the current response
                 */
                events.trigger("changed", responseObject);
                
                // Finally, lets call getResponse() on the runtime facade of our question, to make sure we see an output
                console.log("You clicked a choice! The current response is: ", facade.getResponse());
                // if questions API has sucessfully picked up the learner's changed repsonse
                // then when clicking on "Choice A - Denver" in our question, 
                // we should see the following logged to the console:
                /************************************************************
             
                {
                    "value": {
                        "value": "0"
                    },
                    "type": "object",
                    "apiVersion": "v2.194.3-rc.7",
                    "revision": 1
                }
                 *************************************************************/
                /**
                 * NOTE that the TOP level "value" object is a default object applied by the Questions API getResponse() method
                 * to responses that are saved via triggering the "changed" event above.
                 * The NESTED value object here (value.value) is the value of the choice the learner picked.
                 *  we will work directly with this nested value property above and compare it to the valid_response object on
                 * our custom question when implementing the scoring logic in src/scorer/index.js
                 */

            });
        });

```  
:rocket: [Step 6 Cheat Commit](https://github.com/michael-fares-lrn/custom-questions-skeleton-tutorial/commit/e24cd9e53789dd1907fecca316c1b922582b9b5c)

Step 6 FINAL NOTE: The `handleEvents()` function is also going to handle the question's `validate` event [here](https://github.com/Learnosity/custom-questions-skeleton/blob/c1eb549f37ad54534ee0dc0bfb9cfbf4efac1a3a/demos/custom-question-skeleton/src/question/index.js#L79), where we will choose what kind UI feedback should be displayed to the learner based on whether their answer was correct or incorrect after they press the "Check Answer" button.  

Before we can do this, however, we need to write some scoring logic for our question in `src/scorer/index.js` so that Questions API can know if the answer the user provided matches the question's correct answer `valid_response` - or not.  


## Step 7: Writing scoring logic for our quesiton in `src/scorer/index.js`


- [ ] First, inside of the [`isValid()`](https://github.com/Learnosity/custom-questions-skeleton/blob/master/demos/custom-question-skeleton/src/scorer/index.js#L12) function in `src/scorer/index.js` We will compare the correct answer value for the question `question.valid_response.value` to the learner's given response value `response.value`, and will return `true` if they match and `false` if otherwise. Update the `isValid()` function with the following code:  


```javascript
   isValid() {
        // destructing for easy comparision of question's correct answer
        // to the learners provided response
        const { question, response } = this
          // if a response exists, and its value is equal to the value of the 
          // question's correct answer, then we will return true
           if(response && question.valid_response.value === response.value) {
            return true
        }
        // otherwise, we will return false
        return false;
    }
```  


- [ ] Next, based on the boolean return value of `isValid()`, we will fill out the `score()` and `maxScore()` functions with logic that will award our the learner score of 1 point for a correct answer (the `"score"` property we set on our question JSON in step 3), or 0 points for an incorrect answer. 

Here is what our code for these two functions should look like at the end:


```javascript
    /**
     * Returns the score of the stored response
     * @returns {number|null}
     */
     score() {
        // if the answer is correct (isValid() === true) 
        // we will return the value of maxScore() which itself returns the "score" value
        // we indicated on our question JSON (1 in this case)
        if(this.isValid()) {
            return this.maxScore()
        }
        // otherwise we will return a score of 0
        return 0;
    }

    /**
     * Returns the possible max score of the stored response
     * @returns {number}
     */
    maxScore() {
        // return the "score" value
        // we indicated on our question JSON (1 in this case)
          return this.question.score
    }
```  

:rocket: [Step 7 Cheat Commit](https://github.com/michael-fares-lrn/custom-questions-skeleton-tutorial/commit/ecfa32fa2a64ae07bddc4e360bbf73fb55d659d0)

Step 7 final note: For this example we did NOT need to make any changes to the the [`validateIndividualResponses()`](https://github.com/Learnosity/custom-questions-skeleton/blob/master/demos/custom-question-skeleton/src/scorer/index.js#L26-L29) function, because our custom multiple choice question only has one possible response. If your custom question has multiple responses then you could leverage this function.

Similarly, we did NOT need to complete the [`canValidateResponse()`](https://github.com/Learnosity/custom-questions-skeleton/blob/master/demos/custom-question-skeleton/src/scorer/index.js#L56-L59) function, because our question has valid_response data and is thereby auto scorable. If your custom question is not autoscorable - such as an essay or free response type question, then this function would need to return `false`.


## Step 8: Updating the UI with visual feedback after the "Check Answer" button is pressed

 Now we will return to `src/question/index.js` and complete the logic to update the UI display when the user presses the "Check Answer" button. 
 
 When either the learner presses the Check Answer button, or you validate your custom question programatically by calling the [`validate()` public method](https://reference.learnosity.com/items-api/methods#question-Validate), this will fire a validate event.

 Therefore, completeing the callback function for the validate event is how we will display the validation feedback UI to the learner. 

 
 - [ ] First, replace [this line](https://github.com/Learnosity/custom-questions-skeleton/blob/master/demos/custom-question-skeleton/src/question/index.js#L90) with the following code:

```javascript
            // see whether the answer was correct or not by accessing the boolean value returned by the isValid() method
            // on the question facade
            const answerIsCorrect = facade.isValid();
            /**
             * update the UI based on the result
             * IMPORTANT: In both cases we need to target the element with the classname lrn_response_input
             */
            if (answerIsCorrect) {
                /** if the answer is correct we will add the Learnosity utility class lrn_correct, which will automatically show the Learnosity
                 * checkmark (tick) you are used to on regular Learnosity quesiton types
                 */
                el.querySelector(".lrn_response_input").classList.add("lrn_correct");
            } else {
                /** if the answer is incorrect we will add the Learnosity utility class lrn_incorrect, which will automatically show the Learnosity
                 * x (cross) you are used to on regular Learnosity quesiton types
                 */
                el.querySelector(".lrn_response_input").classList.add("lrn_incorrect");
            }
``` 

- [ ] Next, to complete the feedback UI display logic, we also need to reset the feedback UI if a user changes their answer. We will do so by returning to the 'click' event listener we set up for our radio button inputs in Step 6 above. We will now add these two lines which will remove the `lrn_correct` or `lrn_incorrect` classnames from our response area when the user changes their response after having pressed "Check Answer", thereby clearing and reseting the feedback UI.

```javascript
// click event listener set up in step 6
choices.forEach((choice) => {
            choice.addEventListener("click", (event) => {
                /** ADD THESE TWO LINE to clear the feedback UI whenever the user changes their answer 
                 * After having previously pressed "Check Answer"
                */
                el.querySelector(".lrn_response_input").classList.remove("lrn_correct");
                el.querySelector(".lrn_response_input").classList.remove("lrn_incorrect");

                // whenever the user clicks a choice radio button input, 
                // we will set the "value" of the questions response
                // to the value of the clicked input (event.target.value)
                // this will allow for easy comparision between valid_response.value and response.value when we 
                // work on scoring the question later
                let responseObject = { value: event.target.value };
                ...
```
Our resultant question UI should look something like this when pressing "Check Answer" for the correct answer:
![Step 8 image valdiation UI](https://raw.githubusercontent.com/michael-fares-lrn/custom-questions-skeleton-tutorial/main/images/Step8.1.png "Correct answer UI after pressing Check Answer")
And like this for an incorrect answer:
![Step 8 image valdiation UI](https://raw.githubusercontent.com/michael-fares-lrn/custom-questions-skeleton-tutorial/main/images/Step8.2.png "Incorrect answer UI after pressing Check Answer")



:rocket: [Step 8 Cheat Commit](https://github.com/michael-fares-lrn/custom-questions-skeleton-tutorial/commit/4bbce89cadcd5cebad17829aabafd81275821ab1)

## Step 9: Showing the correct answers to the learner when the "Check Answer" button is pressed.

You can optionally show correct answers by leverging [suggestedAnswersList](https://help.learnosity.com/hc/en-us/articles/360000758817-Creating-Custom-Questions-#:~:text=SuggestedAnswersList), whose `setAnswers()` method takes in a string displaying the text of the correct answer. 

We will implement this method inside of the same validate event callback function from step 8 above.

- [ ] first, append the following code onto the end of the validate event callback function

```javascript
            // let's first do some destructuring so we can 
            const { choices, valid_response } = question
            // compare the picked choice value to the valid response value more easily 
            const correctAnswer = choices.find(choice => choice.value === valid_response.value)
            /*** we will now show the correct answer if the users answer was incorrect */
            if (!answerIsCorrect && options.showCorrectAnswers) {
                    // show the label text string (correctAnswer.label) of the choice whose choice number string (value) 
                    // matches the choice number string defined in valid_response.value
                    this.suggestedAnswersList.setAnswers(correctAnswer.label);
            }
```  
 next, to complete the feedback UI display logic, we now also need to reset the correct answer display if a user changes their answer, similar to how we did in step 8 in the case of the green checkmark/red x validation UI.

 - [ ] To reset the correctAnswer display, return to the 'click' event listener we set up for our radio button inputs. We will now add one more line of code which will use the `suggestsAnswersList`'s `reset()` method to remove the correct answer display when the user changes their response after having pressed "Check Answer"

```javascript
/*** change event listener as of Step 8 */
 choices.forEach(choice => {
            choice.addEventListener('change', (e) => {

                el.querySelector('.lrn_response_input').classList.remove('lrn_correct')
                el.querySelector('.lrn_response_input').classList.remove('lrn_incorrect')

                /************** NOW ADD THIS LINE ****************/
                this.suggestedAnswersList.reset()

```
Now our resultant question UI should look something like this when pressing "Check Answer" for an incorrect answer:
![Step 9 showing the correct answer](https://raw.githubusercontent.com/michael-fares-lrn/custom-questions-skeleton-tutorial/main/images/Step9.png "Example of showing the correct answer in the UI after pressing Check Answer")

:rocket: [Step 9 Cheat Commit](https://github.com/michael-fares-lrn/custom-questions-skeleton-tutorial/commit/801a6f35c72139de218f2db674048fe116a6592c)

Step 9 final note: For custom questions with multiple correct answers, you can also pass an array of objects into this method, each object containing an `index` key of type `number` for the 0-based index of the correct answer, and a `label` key of type `string` for the text of the correct answer. So, for a hypothetical question with 3 correct answers, you might pass the following array into `setAnswers()`:
```javascript
[
    {index: 0, label: "correct answer 1"},
    {index: 1, label: "correct answer 2"},
    {index: 2, label: "correct answer 3"}
]
```

## Step 10: Handling "resume" and "review" states for our custom question

When a learner saves their answer to the custom question, we need to populate our question UI with the saved answer when
- the learner comes back to resume the assessment (`resume` state)
AND/OR
- the learner has completed the assessment and now is viewing their results (`review` state)

We will handle that in this step. To do so, we will return to our `renderUI` compenent function in `src/question/renderUI.js` and now use the previsouly unread `response` and `state` arguments to update the UI accordingly if there is a saved response in either resume or review state.

- [ ] After [this line](https://github.com/michael-fares-lrn/custom-questions-skeleton-tutorial/blob/5b813aa3ff7d8ea55b7320eec67bc8aecd3ba103/demos/simple-multiple-choice-tutorial/src/question/renderUI.js#L51), in `src/question/renderUI.js`, insert the following `if` statement.

```javascript
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
```
If the above was successful, then the resulting UI should look like this when pressing "save answers" and then choosing to enter "resume" state:  


![Step 10 Resume and Review States](https://raw.githubusercontent.com/michael-fares-lrn/custom-questions-skeleton-tutorial/main/images/resumereview.gif "Updating the UI with the saved answer in resume")  





And like this when doing the same but choosing to enter "review" state:    


![Step 10 Resume and Review States](https://raw.githubusercontent.com/michael-fares-lrn/custom-questions-skeleton-tutorial/main/images/resumereview2.gif "Updating the UI with the saved answer in resume and review")  

Note also that in the case of review state, questions API will automatically fire the 'validate' event, so we now see the validation UI implemented in step 8 and step 9 above.

:rocket: [Step 10 Cheat Commit](https://github.com/michael-fares-lrn/custom-questions-skeleton-tutorial/commit/28a7209c2868d0d93ce25a68d2898ccfa2c86c13)

Step 10 Final Note: Refer to [Questions API States](https://help.learnosity.com/hc/en-us/articles/360000758817-Creating-Custom-Questions#questions-api-states) for additional information and examples 

## Step 11: Disabling the question UI when in `review` state: implementing the `disable()` public method.

Now that we have updated our UI to show the saved learner response in `resume` and `review` states, there is one more step to implement for `review` state here: disabling the question UI to prevent learner interaction with the question.

- [ ] First, note with special attention [these lines](https://github.com/Learnosity/custom-questions-skeleton/blob/master/demos/custom-question-skeleton/src/question/index.js#L14-L16) that come by default with the custom-questions-skeleton, and whose purpose is to automatically call the `disable()` method on our question facade when in `review` state.

- [ ] Our purpose in this step is therefore to actually implement the `disable()` public method [located here](https://github.com/Learnosity/custom-questions-skeleton/blob/master/demos/custom-question-skeleton/src/question/index.js#L59) within the `registerPublicMethods()` function.

- [ ] First for simplicity in finding radio buttons to disable, we will destructure `el` as well on [this line](https://github.com/Learnosity/custom-questions-skeleton/blob/master/demos/custom-question-skeleton/src/question/index.js#L55): `const { init, el } = this;`

- [ ] Next, fill out the `disable()` method with the following code:

```javascript
facade.disable = () => {
            // mark that the current question instance (this) is disabled
            this.disabled = true;
            // give each radio button input in our multiple choice list an
            // html attribue of "disabled"
            el.querySelectorAll('input').forEach(input => input.disabled = true);

            // add a classname of disabled to our response area and the choices therein
            // to allow for further CSS styling for when our question is disabled
            /** NOTE: the CSS declaration we will use for the disabled class will be covered in a subsequesnt step on styling our custom quesiton */
             el.querySelector('.lrn_response_input').classList.add('disabled');
             el.querySelectorAll('label').forEach(label => label.classList.add('disabled'));
            
        };
```
NOTE: the classname `disabled` we are adding here will be covered further in the step 13 on styling below.

- [ ] Finally, we also need to implement the `enable()` public method, this is so in case you want to call `disable()` programatically our your custom question facade in a context other than review, you will also be able to undo the effects of disable by calling `enable()`.

```javascript
facade.enable = () => {
            // Undo everying specified in facade.disable() above.
            this.disabled = false;
            el.querySelectorAll('input').forEach(input => input.disabled = false);
            el.querySelector('.lrn_response_input').classList.remove('disabled');
            el.querySelectorAll('label').forEach(label => label.classList.remove('disabled'));

        };
```

:rocket: [Step 11 Cheat Commit](https://github.com/michael-fares-lrn/custom-questions-skeleton-tutorial/commit/46658eb73c09df76b6b386ea7b3a14796e0674df)


## Step 12: Implementing the `resetResponse()` public method.
If you want your custom question to support the [`resetResponse()`](https://reference.learnosity.com/items-api/methods#questionsApp-ResetResponse) public method, you need to build your own logic to implement the features of this method. 

The purpose of this step is to demonstate one possible simple implementatio of `resetResponse()` for this custom multiple choice question example.

- [ ] Replace the `resetResponse()` placeholder method with the following code:
```javascript
facade.resetResponse = () => {
            // use the getResponse() method to read the stored response value (value of the picked choice)
            const existingResponseBeforeReset = facade.getResponse().value

            // trigger a 'resetResponse' event to reset the value of response
            this.events.trigger('resetResponse');

            // reset other states if you need
            // here, if a response existed before resetResponse() was called
            // then we reset the radio button matching that response by setting its checked property to false 
            if(existingResponseBeforeReset) {
                el.querySelector(`input[value="${existingResponseBeforeReset.value}"]`).checked = false
            }

            // re-render the component, manage the 'reset' state by yourself
            /**
             * NOTE: for this simple example and custom question usecase, there is no need to re-render the component.
            */
            
        };
```


:rocket: [Step 12 Cheat Commit](https://github.com/michael-fares-lrn/custom-questions-skeleton-tutorial/commit/456d025e2d6eefbb7a52390d8349b0ec7f39647d)


## Step 13: Styling our custom question
Now that we have the logic and behavior of our custom question implemented, it's time to add some styling.
A simple way to incorporate your own CSS styling rules into your custom question is to leverage the `scss` folder, whose `main.scss` file will output to `question.css` in the `dist` folder.

- [ ] in the `scss` create a new file called `_myCustomStyles.scss`
- [ ] inside of the file, write the CSS rules you wish to use for this custom question. Here are the CSS rules used to style this example question: 

```scss
scss/_myCustomStyles.scss

// determine how our UI should look in review state when disabled() method is called on our question
// we do this by addeing a class of 'disabled' to our question response area, and to the choice labels
// here, we will change the style of the cursor only when the question is disabled
// we will use javascript in src/question/index.js to apply the 'disabled' attribute to our radio button inputs
.lrn_response_input.disabled, .lrn_response_input label.disabled {
    cursor: not-allowed;
}
// we will add some basic styling to improve the spacing between our radio buttons and labels
.option-container {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1rem;
    padding: 0.5rem;
    width: 100%;
    box-sizing: border-box;
}
// more basic styling to increase the size of the radio buttons 
.option-container input {
    transform: scale(1.5);
}
// apply a simple blue underline to the option that is picked
.option-container input:checked+label {
    box-shadow: 0 5px 0 royalblue;
}
// include a simple transition effect for the option that is picked
// and include a pointer cursor
.option-container input, .option-container label {
    cursor: pointer;
    transition: ease all 0.2s;
}
```

- [ ] next, in `scss/main.scss` import the above styles by adding the following rule and import statement below directly after line 1:

```scss
@import "variables";
// ADD the following to import the style rules written in _myCustomStyles.scss above:
.lrn-custom-question {
    @import "myCustomStyles";
}
```
:rocket: [Step 13 Cheat Commit](https://github.com/michael-fares-lrn/custom-questions-skeleton-tutorial/commit/660a330ede2aea50590f2438b9a1218c3d6d19c1)

## Step 14 - Using our custom question in Authoring

### Step 14 overview
The goal of this step is make the custom question we have just developed in steps 1-13 into a reusable template whereby different versions of the same question type can be authored, edited, saved, and then added to an item via the Learnosity Author Site or Author API, making our custom question deliverable via Items API and accross the rest of the Learnosity Golden Path ecosystem just like any out of the box Learnosity question type.

- This step is broken down into checklist of substeps, each with it's own separate cheat commit along the way
- For all substeps we will work in the following 2 files only:
1.  `authoring.php` - This file will control how our custom question is abstracted as an editable and reusable template for authoring that shows up as its own tile on the Author Site or Author API just like a regular Learnosity question type. In this file we will focus <strong>only</strong> on the [`init_options` object for the quesitonEditorAPI instance inside of Author API - located on this line](https://github.com/Learnosity/custom-questions-skeleton/blob/master/demos/custom-question-skeleton/authoring.php#L9). (See the Author API initilization documentation on [`config.dependencies.question_editor_api_.init_options` here](https://reference.learnosity.com/author-api/initialization#config_dependencies_question_editor_api) for additional information.)
2. `authoring_custom_layout.html` - This file will define the layout of the question editor pane for our custom question.

#### Step 14.1 - getting a lay of the land
- [ ] First, navigate to [`localhost:12345/authoring.php`](http://localhost:12345/authoring.php)  

- [ ] Click the "Add new" button
![Add new button](https://raw.githubusercontent.com/michael-fares-lrn/custom-questions-skeleton-tutorial/main/images/Authoring1.png "Add new button")   

- [ ] Navigate to "Other" in the left hand menu  
![Other in left hand menu](https://raw.githubusercontent.com/michael-fares-lrn/custom-questions-skeleton-tutorial/main/images/Authoring2.png "You will find the default tile for our custom question here")  

- [ ] The tile you see here is the default tile for our custom question. Click on it.  

![Default custom question tile](https://raw.githubusercontent.com/michael-fares-lrn/custom-questions-skeleton-tutorial/main/images/Authoring3.png "the default tile for our custom question")  

- [ ] In the resultant page click on the `</> Source` button.
![Source button](https://raw.githubusercontent.com/michael-fares-lrn/custom-questions-skeleton-tutorial/main/images/Authoring4.png "Source button which will show the soon to be editable default JSON source of our question template")   

Note that the Source JSON there:
```json
{
    "type": "custom",
    "stimulus": "This is stimulus",
    "js": {
        "question": "/dist/question.js",
        "scorer": "/dist/scorer.js"
    },
    "css": "/dist/question.css",
    "instant_feedback": true,
    "custom_type": "custom_question_skeleton",
    "version": "v1.0.0"
}
```
Is the exact same as the JSON that comes predefined in the [`"defaults"` object in `assessment.php` here](https://github.com/Learnosity/custom-questions-skeleton/blob/master/demos/custom-question-skeleton/authoring.php#L16-L25)

Instead of having our tile generically called "Custom Question - Skeleton" and grouped under the generic "other" category in the left hand menu that we need to click all the way through to reach our authoring workflow, let's create a custom menu category into which we can place and rename the tile for our question for easy discovery by our authors. The next two substeps (14.2 and 14.3) will cover this workflow.

### Step 14.2 Creating a custom menu category for our custom question tile
 First, let's create a menu category called "Company X Custom Questions" that we will group this custom question under, and any future custom questions we might develop. 

- [ ] In `authoring.php` directly under [this line](https://github.com/Learnosity/custom-questions-skeleton/blob/master/demos/custom-question-skeleton/authoring.php#L9) we will add the following array called `"question_type_groups"`, where we can place an object to indicate our preferred menu category `"name"` ("Company X Custom Questions") in this example, and a unique`"reference"` we can use to place individual custom questions in this group. (We'll use the reference "company_x_custom_questions" in this example).

```json
 "question_type_groups": [
            {
                "name": "Company X Custom Questions",
                "reference": "company_x_custom_questions"
            }
          ],
```
- [ ] Next, in the `question_type_templates` object which contains the authoring template for the custom question skeleton we are using here, we need to change the `"group_reference"` key [here](https://github.com/Learnosity/custom-questions-skeleton/blob/master/demos/custom-question-skeleton/authoring.php#L15) to `"company_x_custom_questions"` so that it matches the `"reference"` key we specified on the object above. 

If successful, then you should now see the following when looking at `authoring.php` in the broswer:  


![Custom category](https://raw.githubusercontent.com/michael-fares-lrn/custom-questions-skeleton-tutorial/main/images/Authoring5.gif "Creating a custom menu category for our custom question tile")   

:rocket: [Step 14.2 Cheat Commit](https://github.com/michael-fares-lrn/custom-questions-skeleton-tutorial/commit/51844df821db1dea733c7b281bc32063d9028673)

### Step 14.3 Renaming our custom question tile and customizing its description
We can easily rename our custom quesiton tile and change its description by [changing the values of the `"name"` and `"description"` keys located here](https://github.com/Learnosity/custom-questions-skeleton/blob/master/demos/custom-question-skeleton/authoring.php#L13-L14), respectively.

In this example, we've changed them to the following to suit the theme of our tutorial:

```json
    {
        "name": "Custom Simple Multiple Choice Question - AUTHORING EXAMPLE",
        "description": "Demonstrates an example of setting up authoring for a custom question type",
        ........
    }
```

The resulting UI now looks like this:

![Custom tile](https://raw.githubusercontent.com/michael-fares-lrn/custom-questions-skeleton-tutorial/main/images/Authoring6.png "Changing the name and description of the custom question tile")   

:rocket: [Step 14.3 Cheat Commit](https://github.com/michael-fares-lrn/custom-questions-skeleton-tutorial/commit/ab662b59ccfe760facaa0fff70f24941b2135744)

### Step 14.4 creating a default authoring start tempate for this question type based on its JSON
Now that we've categorized and named our custom question tile to appear on the Author Site or Author API per our business logic and the needs of our future authors, let's actually create the default JSON template for a "blank" Simple Multiple Choice Custom question that can be authored.  

We will do so by using the [`"defaults"` object here](https://github.com/Learnosity/custom-questions-skeleton/blob/master/demos/custom-question-skeleton/authoring.php#L16) and adding to it generic placeholder versions of the same properties we added to our custom question JSON in steps 1 - 3 of this tutorial: `"stimulus", "valid_response"`, `"choices"`,  `"score"`:

```json
"defaults": {
    ...
    "stimulus": "[Your question here]",
    "valid_response" : {
        "value" : ""
    },
    "choices" : [
        {"label": "CHOICE A", "value": "0"},
        {"label": "CHOICE B", "value": "1"},
        {"label": "CHOICE C", "value": "2"},
        {"label": "CHOICE D", "value": "3"}
    ],
    "score" : 1,
    ...
}
```
:rocket: [Step 14.4 Cheat Commit](https://github.com/michael-fares-lrn/custom-questions-skeleton-tutorial/commit/7f4545f6b863eac6a15a30264d9f2b2abe66041c)

Step 14.4 Final Notes:  

As of this step, the UI should look like this:

![Default template](https://raw.githubusercontent.com/michael-fares-lrn/custom-questions-skeleton-tutorial/main/images/Authoring7.png "Default custom question template")

But wait? How come we can only edit the `"stimulus"` portion of our question JSON via the question editor currently?:

![Stimulus only editing](https://raw.githubusercontent.com/michael-fares-lrn/custom-questions-skeleton-tutorial/main/images/Authoring8.gif "Until we add other properties to our editor schema, we can only edit the stimulus.")

How can we also enable editing the `"valid_response"`, `"choices"`, and `"score"` for a new Simple Custom Multiple Choice question?

The answer is that we first need add and define these properties on the [`"editor_schema"` `"properties`" object here](https://github.com/Learnosity/custom-questions-skeleton/blob/master/demos/custom-question-skeleton/authoring.php#L41-L43). 

We next need to add the relevant HTML hooks to `authoring_custom_layout.html` to make a Learnosity UI editing widget available for that property in the question editor, [just like the HTML hook for the "stimulus" that is already present in the file](https://github.com/Learnosity/custom-questions-skeleton/blob/master/demos/custom-question-skeleton/authoring_custom_layout.html#L2-L3) by default.

We are going to cover how to do this in the final two substeps (14.5 and 14.6).

### Step 14.5 configuing the editor schema for our question JSON template to enable editing it's properties directly:

First, let's make it so that our authors can edit the choices.

- [ ] In `authoring.php`, inside of the `"properties"` object, add the following object, which defines the type and behavior of `"choices"` in our editor schema.

```json
"choices": {
                      "name": "Define the choices here",
                      "description": "",
                      "type": "array",
                      "required": true,
                      "items": {
                        "type": "object",
                        "attributes": {
                          "label": {
                            "type": "editor"
                          }
                        }
                      }
                    }
```
Here, we've specified that choices is an array, for which each item is an object, each of which contains an attribute of label (the text we will author for each choice). We've specified that the label has a type "editor" here, which means that each label can be authored with a Learnosity Rich Text Editor.

For additional information see our help article [Adding a Custom Layout for a Question Type](https://help.learnosity.com/hc/en-us/articles/360000755258-Adding-a-Custom-Editor-Layout-for-a-Question-Type) and note particularly "array" under "type" and "editor" under "type", as well as "items" and "attributes". 

Next, let's make it so that after our authors have created the choices for the question, they can pick which choice is the correct choice - or in other words pick the `"valid_response"`.

- [ ]  In `authoring.php`, inside of the `"properties"` object, add the following object, which defines the type and behavior of `"valid_response"` in our editor schema.

```json
"valid_response" : {
    "type" : "question",
    "name" : "Set the correct answer",
    "description" : "Correct answer for the question",
    "required": true,
    "white_list" : ["value", "choices"]
}
```
Here, we've specified that the valid_response (correct answer) is of type "question" - which means that the UI input to pick the correct answer is going to be a rendered instance of this question itself - allowing our authors to simply pick the correct choice, just as you are used to in a regular Learnosity mcq question type.

IMPORTANT: using the `"white_list"` array, we have also whitelisted the "choices" array of the question JSON, as well as the corresponding "value" for each choice - the number string of the correct choice.

This will ensure that once our authors pick the choice that is the correct answer, it's value will be set directly to `valid_response.value` in our question JSON. 

For additional detail see our help article [Adding a Custom Layout for a Question Type](https://help.learnosity.com/hc/en-us/articles/360000755258-Adding-a-Custom-Editor-Layout-for-a-Question-Type) and note particularly "question" under "type", as well as "white_list" 

Finally, let's make it so that our authors can edit the score of our custom question, in case they wish to assign a point value other than "1" for this question.

 - [ ] Once again, in `authoring.php`, inside of the `"properties"` object, add the following object, which defines the type and behavior of `"score"` in our editor schema for this custom question.

 ```json
"score" : {
    "type" : "number",
    "name": "Score",
    "description": "Score for a correct answer.",
    "required": true
}
 ```

Here, we've specified that the score property that our authors can edit is of type number.

For additional detail see our help article [Adding a Custom Layout for a Question Type](https://help.learnosity.com/hc/en-us/articles/360000755258-Adding-a-Custom-Editor-Layout-for-a-Question-Type) and note particularly "number" under "type".

:rocket: [Step 14.5 Cheat Commit](https://github.com/michael-fares-lrn/custom-questions-skeleton-tutorial/commit/8accacd22de2dbb1a3df6e2c3dcd5ac74d7858bf)

### Step 14.6 hooking our editor schema up to the question editor UI using `authoring_custom_layout.html`

In this step, we simply need to add the appropriate HTML input hooks and their respective labels to `authoring_custom_layout.html`, so that these editing widgets will show up in the question editor UI for our authors.

- [ ] [On this line](https://github.com/Learnosity/custom-questions-skeleton/blob/master/demos/custom-question-skeleton/authoring_custom_layout.html#L4), add the following 3 blocks of HTML, whose respective `data-lrn-qe-label` and `data-lrn-qe-input` attributes correspond direclty to the three editiable JSON properties we have defined in our editor schema in substep 14.5: `"choices"`,`"valid_response"`, and `"score"`, respectively:

```html
    <!-- Question editor UI for editing the choices
     this corresponds directly to the "choices" editor schema object - of type array -
    we defined in editor_schema.properties in authoring.php -->
    <span data-lrn-qe-label="choices"></span>
        <!-- NOTE: since "choices" is of type "array" we use the data-lrn-qe-loop attribute 
        in order to loop through each choice and expose its label property as an editable 
        input-->
    <div data-lrn-qe-loop="choices[*]">
        <span data-lrn-qe-input="choices[*].label"></span>
    </div>

      <!-- Question editor UI for setting the correct answer
     this corresponds directly to the "valid_response" editor schema object - of type "question" - 
    that we defined in editor_schema.properties in authoring.php -->
    <span data-lrn-qe-label="valid_response"></span>
    <span data-lrn-qe-input="valid_response"></span>

<!-- Question editor UI for setting the correct answer
    this corresponds directly to the "score" editor schema object - of type "number" - 
    that we defined in editor_schema.properties in authoring.php -->
    <span data-lrn-qe-label="score"></span>
    <span data-lrn-qe-input="score"></span> 
```

For additional information and detail on Learnosity HTML question editor component hooks like we have used above, please see [Editor Layout Components](https://help.learnosity.com/hc/en-us/articles/360000755258-Adding-a-Custom-Editor-Layout-for-a-Question-Type#editor-layout-components) in our help article on Adding a Custom Editor Layout for a Question Type.
 
:rocket: [Step 14.6 Cheat Commit](https://github.com/michael-fares-lrn/custom-questions-skeleton-tutorial/commit/a5f5d875be35dc7f4feb6612258a10d7bf069b52)

And that's it! If all was successful with Step 14, you should now be able to fully author, edit, save, and preview a new Custom Multiple Choice Question:


![Full question editing](https://raw.githubusercontent.com/michael-fares-lrn/custom-questions-skeleton-tutorial/main/images/Authoring9.gif "The final result of step 14 - authoring, saving, and previewing a new instance of our custom question")
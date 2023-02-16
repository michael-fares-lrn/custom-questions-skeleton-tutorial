import { PREFIX } from './constants';
import { renderUI } from './renderUI'; 

export default class Question {
    constructor(init, lrnUtils) {
        this.init = init;
        this.events = init.events;
        this.lrnUtils = lrnUtils;
        this.el = init.$el.get(0);

        this.render().then(() =>{
            this.registerPublicMethods();
            this.handleEvents();

            if (init.state === 'review') {
                init.getFacade().disable();
            }

            init.events.trigger('ready');
        });
    }

    render() {
        const { el, init, lrnUtils } = this;
        const { question, response, state } = init;

        // IMPORTANT: the element <div class="lrn_response_input"></div> below is the parent elememt hook
        // for all of your questions content to be rendered into
        // it is managed for you by the renderUI function called on line 50 below

        // TODO: in the file renderUI.js, fill out the body of this function with the custom logic 
        // to render your question's components.
        el.innerHTML = `
            <div class="${PREFIX} lrn-response-validation-wrapper">
                <div class="lrn_response_input">
                    AFTER YOU FILL OUT THE renderUI FUNCTION in <code>./src/question/renderUI.js</code>
                    YOUR QUESTION'S RESPONSE AREA UI SHOULD SHOW UP HERE 
                    - YOU CAN DELETE THIS PLACEHODER LINE AFTERWARDS
                </div>            
                <div class="${PREFIX}-checkAnswer-wrapper"></div>
                <div class="${PREFIX}-suggestedAnswers-wrapper"></div>
            </div>
        `;

        // Optional - Render optional Learnosity components like Check Answer Button, Suggested Answers List
        // first before rendering your question's components
        return Promise.all([
            lrnUtils.renderComponent('SuggestedAnswersList', el.querySelector(`.${PREFIX}-suggestedAnswers-wrapper`)),
            lrnUtils.renderComponent('CheckAnswerButton', el.querySelector(`.${PREFIX}-checkAnswer-wrapper`))
        ]).then(([suggestedAnswersList]) => {
            this.suggestedAnswersList = suggestedAnswersList;

            renderUI(el, question, response, state)
        });
    }

    /**
     * Add public methods to the created question instance that is accessible during runtime
     *
     * Example: questionsApp.question('my-custom-question-response-id').myNewMethod();
     */
    registerPublicMethods() {
        const { init } = this;
        // Attach the methods you want on this object
        const facade = init.getFacade();

        facade.disable = () => {
            // TODO: Requires implementation
        };
        facade.enable = () => {
            // TODO: Requires implementation
        };
        facade.resetResponse = () => {
            // TODO: Requires implementation, you could use the following steps

            // trigger a 'resetResponse' event to reset the value of response
            // this.events.trigger('resetResponse');

            // reset other states if you need

            // re-render the component, manage the 'reset' state by yourself
        };
    }

    handleEvents() {
        const { events, el, init } = this;


        let learnerResponse;
        /**
         * the above learnerReponse variable has been included for you as a placeholder varible 
         * to help in saving the learner response to your custom question.
         * 
         * as the learner changes their response to the question, make sure that you update this variable accordingly  
         * 
         * When updated, this variable should be either:
         * 
         * a STRING, if your question takes in a single response like the string value of a text input
         *     - e.g. learnerResponse = el.querySelector('input').value
         * 
         * Or and OBJECT, if your question involves multiple response points. Say for simple example you 
         * are creating a question that asks a student to determine the x and y coordinates of a point on a graph.
         * Then learnerResponse might look something like this:
         *    -e.g. learnerResponse =  {
         *                              xCoordinate: someValue,
         *                              yCoordinate: someOtherValue
         *                         }
         * 
         *
         */


        /** IMPORTANT: you MUST trigger a changed event on the learnerResponse to make sure that Questions API will
         * save the learners response each time it changes. The following code does so automatically for you.
         */
        events.trigger('changed', learnerResponse);

        /**
         * the following code logs the value of a saved response for you automatically 
         * by calling the .getResponse() public method on your custom question
         * if this method returns the learnerResponse you have saved above, then you know that 
         * your saving the response has been successful
         * if this method returns 'undefined' then the learnerResponse did not get saved and you should check your code again
         */
        console.log("the current saved response is", init.getFacade().getResponse().value) // should NOT return undefined if the learnerResponse was saved sucessfully


        // The "validate" event below is triggered when Check Answer button is clicked or when public method .validate() is called
        // So here, we will decide how to update the UI the check answer button is pressed.
        // NOTE: the code below automatically handles adding the standard Learnosity validation UI (red x for incorrect answer, green check for correct) for you,
        // as well as removing it should the learner change their response after having already pressed the check answer button on a previous respose
        // the code below also provies an optional example of showing the correct answer to the learner if the response they provided was incorrect  
        events.on('validate', options => {

            /** Automatically see whether the answer was correct or not by accessing the boolean value returned by the isValid() method 
             * NOTE you need to implement this method in scorer/index.js
            */
            const answerIsCorrect = init.getFacade().isValid()
            /** automatically update show the stock Learnosity tick/cross validation UI when the check answer button is pressed */
            if (answerIsCorrect) {
                el.querySelector(".lrn_response_input").classList.add("lrn_correct");
            } else {
                el.querySelector(".lrn_response_input").classList.add("lrn_incorrect");
            }
            /***************************************************************************************************************** */

            if (!answerIsCorrect && options.showCorrectAnswers) {
                /** show the correct answer(s) if the answer the learner gave was not correct.
                 * if the answer was incorrect and you want to show the correct answer then you need to implment the setAnswers() method below
                 * 
                 * If there is one correct answer for your quesiton, then pass that correct answer as a string into setAnswer()
                 * See the varibale singleCorrectAnswerString below for an example
                 * 
                 * If there are multiple correct answers for your question, then pass them as an array of objects 
                 * each object should have 2 keys: index (the number of the answer), and label (the actual text you would like to display for the answer
                 * 
                 * */ 
                const singleCorrectAnswerStringExample = "This is a single correct answer string example";

                const multipleCorrectAnswerArrayExample = [
                    {index: 0, label: "This is the 1st correct answer"},
                    {index: 1, label: "This is the 1st correct answer"},
                    {index: 2, label: "This is the 1st correct answer"}
                ]
                /* TODO - OPTIONAL - If you want to show the correct answer(s) to your quesiton
                then you need to pass the string or array of the correct answer(s) for your quesion into the following method. */
                this.suggestedAnswersList.setAnswers( singleCorrectAnswerStringExample || multipleCorrectAnswerArrayExample );
           }           
        });
        /* automatically listen for when there is a change to the learners response, 
        and if the validation UI is already showing
        then remove it automatically */
        events.on('changed', () => {
            /** If the learner has already pressed the check answer button but now
             * changes their answer, automatically remove the stock Learnosity tick/cross validation UI */ 
            el.querySelector(".lrn_response_input").classList.remove("lrn_correct");
            el.querySelector(".lrn_response_input").classList.remove("lrn_incorrect");
            /** and autmatically remove the correct answer list if developer has chosten to display the correct answers */
            if (this.suggestedAnswersList) {
                this.suggestedAnswersList.reset()
            } 
        })
    }
}

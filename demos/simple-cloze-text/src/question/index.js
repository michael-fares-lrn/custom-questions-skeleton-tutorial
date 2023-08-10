import { PREFIX, RESPONSE_REGX, CLASS_NAMES } from './constants';

export default class Question {
    constructor(init, lrnUtils) {
        this.init = init;
        this.events = init.events;
        this.lrnUtils = lrnUtils;
        this.el = init.$el.get(0);

        this.render().then(() =>{
            this.registerPublicMethods();
            this.handleEvents();

            const { state, response } = init
            const { el } = this 
             
            if ((state === 'resume' || state === 'review') && response) {
                     console.log("response in resume/review", response)
                    Array.from(el.querySelectorAll('.response-input')).forEach((input, index) => {
                        input.value = init.response[index]
                    }) 
            }
            if(state === 'review') init.getFacade().disable();
            

            init.events.trigger('ready');
        });
    }

    render() {
        const { el, init, lrnUtils } = this;
        const { question, response } = init;

        // TODO: Requires implementation
        el.innerHTML = `
            <div class="${PREFIX} lrn-response-validation-wrapper">
                <div class="lrn_response_input">
                    
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
            // select the response area
            const responseArea = el.querySelector('.lrn_response_input');
            // split the question.text into an array on space as a delimiter
            // map over it, and insert the words or an input for a {{response}} (which will match the RESPONSE_REGX)
            console.log("question", question)
            question.text.split(" ").forEach(word => {
                const isBlank = word.match(RESPONSE_REGX)
                if(isBlank) {
                    responseArea.innerHTML += `<input class="${PREFIX} response-input" type="text"></input>&nbsp;`;
                } else {
                    responseArea.innerHTML += `${word} `;
                }
            });         

        });
    }

    /**
     * Add public methods to the created question instance that is accessible during runtime
     *
     * Example: questionsApp.question('my-custom-question-response-id').myNewMethod();
     * 
     */
    registerPublicMethods() {
        const { init, el } = this;
        // Attach the methods you want on this object
        const facade = init.getFacade();
        const responseArea = el.querySelector('.lrn_response_input');
        const responseInputs = Array.from(el.querySelectorAll('.response-input'));

        facade.disable = () => {
            responseInputs.forEach(input => {
                input.setAttribute("disabled", true)
                input.classList.add("disabled")
            })
        };
        facade.enable = () => {
            responseInputs.forEach(input => {
                input.removeAttribute("disabled")
                input.classList.remove("disabled")
            })
        };
        facade.resetResponse = () => {
            responseInputs.forEach(input => { 
                console.log(input.value)
                input.value = '';
            })
            this.events.trigger('resetResponse');

        };
        facade.showValidationUI = () => {
            const fullyCorrect = facade.isValid(true).correct;
            const partialValidation = facade.isValid(true).partial
            
            if(fullyCorrect) { 
                responseArea.classList.add(CLASS_NAMES.CORRECT) 
            } else { 
                responseArea.classList.add(CLASS_NAMES.INCORRECT);
                responseInputs.forEach((input, index) => {
                    if(partialValidation[index] === true) {
                        input.classList.add(CLASS_NAMES.CORRECT)
                    } else {
                        input.classList.add(CLASS_NAMES.INCORRECT)
                    }
                })
            }

        };
        facade.resetValidationUI = () => {
            responseArea.classList.remove(CLASS_NAMES.CORRECT)
            responseArea.classList.remove(CLASS_NAMES.INCORRECT)
            responseInputs.forEach(input => {
                input.classList.remove(CLASS_NAMES.CORRECT)
                input.classList.remove(CLASS_NAMES.INCORRECT)
            })
        };
    }

    handleEvents() {
        const { events, init, el } = this;
        const facade = init.getFacade()
        const previouslySavedReponses = init.response;

        let responses = previouslySavedReponses  || [];
    
        const responseInputs = Array.from(el.querySelectorAll('.response-input'));
        responseInputs.forEach((input, index) => {
            input.addEventListener('input', (event) => {
                console.log("change to input", event.target.value)
                responses[index] = event.target.value;
                events.trigger("changed", responses)
                facade.resetValidationUI()
            })
        })
     

        // "validate" event can be triggered when Check Answer button is clicked or when public method .validate() is called
        // so developer needs to listen to this event to decide if he wants to display the correct answers to user or not
        // options.showCorrectAnswers will tell if correct answers for this question should be display or not.
        // The value showCorrectAnswers by default is the value of showCorrectAnswers inside initOptions object that is used
        // to initialize question app or the value of the options that is passed into public method validate (like question.validate({showCorrectAnswers: false}))
        events.on('validate', options => {
            const { suggestedAnswersList } = this
            const { question } = this.init
            console.log("isValid() on validate", facade.isValid(true))
            facade.showValidationUI()

   
            if (options.showCorrectAnswers && suggestedAnswersList) {
                suggestedAnswersList.reset();
                suggestedAnswersList.setAnswers(question.valid_response.map((word, index) => {
                    return { index: index, label: word }
                }));
            }
        });
    }
}

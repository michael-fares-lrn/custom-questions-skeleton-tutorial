import { PREFIX } from './constants';
import { renderUI } from './renderUI.js';

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
        const { el, init  } = this;
        const { question, response, state } = init;

        // TODO: Requires implementation
        el.innerHTML = `
            <div class="${PREFIX} lrn-response-validation-wrapper">
                <div class="lrn_response_input"></div>            
                <div class="${PREFIX}-checkAnswer-wrapper"></div>
                <div class="${PREFIX}-suggestedAnswers-wrapper"></div>
            </div>
        `;

        // Optional - Render optional Learnosity components like Check Answer Button, Suggested Answers List
        // first before rendering your question's components
        return Promise.all([]).then(() => {

            renderUI(el, question, response, state)
        });
    }

    /**
     * Add public methods to the created question instance that is accessible during runtime
     *
     * Example: questionsApp.question('my-custom-question-response-id').myNewMethod();
     */
    registerPublicMethods() {
        const { init, el } = this;
        // Attach the methods you want on this object
        const facade = init.getFacade();

        facade.disable = () => {
            this.disabled = true;
            // disbale inputs
            el.querySelectorAll(".number-input").forEach(input => {
                input.disabled = true;
            });
            el.querySelectorAll("label").forEach(label => {
                label.classList.add("disabled")
            });
            el.querySelector(".lrn_response_input").classList.add("disabled")
        
        };
        facade.enable = () => {
            this.disabled = false;

            el.querySelectorAll(".number-input").forEach(input => {
                input.disabled = false;
            });
            el.querySelectorAll("label").forEach(label => {
                label.classList.remove("disabled")
            });
            el.querySelector(".lrn_response_input").classList.remove("disabled")

        };
        facade.resetResponse = () => {
            // ** not implemented for rubric

            // trigger a 'resetResponse' event to reset the value of response
            this.events.trigger('resetResponse');

            // reset other states if you need
            // here, if a response existed before resetResponse() was called
  
            // re-render the component, manage the 'reset' state by yourself
       
            
        };
    }

    handleEvents() {
        // we are going to need all of these properties eventually, so let's desctructure them now
        const { events, el, init } = this;
        const { state } = init;

        const numberInputs = el.querySelectorAll('input[type="number"]');
        const total = el.querySelector(".total");
        let responseObject = {
            categories: {} 
        }

        numberInputs.forEach(input => {
            const min = Number(input.getAttribute("min"))
            const max = Number(input.getAttribute("max"))

            // pre-fill unused categories with 0
            if(!responseObject.categories[input.name]) {
                responseObject.categories[input.name] = 0;
            }


            // if resume
            if(state === "resume") {
                responseObject.categories[input.name] = Number(input.value);
            }

            input.addEventListener("change", (event) => {
                // use js to make number inputs actually obey min and max attributes
                if(Number(input.value) < min) {
                    input.value = min;
                }
                if(Number(input.value) > max) {
                    input.value = max;
                }

                const sumCategories = Array.from(numberInputs)
                    .map(input => Number(input.value))
                    .reduce((a, b) => a + b)

                total.innerHTML = sumCategories;

                responseObject.categories[event.target.name] = Number(event.target.value);
                responseObject.total_score = sumCategories;
                
                events.trigger("changed", responseObject)

                console.log("response object", init.getFacade().getResponse().value)
            
            })


        })

        
     
        events.on('validate', options => {
            // no check answer button for a rubric. The teacher knows the answer.
            return
        });
    }
}

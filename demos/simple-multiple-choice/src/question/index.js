import { PREFIX } from "./constants";
import { renderUI } from "./renderUI.js";

export default class Question {
    constructor(init, lrnUtils) {
        this.init = init;
        this.events = init.events;
        this.lrnUtils = lrnUtils;
        this.el = init.$el.get(0);

        this.render().then(() => {
            this.registerPublicMethods();
            this.handleEvents();

            if (init.state === "review") {
                init.getFacade().disable();
            }

            init.events.trigger("ready");
        });
    }

    render() {
        const { el, init, lrnUtils } = this;
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
        return Promise.all([
            lrnUtils.renderComponent(
                "SuggestedAnswersList",
                el.querySelector(`.${PREFIX}-suggestedAnswers-wrapper`)
            ),
            lrnUtils.renderComponent(
                "CheckAnswerButton",
                el.querySelector(`.${PREFIX}-checkAnswer-wrapper`)
            ),
        ]).then(([suggestedAnswersList]) => {
            this.suggestedAnswersList = suggestedAnswersList;

            renderUI(el, question, response, state);

            // Items API reading Item level data from inside custom question
            console.log("window from inside custom question code", window);
            console.log("window.LearnosityItems from inside custom quesiton code", window.LearnosityItems);
            
            // try to call getCurrentItem() if itemsApp IS NOT exposed via items API on the window object
            if(window.LearnosityItems) {
                console.log("itemsApp.getCurrentItem()", itemsApp.getCurrentItem());
            }
            //  try to call getCurrentItem() if itemsApp IS exposed via items API on the window object
            console.log("window.itemsApp.getCurrentItem()", window.itemsApp?.getCurrentItem());
    });
    }

    registerPublicMethods() {
        const { init, el } = this;

        const facade = init.getFacade();

        facade.disable = () => {
            this.disabled = true;

            el.querySelectorAll("input").forEach(
                (input) => (input.disabled = true)
            );

            el.querySelector(".lrn_response_input").classList.add("disabled");
            el.querySelectorAll("label").forEach((label) =>
                label.classList.add("disabled")
            );
        };
        facade.enable = () => {
            this.disabled = false;
            el.querySelectorAll("input").forEach(
                (input) => (input.disabled = false)
            );
            el.querySelector(".lrn_response_input").classList.remove(
                "disabled"
            );
            el.querySelectorAll("label").forEach((label) =>
                label.classList.remove("disabled")
            );
        };
        facade.resetResponse = () => {
            const existingResponseBeforeReset = facade.getResponse().value;

            this.events.trigger("resetResponse");

            if (existingResponseBeforeReset) {
                el.querySelector(
                    `input[value="${existingResponseBeforeReset.value}"]`
                ).checked = false;
            }
        };
    }

    handleEvents() {
        const { events, el, init } = this;
        const { question } = init;

        const facade = init.getFacade();

        const choices = el.querySelectorAll(`input[type="radio"]`);

        choices.forEach((choice) => {
            choice.addEventListener("click", (event) => {
                el.querySelector(".lrn_response_input").classList.remove(
                    "lrn_correct"
                );
                el.querySelector(".lrn_response_input").classList.remove(
                    "lrn_incorrect"
                );
                this.suggestedAnswersList.reset();

                let responseObject = { value: event.target.value };

                events.trigger("changed", responseObject);
            });
        });

        events.on("validate", (options) => {
            // when check answer is pressed, then try to show the assessment player
            // accessibility dialog from inside Items API:

            // if itemsApp IS exposed via items API on the window object:
            window.itemsApp?.dialogs().accessibility.show()

            // if itemsApp IS NOT exposed via items API on the window object
            if(window.LearnosityItems) {
                itemsApp.dialogs().accessibility.show()
            }



            const answerIsCorrect = facade.isValid();

            if (answerIsCorrect) {
                el.querySelector(".lrn_response_input").classList.add(
                    "lrn_correct"
                );
            } else {
                el.querySelector(".lrn_response_input").classList.add(
                    "lrn_incorrect"
                );
            }

            const { choices, valid_response } = question;

            const correctAnswer = choices.find(
                (choice) => choice.value === valid_response.value
            );

            if (!answerIsCorrect && options.showCorrectAnswers) {
                this.suggestedAnswersList.setAnswers(correctAnswer.label);
            }
        });
    }
}

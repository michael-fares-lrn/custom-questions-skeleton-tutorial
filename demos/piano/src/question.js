import PianoQuestion from "./question/index";
import "../scss/main.scss";

/*global LearnosityAmd*/
LearnosityAmd.define([], function () {
    return {
        Question: PianoQuestion,
    };
});

<?php
include_once '../config.php';

$responseId = "custom-$sessionId";
$request = '{
    "state": "' . $state . '",
    "session_id": "' . $sessionId . '",
    "showCorrectAnswers": true,
    "questions": [
        {
            "response_id": "' . $responseId . '",
            "type": "custom",
            "stimulus": "How well did the student perform per these categories?",
              "categories" : [
                  {"label": "Comprehension", "points": 20, "description": "Essay demonstrates clear understanding of the main idea."},
                  {"label": "Persuasiveness", "points": 20, "description": "Essay is well argued based on textual evidence."},
                  {"label": "Grammar and Mechanics", "points": 20, "description": "Essay employs correct English grammar, spelling, and punctuation."},
                  {"label": "Organization", "points": 20, "description": "Essay is well organized. Each paragraph has a clear topic sentence, and paragraphs flow together well."},
                  {"label": "Vocabulary", "points": 20, "description": "Essay demonstrates original uses of new vocabulary studied in this unit."}
              ],
              "js": {
                "question": "dist/question.js",
                "scorer": "dist/scorer.js"
              },
              "css": "dist/question.css"
          }
    ]
}';
$requestData = json_decode($request, true);

$signedRequest = signAssessmentRequest($requestData);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Questions API - Skeleton</title>
    <script src="//questions.staging.learnosity.com"></script>
    <style>
        <?php echo(file_get_contents('../sharedStyle.css')); ?>
    </style>
</head>
<body>
<div class="client-question-info">
    Response ID: <code><?php echo $responseId; ?></code>
</div>
<span class="learnosity-response question-<?php echo $responseId; ?>"></span>
<div class="client-save-wrapper">
    <span class="learnosity-save-button"></span>
</div>
<div id="redirect_response" class="client-hidden">
    Save Successful! Do you want to go to
    <button type="button" class="client-btn" data-action="resume">Resume</button> or
    <button type="button" class="client-btn" data-action="review">Review</button> mode ?
</div>
<div class="client-request-json">
    <div><b>Request init options</b></div>
    <textarea readonly></textarea>
</div>

<script>
    window.activity = <?php echo $signedRequest; ?>;

    window.questionsApp = LearnosityApp.init(activity, {
        readyListener() {
            console.log('ready');
        },
        errorListener(e) {
            console.error(e);
        },
        saveSuccess(responseIds) {
            console.log('save success', responseIds);

            // for sharedScript.js to display resume/review options
            if (window.__onSaveSuccess) {
                window.__onSaveSuccess(responseIds);
            }
        },
    });

    <?php echo file_get_contents('../sharedAssessmentScript.js'); ?>
</script>
</body>
</html>

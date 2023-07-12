<?php
include_once '../config.php';

$request = '
{
  "config": {
    "dependencies": {
      "question_editor_api": {
        "init_options": {
          "question_type_groups": [
            {
                "name": "Company X Custom Questions",
                "reference": "company_x_custom_questions"
            }
          ],
          "question_type_templates": {
            "custom_question_skeleton": [
              {
                "name": "Custom MCQ Question",
                "description": "Demonstrates an example of setting up authoring for a custom question type",
                "group_reference": "company_x_custom_questions",
                "defaults": {
                  "type": "custom",
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
                  "js": {
                    "question": "/dist/question.js",
                    "scorer": "/dist/scorer.js"
                  },
                  "css": "/dist/question.css",
                  "instant_feedback": true
                }
              }
            ]
          },
          "custom_question_types": [
            {
              "custom_type": "custom_question_skeleton",
              "type": "custom",
              "name": "Custom Question - Skeleton",
              "editor_layout": "/dist/authoring_custom_layout.html",
              "js": {
                "question": "/dist/question.js",
                "scorer": "/dist/scorer.js"
              },
              "css": "/dist/question.css",
              "version": "v1.0.0",
              "editor_schema": {
                "hidden_question": false,
                "properties": {
                    "instant_feedback": {
                      "name": "Check answer button",
                      "description": "Enables the Check Answer button underneath the question, which will provide the student with instant feedback on their response(s).",
                      "type": "boolean",
                      "required": false,
                      "default": false
                    },
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
                    },
                    "valid_response" : {
                      "type" : "question",
                      "name" : "Set the correct answer",
                      "description" : "Correct answer for the question",
                      "required": true,
                      "white_list" : ["value", "choices"]
                    },
                    "score" : {
                      "type" : "number",
                      "name": "Score",
                      "description": "Score for a correct answer.",
                      "required": true
                    }
                }
              }
            }
          ]
        }
      }
    }
  }
}
';
$signedRequest = signAuthoringRequest(json_decode($request, true));

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Author API - Skeleton</title>
    <script src="//authorapi.staging.learnosity.com"></script>
    <style>
        <?php echo(file_get_contents('../sharedStyle.css')); ?>
    </style>
</head>
<body>
<div id="learnosity-author"></div>
<div>
    <div class="client-request-json" data-type="initOptions">
        <div><b>Request init options</b></div>
        <textarea readonly></textarea>
    </div>
    <div class="client-request-json" data-type="htmlLayout">
        <div><b>Custom Question HTML Layout</b></div>
        <textarea readonly></textarea>
    </div>
</div>

<script>
    window.activity = <?php echo $signedRequest; ?>;

    window.authorApp = LearnosityAuthor.init(activity, {
        readyListener() {
            console.log('ready');
        },
        errorListener(e) {
            console.error(e);
        },
    });

    // Display the current request init options & html layout
    document.querySelector('[data-type="initOptions"] > textarea').value = `${JSON.stringify(window.activity, null, 2)}`;
    document.querySelector('[data-type="htmlLayout"] > textarea').value = `<?php echo (file_get_contents('dist/authoring_custom_layout.html')) ?>`;
</script>
</body>
</html>

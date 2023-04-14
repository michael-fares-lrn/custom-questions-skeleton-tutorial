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
                "name": "Custom",
                "reference": "my_custom_questions"
            }
          ],
          "question_type_templates": {
            "custom_question_skeleton": [
              {
                "name": "Custom rubric",
                "description": "POC of a summing rubric developed as a custom question in Learnosity",
                "group_reference": "my_custom_questions",
                "defaults": {
                  "type": "custom",
                  "stimulus": "How well did the student perform per these categories?",
                  "categories": [
                    {
                      "label": "Comprehension",
                      "points": 20,
                      "description": "Essay demonstrates clear understanding of the main idea."
                    },
                    {
                      "label": "Persuasiveness",
                      "points": 20,
                      "description": "Essay is well argued based on textual evidence."
                    },
                    {
                      "label": "Grammar and Mechanics",
                      "points": 20,
                      "description": "Essay employs correct English grammar, spelling, and punctuation."
                    }
                  ],
                  "js": {
                      "question": "dist/question.js",
                      "scorer": "dist/scorer.js"
                  },
                  "css": "dist/question.css"
                }
              }
            ]
          },
          "custom_question_types": [
            {
              "custom_type": "custom_question_skeleton",
              "type": "custom",
              "name": "Custom Question - Skeleton",
              "editor_layout": "dist/authoring_custom_layout.html",
              "js": {
                  "question": "dist/question.js",
                  "scorer": "dist/scorer.js"
              },
              "css": "dist/question.css",
              "version": "v1.0.0",
              "editor_schema": {
                "hidden_question": false,
                "properties": {
                    "categories": {
                      "name": "Define each rubric category name, points possible, and description below:",
                      "description": "",
                      "type": "array",
                      "required": true,
                      "items": {
                        "type": "object",
                        "attributes": {
                          "label": {
                            "type": "string",
                            "required": true
                          },
                          "points" : {
                            "type": "number",
                            "required": true 
                          },
                          "description": {
                            "type": "editor"
                          }
                        }
                      }
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
    <script src="//authorapi.learnosity.com"></script>
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

    window.questionEditorApp = LearnosityAuthor.init(activity, {
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

export const renderUI = (el, question, response, state) => {
    const responseAera = el.querySelector(".lrn_response_input");

    const form = document.createElement("form");
    form.classList.add("main-container");

    const categoryColumn = document.createElement("div");
    categoryColumn.classList.add("category-column");

    const inputColumn = document.createElement("div");
    inputColumn.classList.add("input-column");
    
    question.categories &&
        question.categories.forEach((category) => {
            
            if(!category.label) {
                category.label = "[ Category Name is Required ]";
            }
            if(!category.points) {
                category.points = 0;
            }
            if(!category.description) {
                category.description = "";
            }

            const inputContainer = document.createElement("div");
            inputContainer.classList.add("input-container");

            const categoryContainer = document.createElement("div");
            categoryContainer.classList.add("category-container");

            const formattedLabel = category.label ? category.label.toLowerCase().replace(/ /g, "_") : "";

            const numberInput = document.createElement("input");
            numberInput.setAttribute("type", "number");
            numberInput.setAttribute("id", formattedLabel);
            numberInput.setAttribute("name", formattedLabel);
            numberInput.setAttribute("min", 0);
            numberInput.setAttribute("max", category.points);
            numberInput.setAttribute("placeholder", 0);
            numberInput.classList.add("number-input");

            const slash = document.createElement("span");
            slash.classList.add("slash"); 
            slash.innerHTML = "/";

            const points = document.createElement("span");
            points.classList.add("points");
            points.innerHTML = `${category.points} points`;

            const categoryLabel = document.createElement("label");
            categoryLabel.classList.add("category-label");
            categoryLabel.innerHTML = category.label;

            const categoryDescription = document.createElement("span");
            categoryDescription.classList.add("category-description"),
                categoryDescription.innerHTML = category.description;
                inputContainer.appendChild(numberInput);
                inputContainer.appendChild(slash);
                inputContainer.appendChild(points);
                categoryContainer.appendChild(categoryLabel);
                categoryContainer.appendChild(categoryDescription);
                inputColumn.appendChild(inputContainer);
                categoryColumn.appendChild(categoryContainer);
                form.appendChild(categoryColumn);
                form.appendChild(inputColumn);
                responseAera.appendChild(form);
        });

    const totalContainer = document.createElement("div");
    totalContainer.classList.add("total-container");

    const totalLabel = document.createElement("span");
    totalLabel.classList.add("total-label");
    totalLabel.innerHTML = "Total score:";

    const leftTotalBox = document.createElement("div");
    leftTotalBox.classList.add("left-total-box");
    leftTotalBox.appendChild(totalLabel);

    const total = document.createElement("span");
    total.classList.add("total") 
    total.innerHTML = "0";

    const slash = document.createElement("span");
    slash.classList.add("slash")
    slash.innerHTML = "/";

    const totalPossible = document.createElement("span");
    totalPossible.classList.add("total-possible");

    totalPossible.innerHTML = question.categories.length === 0 ? 0 : 
    question.categories.map(category => category.points).reduce((total,current) => total + current)


    categoryColumn.appendChild(leftTotalBox);
    totalContainer.appendChild(total);
    totalContainer.appendChild(slash);
    totalContainer.appendChild(totalPossible);
    inputColumn.appendChild(totalContainer);

    if((state === "resume" || state === "review") && response) {
        console.log("response in resume / review", response)
        el.querySelector(".total").innerHTML = response.total_score;
        const numberInputs = Array.from(el.querySelectorAll(".number-input"))
        const categoryNames = Object.keys(response.categories);

        numberInputs.forEach(input => {
            const categoryToUpdate = categoryNames.find(name => name === input.name);
            input.value = response.categories[categoryToUpdate]
        })

    }

}


const Height = document.getElementById("height");
const Weight = document.getElementById("weight");
const Age = document.getElementById("age");
const Gender = document.getElementById("gender");
const Activity = document.getElementById("activity");
const Submit = document.getElementById("submitBtn");
const CardContainer = document.getElementById("cards-container");
const MealsDetails = document.getElementById("details");
//const DayDetails = document.getElementById("daydetails");
const IngredientSection = document.getElementById("ingredients");
const StepsSection = document.getElementById("steps");
const EquipmentSection = document.getElementById("equipment");
const RecipeSection = document.getElementById("recipe-section");
// const API_KEY = "0a3ac75a7c7f474ebaf2afe00ddc730d";
// const API_KEY = "c1712cb80bf8447399b31afdb22e614e";
const API_KEY= "409f527d419a4ff1aa3bb190f97181ff";
const getCalorie = () => {
  let hv = Height.value;
  let wv = Weight.value;
  let av = Age.value;
  let gv = Gender.value;
  let avv = Activity.value;
  let BMR;

  if (hv === "" || hv <= 0 || wv === "" || wv <= 0 || av === "" || av <= 0) {
    alert(
      "All input field should not be empty and should not have negetive value"
    );
    return;
  }

  if (gv === "female") {
    BMR = 655.1 + 9.563 * wv + 1.85 * hv - 4.676 * av;
  } else if (gv === "male"){
    BMR = 66.47 + 13.75 * wv + 5.003 * hv - 6.755 * av;
  }

  // Daily Calorie Requirement
  if (avv === "light") {
    BMR *= 1.375;
  } else if (avv === "moderate") {
    BMR *= 1.55;
  } else if (avv === "active") {
    BMR *= 1.725;
  }

  getMeals(BMR);
};

const getMeals = async (BMR) => {
  document.getElementById("loader").style.display = "block";
  const url = `https://api.spoonacular.com//mealplanner/generate?timeFrame=day&targetCalories=${BMR}&apiKey=${API_KEY}&includeNutrition=true`;

  let Totaldata;
  await fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      Totaldata = data;
      //console.log(data);
    });
   generateMealsCard(Totaldata);
  document.getElementById("loader").style.display = "none";
};

const generateMealsCard = (Totaldata) => {
  let cards = ``;
  MealsDetails.innerHTML = `
  <h1>Nutrients</h1>
  <div>
      <span class="px-3">Calories : ${Totaldata.nutrients.calories}</span>
      <span class="px-3">Carbohydrates : ${Totaldata.nutrients.carbohydrates}</span>
      <span class="px-3">Fat : ${Totaldata.nutrients.fat}</span>
      <span class="px-3">Proteins : ${Totaldata.nutrients.protein}</span>
  </div>
  `;
  // DayDetails.innerHTML = `
  // <div class="col-md-4 d-flex justify-content-center mb-2 ml-10">
  //   <h1>Breakfast</h1>
  //   <h1>Lunch</h1>
  //   <h1>Dinner</h1>
  // </div>`;
   Totaldata.meals.map(async (data) => {
    const url = `https://api.spoonacular.com/recipes/${data.id}/information?apiKey=${API_KEY}&includeNutrition=false`;
     let imgURL;
     await fetch(url)
      .then((res) => {
         return res.json();
       })
       .then((data) => {
         imgURL = data.image;
         console.log(data);
      });
    cards += `
        <div class="col-md-4 d-flex justify-content-center mb-2">  
            <div class="card baseBlock" style="width: 18rem;">
                <img src=${imgURL} class="card-img-top"
                    alt="meal 1">
                <div class="card-body">
                    <h5 class="card-title">${data.title}</h5>
                    <p>Preparation Time - ${data.readyInMinutes}Mins</p>
                    <button class="btn btn-outline-primary" onClick="btnRecipe(${data.id})" >Get Recipe</button>
                </div>
            </div>
        </div>
        `;
    CardContainer.innerHTML = cards;
  });
};

const btnRecipe = async (data) => {
  RecipeSection.innerHTML = "";
  IngredientSection.innerHTML = "";
  StepsSection.innerHTML = "";
  EquipmentSection.innerHTML = "";
  const url = `https://api.spoonacular.com/recipes/${data}/information?apiKey=${API_KEY}&includeNutrition=false`;
  let information;

  await fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      information = data;
     // console.log(data);
    });
  
  RecipeSection.textContent = `${information.title} Recipe`;
  
   //   Ingridents
  let htmlData = ``;
  let inCardDiv = document.createElement("div");
  inCardDiv.classList.add("carddesign", "card", "h-100");
  let inCardBody = document.createElement("div");
  inCardBody.classList.add("card-body");
  let inOverlay = document.createElement("div");
  inOverlay.classList.add("overlay");
  let ul = document.createElement("ul");
  information.extendedIngredients.map((ingre) => {
    htmlData += `
        <li>${ingre.original}</li>
        `;
       // console.log(ingre.original);
  });
  ul.innerHTML = htmlData;
  let ingreH1 = document.createElement("h3");
  ingreH1.textContent = "INGREDIENTS";
  inCardBody.appendChild(inOverlay);
  inCardBody.appendChild(ingreH1);
  inCardBody.appendChild(ul);
  inCardDiv.appendChild(inCardBody);
  IngredientSection.appendChild(inCardDiv);

//   //   Steps
  let stepsHtml = ``;
  let stCardDiv = document.createElement("div");
  stCardDiv.classList.add("carddesign", "card", "h-100");
  let stCardBody = document.createElement("div");
  stCardBody.classList.add("card-body");
  let stOverlay = document.createElement("div");
  stOverlay.classList.add("overlay");
  let stepsOl = document.createElement("ol");
  information.analyzedInstructions[0].steps.map((step) => {
    stepsHtml += `
        <li>${step.step}</li>
        `;
  });
  stepsOl.innerHTML = stepsHtml;
  let stepsH1 = document.createElement("h3");
  stepsH1.textContent = "STEPS";
  stCardBody.appendChild(stOverlay);
  stCardBody.appendChild(stepsH1);
  stCardBody.appendChild(stepsOl);
  stCardDiv.appendChild(stCardBody);
  StepsSection.appendChild(stCardDiv);

//   // equipmentSection
  const urlEquip = `https://api.spoonacular.com/recipes/${data}/equipmentWidget.json?apiKey=${API_KEY}&includeNutrition=false`;
  let equip;

  await fetch(urlEquip)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      equip = data;
    });

  let equipData = ``;
  let eqCardDiv = document.createElement("div");
  eqCardDiv.classList.add("carddesign", "card", "h-100");
  let eqCardBody = document.createElement("div");
  eqCardBody.classList.add("card-body");
  let eqOverlay = document.createElement("div");
  eqOverlay.classList.add("overlay");
  let equipUl = document.createElement("ul");
  equip.equipment.map((equip) => {
    equipData += `
            <li>${equip.name}</li>
            `;
  });
  equipUl.innerHTML = equipData;
  let equipH1 = document.createElement("h3");
  equipH1.textContent = "EQUIPMENT";
  eqCardBody.appendChild(eqOverlay);
  eqCardBody.appendChild(equipH1);
  eqCardBody.appendChild(equipUl);
  eqCardDiv.appendChild(eqCardBody);
  EquipmentSection.appendChild(eqCardDiv);
};

Submit.addEventListener("click", getCalorie);


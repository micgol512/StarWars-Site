import { rowData } from "./data.js";

function formatDate(date) {
  date = new Date(date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
}
function createTable(key) {
  if (document.getElementById("wrapper-content")) {
    document.getElementById("wrapper-content").remove();
    document.getElementById("wrapper-search").remove();
  }
  const searcher = document.createElement("div");
  const contenter = document.createElement("div");
  searcher.setAttribute("id", "wrapper-search");
  searcher.setAttribute("class", "wrapper content");
  searcher.innerHTML = `
  <div class="wrapper-searcher">
  <label for="input-search-index">Search by index</label>
  <input type="number" id="input-search-index" class="searcher-by"/>
  </div>
  <div class="wrapper-searcher">
  <label for="input-search-text">Search by text</label>
  <input id="input-search-text" class="searcher-by" />
  </div>`;
  contenter.setAttribute("id", "wrapper-content");
  contenter.setAttribute("class", "wrapper content");
  $body.append(searcher, contenter);
  const tableContent = document.createElement("table");
  tableContent.setAttribute("id", "table-content");
  tableContent.innerHTML = `<thead id="table-head">
      </thead><tbody id="table-body"></tbody>`;
  contenter.append(tableContent);

  const rowKeys = Object.keys(rowData[key][0]);
  const $thead = document.getElementById("table-head");
  let head1 = "name";
  let head2, head3;
  switch (key.toLowerCase()) {
    case "vehicles":
      head2 = rowKeys[1];
      head3 = rowKeys[2];
      break;
    case "starships":
      head2 = rowKeys[1];
      head3 = rowKeys[2];
      break;
    case "species":
      head2 = rowKeys[1];
      head3 = rowKeys[2];
      break;
    case "planets":
      head2 = rowKeys[1];
      head3 = rowKeys[6];
      break;
    case "people":
      head2 = rowKeys[1];
      head3 = rowKeys[7];
      break;
    case "films":
      head1 = rowKeys[0];
      head2 = rowKeys[2];
      head3 = rowKeys[4];
      break;
    default:
      break;
  }
  $thead.innerHTML = `<tr>
        <th>ID</th>
        <th>${head1.toUpperCase()}</th>
        <th>${head2.toUpperCase()}</th>
        <th>${head3.toUpperCase()}</th>
        <th>CREATED</th>
        <th>ACTIONS</th>
      </tr>`;

  const content = rowData[key];
  content.forEach((element, index) => {
    const $tbody = document.getElementById("table-body");
    $tbody.innerHTML += `<tr id="row-${index}">
        <td>${index + 1}.</td>
        <td>${element[head1]}</td>
        <td>${element[head2]}</td>
        <td>${element[head3]}</td>
        <td>${formatDate(element.created)}</td>  
      </tr>`;
    //<td id="action-buttons${index}" class="content-buttons"></td>
    createActions(document.getElementById(`row-${index}`));
    if (index > 9) {
      document.getElementById(`row-${index}`).style.display = "none";
    }
  });
  // const tBody = Array.from(document.querySelectorAll("#table-body tr"));
  const delBtnTab = Array.from(document.querySelectorAll(".deleteBtn"));
  delBtnTab.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      document.getElementById(`row-${index}`).remove();
      showTableBody();
      /////////////////////////////
      // document.getElementById("all-pages").innerText = `${Math.ceil(
      //   Array.from(tBody).length / pages.options[pages.selectedIndex].text
      // )}`;
      /////////////////////////////
    });
  });
  const showBtnTab = Array.from(document.querySelectorAll(".showBtn"));
  showBtnTab.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      // console.log(key);
      createInfo(key, index);
      document
        .getElementById("closeInfoBtn")
        .addEventListener("click", function () {
          document.getElementById("customAlert").remove();
        });
    });
  });
  let checkBoxTab = Array.from(document.querySelectorAll(".checkBoxSelect"));
  let btnDelChecked = null;
  checkBoxTab.forEach((check, index) => {
    check.addEventListener("change", () => {
      checkBoxTab = Array.from(document.querySelectorAll(".checkBoxSelect"));
      console.log(checkBoxTab);
      let isChecked = checkBoxTab.some((item) => item.checked);
      if (!document.getElementById("btnDelChecked")) {
        btnDelChecked = document.createElement("button");
        btnDelChecked.textContent = "Remove all";
        btnDelChecked.setAttribute("id", "btnDelChecked");
        document.getElementById("wrapper-search").append(btnDelChecked);
      }
      if (!isChecked) {
        btnDelChecked.remove();
      } else {
        // const indexToDel = [];
        // checkBoxTab.forEach((item, index) => {
        //   if (item.checked === true) {
        //     indexToDel.push(index);
        //   }
        // });
        btnDelChecked.addEventListener("click", () => {
          /////////LOGIKA USUWANIA ZAZNACZONYCH ELELEMENTÓW
          document.getElementById(`row-${index}`).remove();
          btnDelChecked.remove();
          showTableBody();
        });
      }
    });
  });
  const pagesWrapper = document.createElement("div");
  pagesWrapper.setAttribute("id", "wrapper-page-changer");
  pagesWrapper.innerHTML = `
  <button class="btn-pages" disabled>❰</button>
    <input id="curr-page" placeholder = "1" value="1"/>
    <button class="btn-pages">❱</button>
    <span>z </span><span id="all-pages">01</span>
    <select id="amount-item" name="pages">
        <option value="10">10</option>
        <option value="20">20</option>
    </select>
  `;
  // ❰❱𒌍𒌋⫷⫸ ↪︎ ↩︎
  searcher.append(pagesWrapper);
  // contenter.append(pagesWrapper);
  showTableBody();
  const btnChange = document.querySelectorAll(".btn-pages");
  const allPages = document.getElementById("all-pages");
  const currPage = document.getElementById("curr-page");
  const pages = document.getElementById("amount-item");
  const searchById = document.getElementById("input-search-index");
  const searchByText = document.getElementById("input-search-text");
  if (allPages.innerText === "1") btnChange[1].setAttribute("disabled", "");
  btnChange.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      switch (index) {
        case 0:
          if (--currPage.value > 1) {
            btnChange[1].removeAttribute("disabled");
          } else {
            btn.setAttribute("disabled", "");
          }
          break;
        case 1:
          if (++currPage.value < allPages.innerText) {
            btnChange[0].removeAttribute("disabled");
          } else {
            btn.setAttribute("disabled", "");
          }
          break;
        default:
          alert("Coś jest źle!!");
          break;
      }
      showTableBody();
    });
  });
  currPage.addEventListener("input", () => {
    searchById.value = "";
    searchByText.value = "";
    if (currPage.value > 0 && currPage.value <= parseInt(allPages.innerText)) {
      showTableBody();
      // console.log(allPages.innerText);
    } else {
      currPage.value = "";
      console.log("złe dane");
    }

    // console.log(currPage.value);
    ////
    ////sprawdzić czy wproiwadzona wartość to liczba i potem czy nie przekracza zakresu allpages
    ////
    ////
    ////
    ////
    ////
    ////
  });
  pages.addEventListener("change", () => {
    // console.log(pages.options[pages.selectedIndex].text);
    //USTAWIĆ ODPOWIENDNIO currPage
    //currPage.value=
    searchById.value = "";
    searchByText.value = "";
    showTableBody();
  });
  const tBody = Array.from(document.querySelectorAll("#table-body tr"));
  searchById.setAttribute("placeholder", `1-${tBody.length}`);
  searchById.addEventListener("input", () => {
    searchByText.value = "";
    currPage.value = 1;
    if (searchById.value > 0 && searchById.value <= rowData[key].length) {
      // console.log("TempID:", tempId);
      //////////////////////////
      showTableBody(parseInt(searchById.value));
      ///////////////////////////
    } else {
      showTableBody();
      searchById.value = "";
      console.log("złe dane");
    }
  });
  let tempText = "nazwie";
  if (key === "films") tempText = "tytule";
  searchByText.setAttribute("placeholder", `Wyszukaj po ${tempText}`);
  searchByText.addEventListener("input", () => {
    //////////////////////////
    currPage.value = 1;
    searchById.value = "";
    console.log(searchByText.value);
    if (searchByText.value === "") showTableBody();
    else showTableBody(searchByText.value);
    // console.log("PAGES VALUE", );
  });
}
function createActions(parent) {
  const editBtn = document.createElement("button");
  editBtn.textContent = "✙";
  editBtn.setAttribute("class", "showBtn");
  const deleteBtn = document.createElement("button");
  // deleteBtn.innerHTML = ``;
  deleteBtn.setAttribute("class", "deleteBtn");
  const checkBox = document.createElement("input");
  checkBox.setAttribute("class", "checkBoxSelect");
  checkBox.setAttribute("type", "checkbox");
  // checkBox.setAttribute("", "");
  const $td = document.createElement("td");
  $td.setAttribute("class", "content-buttons");
  $td.append(editBtn, deleteBtn, checkBox);
  parent.append($td);
}
function setColor(select) {
  switch (select) {
    case 1:
      $root.documentElement.style.setProperty("--mainColor", "rgb(0, 255, 21)");
      $root.documentElement.style.setProperty(
        "--btnBgHoverColor",
        "rgba(0, 255, 0, 0.425)"
      );
      $root.documentElement.style.setProperty(
        "--btnHoverColor",
        "rgb(241, 206, 206)"
      );
      $root.documentElement.style.setProperty("--infoColor", " rgb(0, 70, 0)");
      break;
    case 2:
      $root.documentElement.style.setProperty("--mainColor", "rgb(255, 0, 0)");
      $root.documentElement.style.setProperty(
        "--btnBgHoverColor",
        "rgba(255, 0, 0, 0.425)"
      );
      $root.documentElement.style.setProperty(
        "--btnHoverColor",
        "rgb(241, 206, 206)"
      );
      $root.documentElement.style.setProperty("--infoColor", " rgb(70, 0, 0)");
      break;
    case 3:
      $root.documentElement.style.setProperty(
        "--mainColor",
        "rgb(0, 225, 255)"
      );
      $root.documentElement.style.setProperty(
        "--btnBgHoverColor",
        "rgba(0, 225, 255, 0.425)"
      );
      $root.documentElement.style.setProperty(
        "--btnHoverColor",
        "rgb(206, 241, 241)"
      );
      $root.documentElement.style.setProperty("--infoColor", "rgb(0, 0, 70)");
      break;

    default:
      break;
  }
}
function createInfo(btnName, index) {
  if (document.getElementById("customAlert")) {
    document.getElementById("customAlert").remove();
  }
  const infoRow = rowData[btnName][index];
  const windowInfo = document.createElement("div");
  windowInfo.setAttribute("id", "customAlert");
  windowInfo.setAttribute("class", "info");
  // windowInfo.innerHTML = `
  // <div id="info-content"><div class="info-title"><span><strong> ${
  //   infoRow.name || infoRow.title
  // }</strong></span>
  //   <span class="closeBtn" id="closeInfoBtn">&times;</span>
  // </div>
  // </div>`;
  windowInfo.innerHTML = `<div id="info-wrapper">
    <div class="info-title"><span><strong> ${
      infoRow.name || infoRow.title
    }</strong></span>
    <span class="closeBtn" id="closeInfoBtn">𒉽</span>
  </div>
  <div id="info-content">
  </div></div>`;
  $body.append(windowInfo);
  const infoContent = document.getElementById("info-content");
  infoContent.innerHTML += "<ul>";
  if (btnName === "people") {
    console.log(infoRow);
    infoContent.innerHTML += `
    <li><strong>NAME</strong> ${infoRow.name}</li>
    <li><strong>HEIGHT:</strong> ${infoRow.height}</li>
    <li><strong>BIRTH_YEAR:</strong> ${infoRow.birth_year}</li>
    <li><strong>GENDER:</strong> ${infoRow.gender}</li>
    <li><strong>EYE_COLOR:</strong> ${infoRow.eye_color}</li>
    <li><strong>HAIR_COLOR:</strong> ${infoRow.hair_color}</li>
    <li><strong>SKIN_COLOR:</strong> ${infoRow.skin_color}</li>
    <li><strong>HOMEWORLD:</strong> ${infoRow.homeworld}</li>
    <li><strong>SPECIES:</strong> ${infoRow.species}</li>
    <li><strong>VEHICLES:</strong> ${[...infoRow.vehicles].join(", ")}</li>
    <li><strong>STARSHIPS:</strong> ${[...infoRow.starships].join(", ")}</li>
    <li><strong>FILMS:</strong> ${[...infoRow.films].join(", ")}</li>
    <li><strong>CREATED:</strong> ${formatDate(infoRow.created)}</li>
    <li><strong>EDITED:</strong> ${formatDate(infoRow.edited)}</li>
    <li><strong>URL:</strong> ${infoRow.url}</li>`;
  } else {
    Object.entries(infoRow).forEach(([key, value]) => {
      if (typeof value === "object") {
        value = [...value].join(", ");
      }
      if (key === "created" || key === "edited") {
        value = formatDate(value);
      }
      infoContent.innerHTML += `<li><strong>${key.toUpperCase()}:</strong>  ${value}</li>`;
    });
    infoContent.innerHTML += "</ul>";
  }
}
function showTableBody(searchBy = null) {
  if (document.getElementById("nothing-to-show"))
    document.getElementById("nothing-to-show").remove();

  const tBody = Array.from(document.querySelectorAll("#table-body tr"));
  const accPage = document.getElementById("curr-page").value;
  let pages = document.getElementById("amount-item");
  pages =
    pages.options[pages.selectedIndex].text !== null
      ? pages.options[pages.selectedIndex].text
      : 10;
  document.getElementById("all-pages").innerText = `${Math.ceil(
    tBody.length / pages
  )}`;
  document
    .getElementById("input-search-index")
    .setAttribute("placeholder", `1-${tBody.length}`);
  if (tBody.length !== 0) {
    tBody.forEach((element, index) => {
      if (searchBy === null) {
        if (Math.floor(index / pages) === accPage - 1) {
          element.removeAttribute("style");
        } else {
          element.style.display = "none";
        }
      } else {
        if (typeof searchBy === "number") {
          // const id = Array.from(
          //   document.querySelectorAll("#table-body>tr td:nth-child(1)")
          // );
          // console.log(id);
          if (index === searchBy - 1) {
            // console.log("INDEX równy SearchBy. A elemetn to: ", element);
            element.removeAttribute("style");
          } else {
            element.style.display = "none";
          }
        } else if (typeof searchBy === "string") {
          const texts = Array.from(
            document.querySelectorAll("#table-body>tr td:nth-child(2)")
          );
          if (
            texts[index].innerText
              .toLowerCase()
              .includes(searchBy.toLowerCase())
          ) {
            element.removeAttribute("style");
          } else {
            element.style.display = "none";
          }
          // console.log(pages)
          document.getElementById("all-pages").innerText = `${Math.ceil(
            Array.from(tBody).filter((row) => row.style.display !== "none")
              .length / pages
          )}`;
        }
      }
    });
  }
  if (
    tBody.length === 0 ||
    tBody.length === tBody.filter((row) => row.style.display === "none").length
  ) {
    const nothingToShow = document.createElement("tr");
    nothingToShow.setAttribute("id", "nothing-to-show");
    nothingToShow.innerHTML += `<td>"Brak elelemntów do wyświetlenia"</td>`;
    document.getElementById("table-body").append(nothingToShow);
  }
}
function searchByID() {}
function test() {
  const tBody = Array.from(document.querySelectorAll("#table-body tr"));
  tBody[11].removeAttribute("style");
  tBody[10].style.display = "";
  // console.log(tBody[10]);
}

//////////////////  START ////////////////////
// console.log(Object.keys(rowData));
const menuBtnNames = Object.keys(rowData);
const $body = document.body;
const $root = document;
// let searcher = null;
//header
const header = document.createElement("header");
header.innerHTML = `<div>Wpisz '<strong>YODA</strong>' albo '<strong>VADER</strong>' by skorzystać z tajnej mocy!!!</div>`;
const radioWrapper = document.createElement("div");
radioWrapper.setAttribute("id", "radio-wrapper");
header.append(radioWrapper);
const label = document.createElement("label");
label.textContent = "Wybierz moc strony:";
label.setAttribute("for", "selectSite");
radioWrapper.append(label);
//color site
for (let i = 1; i <= 3; i++) {
  const radio = document.createElement("input");
  radio.id = "site-1";
  radio.type = "radio";
  radio.name = "selectSide";
  radio.setAttribute("id", `site-${i}`);
  radio.setAttribute("type", "radio");
  radio.setAttribute("name", "selectSite");
  radio.setAttribute("class", "radioSite");
  i === 1 ? radio.setAttribute("checked", true) : null;
  radioWrapper.append(radio);
  radio.addEventListener("click", () => {
    setColor(i);
  });
}
// yoda lub vader
const keyVader = "vader";
const keyYoda = "yoda";
let keyCatcher = ["."];
const vaderSound = new Audio("./media/audio/vader.mp3");
const yodaSound = new Audio("./media/audio/yoda.mp3");
// vaderSound.loop = false;
document.addEventListener("keypress", ({ key }) => {
  keyCatcher.push(key);
  if (keyCatcher.length > keyVader.length) {
    keyCatcher.shift();
  }
  if (keyCatcher.join("").slice(1) === keyYoda) {
    yodaSound.play();
  } else if (keyCatcher.join("") === keyVader) {
    vaderSound.play();
  }
});
//przyciski menu + start strony
const menuBtnWrapper = document.createElement("div");
menuBtnWrapper.setAttribute("class", "wrapper buttons");
const logo = document.createElement("img");
logo.src = "./media/images/logo.png";
logo.setAttribute("id", "logo");
$body.append(header, menuBtnWrapper, logo);

menuBtnNames.forEach((btnName, index) => {
  const btn = document.createElement("button");
  menuBtnWrapper.append(btn);
  btn.setAttribute("id", `menuBtn-${index}`);
  btn.setAttribute("class", `menuBtns`);
  btn.innerText = btnName.toUpperCase();

  btn.addEventListener("click", () => {
    logo.remove();
    for (let i = 0; i < menuBtnNames.length; i++) {
      document.getElementById(`menuBtn-${i}`).setAttribute("class", `menuBtns`);
      // console.log();
    }
    btn.setAttribute("class", `menuBtns active`);
    //logika tworzenia info contentu po przycisku
    createTable(btnName);
    showTableBody();
  });
});

// //////  Array.from(tBody).length /

// document.getElementById("showAlertBtn").addEventListener("click", function () {
//   document.getElementById("customAlert").style.display = "block";
// });

// document.getElementById("closeInfoBtn").addEventListener("click", function () {
//   document.getElementById("customAlert").style.display = "none";
// });

// // Close the info box when clicking anywhere outside of it
// window.onclick = function (event) {
//   if (event.target == document.getElementById("customAlert")) {
//     document.getElementById("customAlert").style.display = "none";
//   }
// }
document.getElementById("sprawdzaj").addEventListener("click", () => {
  showTableBody();
  // test();
});

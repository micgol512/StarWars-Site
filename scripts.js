import { rowData } from "./data.js";

function formatDate(date) {
  date = new Date(date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
}
function createRowBtnActions(key) {
  const delBtnTab = Array.from(document.querySelectorAll(".deleteBtn"));
  delBtnTab.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      document.getElementById(`row-${index}`).remove();
    });
  });
  const showBtnTab = Array.from(document.querySelectorAll(".showBtn"));
  showBtnTab.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      createInfo(key, index);
      document
        .getElementById("closeInfoBtn")
        .addEventListener("click", function () {
          document.getElementById("showInfoBox").remove();
        });
    });
  });

  let checkBoxTab = Array.from(document.querySelectorAll(".checkBoxSelect"));
  let btnDelChecked = null;
  checkBoxTab.forEach((check, index) => {
    function removeRowWithIndex() {
      document.getElementById(`row-${index}`).remove();
      btnDelChecked.remove();
    }
    check.addEventListener("change", () => {
      checkBoxTab = Array.from(document.querySelectorAll(".checkBoxSelect"));
      let isSomeChecked = checkBoxTab.some((item) => item.checked);
      console.log("Czy zaznaczone?", isSomeChecked);
      if (!document.getElementById("btnDelChecked")) {
        btnDelChecked = document.createElement("button");
        btnDelChecked.textContent = "Remove all";
        btnDelChecked.setAttribute("id", "btnDelChecked");
        document.getElementById("wrapper-search").append(btnDelChecked);
      }
      if (!isSomeChecked) {
        btnDelChecked.remove();
      }
      if (!check.checked) {
        btnDelChecked.removeEventListener("click", removeRowWithIndex);
      } else {
        btnDelChecked.addEventListener("click", removeRowWithIndex);
      }
    });
  });
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

  // const rowKeys = Object.keys(rowData[key][0]);
  // const $thead = document.getElementById("table-head");
  // let head1 = "name";
  // let head2, head3;
  // switch (key.toLowerCase()) {
  //   case "vehicles":
  //     head2 = rowKeys[1];
  //     head3 = rowKeys[2];
  //     break;
  //   case "starships":
  //     head2 = rowKeys[1];
  //     head3 = rowKeys[2];
  //     break;
  //   case "species":
  //     head2 = rowKeys[1];
  //     head3 = rowKeys[2];
  //     break;
  //   case "planets":
  //     head2 = rowKeys[1];
  //     head3 = rowKeys[6];
  //     break;
  //   case "people":
  //     head2 = rowKeys[1];
  //     head3 = rowKeys[7];
  //     break;
  //   case "films":
  //     head1 = rowKeys[0];
  //     head2 = rowKeys[2];
  //     head3 = rowKeys[4];
  //     break;
  //   default:
  //     break;
  // }
  // $thead.innerHTML = `<tr>
  //       <th>ID</th>
  //       <th>${head1.toUpperCase()}</th>
  //       <th>${head2.toUpperCase()}</th>
  //       <th>${head3.toUpperCase()}</th>
  //       <th>CREATED</th>
  //       <th>ACTIONS</th>
  //     </tr>`;

  createData();
  // checkBoxAddListener();
  // createRowBtnActions(key);

  const pagesWrapper = document.createElement("div");
  pagesWrapper.setAttribute("id", "wrapper-page-changer");
  pagesWrapper.innerHTML = `
  <button class="btn-pages" disabled>❰</button>
    <input type="number" id="curr-page" placeholder = "1" value="1"/>
    <button class="btn-pages">❱</button>
    <span>z </span><span id="all-pages">01</span>
    <select id="amount-item" name="pages">
        <option value="10" selected>10</option>
        <option value="20" >20</option>
    </select>
  `;
  // ❰❱𒌍𒌋⫷⫸ ↪︎ ↩︎
  searcher.append(pagesWrapper);
  // contenter.append(pagesWrapper);
  // showTableBody();
  paginacja();

  const btnChange = document.querySelectorAll(".btn-pages");
  const allPages = document.getElementById("all-pages");
  const currPage = document.getElementById("curr-page");
  const pages = document.getElementById("amount-item");
  const searchById = document.getElementById("input-search-index");
  const searchByTxt = document.getElementById("input-search-text");
  if (allPages.innerText === "1") btnChange[1].setAttribute("disabled", "");
  btnChange.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      switch (index) {
        case 0:
          currPage.value--;
          // checkButtonPages();
          break;
        case 1:
          currPage.value++;
          // checkButtonPages();
          break;
        default:
          alert("Coś jest źle!!");
          break;
      }
      // showTableBody();
      paginacja();
    });
  });

  const tBody = Array.from(document.querySelectorAll("#table-body tr"));
  searchById.setAttribute("placeholder", `1-${tBody.length}`);
  let searchTempText = "nazwie";
  if (key === "films") searchTempText = "tytule";
  searchByTxt.setAttribute("placeholder", `Wyszukaj po ${searchTempText}`);
  ///////////////////////////////////////////////////////////////////////////////////////
  searchById.addEventListener("input", () => {
    searchByTxt.value = "";
    if (
      parseInt(searchById.value) <= 0 ||
      parseInt(searchById.value) > parseInt(tBody.length)
    )
      searchById.value = "";
    searchByIndex(searchById.value);
  });
  searchByTxt.addEventListener("input", () => {
    searchById.value = "";
    searchByText(searchByTxt.value);
  });
  currPage.addEventListener("input", () => {
    if (
      parseInt(currPage.value) <= 0 ||
      parseInt(currPage.value) > parseInt(allPages.innerText)
    )
      currPage.value = "";
    paginacja();
  });
  currPage.addEventListener("blur", () => {
    if (currPage.value === "") {
      currPage.value = 1;
    }
  });
  pages.addEventListener("change", () => {
    let tempPagesTen;
    let tempCurrPageTen;
    paginacja();
  });
  ///////////////////////////////////////////////////////////////////////////////////////
  //   // console.log(currPage.value);
  //   ////
  //   ////sprawdzić czy wproiwadzona wartość to liczba i potem czy nie przekracza zakresu allpages
  //   ////
  //   ////
  //   ////
  //   ////
  //   ////
  //   //// 19799773
  // });
  // pages.addEventListener("change", () => {
  //   // console.log(pages.options[pages.selectedIndex].text);
  //   //USTAWIĆ ODPOWIENDNIO currPage
  //   //currPage.value=
  //   // searchById.value = "";
  //   // searchByText.value = "";
  //   // const tempPages = parseInt(document.getElementById("all-pages").innerText);
  //   // currPage.value = Math.floor(
  //   //   (parseInt(document.getElementById("all-pages").innerText) *
  //   //     parseInt(currPage.value)) /
  //   //     tempPages
  //   // );
  //   showTableBody();
  // });

  // searchById.addEventListener("input", () => {
  //   searchByText.value = "";
  //   currPage.value = 1;
  //   if (searchById.value > 0 && searchById.value <= rowData[key].length) {
  //     // console.log("TempID:", tempId);
  //     //////////////////////////
  //     // showTableBody(parseInt(searchById.value));
  //     ///////////////////////////
  //   } else {
  //     // showTableBody();
  //     searchById.value = "";
  //     console.log("złe dane");
  //   }
  //   checkButtonPages();
  // });

  // searchByTxt.addEventListener("input", () => {
  //   //////////////////////////
  //   currPage.value = 1;
  //   searchById.value = "";
  //   searchByText(searchByTxt.value);
  //   // console.log(searchByText.value);
  //   // if (searchByText.value === "") showTableBody();
  //   // else showTableBody(searchByText.value);
  //   // console.log("PAGES VALUE");
  // });
}
function checkBoxAddListener() {
  let checkBoxTab = Array.from(document.querySelectorAll(".checkBoxSelect"));
  let btnDelChecked = null;
  checkBoxTab.forEach((check, index) => {
    function removeRowWithIndex() {
      document.getElementById(`row-${index}`).remove();
      btnDelChecked.remove();
      paginacja();
    }
    check.addEventListener("change", () => {
      checkBoxTab = Array.from(document.querySelectorAll(".checkBoxSelect"));
      let isSomeChecked = checkBoxTab.some((item) => item.checked);
      // console.log("Czy zaznaczone?", isSomeChecked);
      if (!document.getElementById("btnDelChecked")) {
        btnDelChecked = document.createElement("button");
        btnDelChecked.textContent = "Remove all";
        btnDelChecked.setAttribute("id", "btnDelChecked");
        document.getElementById("wrapper-search").append(btnDelChecked);
      }
      if (!isSomeChecked) {
        btnDelChecked.remove();
      }
      if (!check.checked) {
        btnDelChecked.removeEventListener("click", removeRowWithIndex);
      } else {
        btnDelChecked.addEventListener("click", removeRowWithIndex);
      }
    });
  });
}
function createActionsBtns(parent, index) {
  const activeBtn = document.querySelector(".active").innerText.toLowerCase();
  const editBtn = document.createElement("button");
  editBtn.textContent = "✙";
  editBtn.setAttribute("class", "showBtn");
  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("class", "deleteBtn");
  // deleteBtn.textContent = "✘";
  const checkBox = document.createElement("input");
  checkBox.setAttribute("class", "checkBoxSelect");
  checkBox.setAttribute("type", "checkbox");
  // checkBox.setAttribute("", "");
  const $td = document.createElement("td");
  $td.setAttribute("class", "content-buttons");
  $td.append(editBtn, deleteBtn, checkBox);
  parent.append($td);
  ///////////////////////////////////////////////////////////////////////////////////////
  editBtn.addEventListener("click", () => {
    createInfo(activeBtn, index);
    document
      .getElementById("closeInfoBtn")
      .addEventListener("click", function () {
        document.getElementById("showInfoBox").remove();
      });
  });
  deleteBtn.addEventListener("click", () => {
    parent.remove();
    paginacja();
  });
  ///////////////////////////////////////////////////////////////////////////////////////
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
  if (document.getElementById("showInfoBox")) {
    document.getElementById("showInfoBox").remove();
  }
  const infoRow = rowData[btnName][index];
  const windowInfo = document.createElement("div");
  windowInfo.setAttribute("id", "showInfoBox");
  // windowInfo.setAttribute("class", "info");
  // windowInfo.innerHTML = `
  // <div id="info-content"><div class="info-title"><span><strong> ${
  //   infoRow.name || infoRow.title
  // }</strong></span>
  //   <span id="closeInfoBtn">&times;</span>
  // </div>
  // </div>`;
  windowInfo.innerHTML = `<div id="info-wrapper">
    <div class="info-title"><span><strong> ${
      infoRow.name || infoRow.title
    }</strong></span>
    <span id="closeInfoBtn">𒉽</span>
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
  const currPage = document.getElementById("curr-page");
  // let pages = document.getElementById("amount-item");
  // pages =
  //   pages.options[pages.selectedIndex].text !== null
  //     ? pages.options[pages.selectedIndex].text
  //     : 10;
  const pages = parseInt(document.getElementById("amount-item").value);
  document.getElementById("all-pages").innerText = `${Math.ceil(
    tBody.length / pages
  )}`;
  // currPage.value=
  const searchById = document.getElementById("input-search-index");
  const searchByText = document.getElementById("input-search-text");
  searchById.setAttribute("placeholder", `1-${tBody.length}`);
  if (tBody.length !== 0) {
    tBody.forEach((element, index) => {
      if (Math.floor(index / pages) === currPage.value - 1) {
        element.removeAttribute("style");
      } else {
        element.style.display = "none";
      }
    });
    if (searchById.value !== "") {
      searchByText(searchById.value);
    }
    // if (searchByText !== "") {
    //   let counter = currPage.value * pages - pages;
    //   console.log(counter);
    //   tBody.forEach((element, index) => {
    //     const texts = element.querySelectorAll("td")[1].innerText.toLowerCase();
    //     if (
    //       texts.includes(searchByText.value.toLowerCase()) &&
    //       counter++ < 10
    //     ) {
    //       element.removeAttribute("style");
    //     } else {
    //       element.style.display = "none";
    //     }
    //   });
    // }

    // tBody.forEach((element, index) => {
    //   if (searchBy === null) {
    //     if (Math.floor(index / pages) === currPage - 1) {
    //       element.removeAttribute("style");
    //     } else {
    //       element.style.display = "none";
    //     }
    //   } else {
    //     if (typeof searchBy === "number") {
    //       // const id = Array.from(
    //       //   document.querySelectorAll("#table-body>tr td:nth-child(1)")
    //       // );
    //       // console.log(id);
    //       if (index === searchBy - 1) {
    //         // console.log("INDEX równy SearchBy. A elemetn to: ", element);
    //         element.removeAttribute("style");
    //       } else {
    //         element.style.display = "none";
    //       }
    //     } else if (typeof searchBy === "string") {
    //       const texts = element
    //         .querySelectorAll("td")[1]
    //         .innerText.toLowerCase();
    //       console.log(texts);
    //       if (texts.includes(searchBy.toLowerCase())) {
    //         element.removeAttribute("style");
    //       } else {
    //         element.style.display = "none";
    //       }
    //       // console.log(pages);
    //       // document.getElementById("all-pages").innerText = `${Math.ceil(
    //       //   Array.from(tBody).filter((row) => row.style.display !== "none")
    //       //     .length / pages
    //       // )}`;
    //     }
    //   }
    // });
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
function createData() {
  const activeBtn = document.querySelector(".active").innerText.toLowerCase();
  // console.log(key);
  if (document.getElementById("nothing-to-show"))
    document.getElementById("nothing-to-show").remove();
  // const tBody = Array.from(document.querySelectorAll("#table-body tr"));
  // const currPage = document.getElementById("curr-page");
  // console.log(rowData[activeBtn][0]);
  const rowKeys = Object.keys(rowData[activeBtn][0]);

  const $thead = document.getElementById("table-head");
  // console.log("THEAD", $thead);
  const content = rowData[activeBtn];
  let head1 = "name";
  let head2, head3;
  switch (activeBtn.toLowerCase()) {
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
  const tbody = document.getElementById("table-body");
  content.forEach((element, index) => {
    const $tr = document.createElement("tr");
    $tr.setAttribute("id", `row-${index}`);
    const $td1 = document.createElement("td");
    const $td2 = document.createElement("td");
    const $td3 = document.createElement("td");
    const $td4 = document.createElement("td");
    const $td5 = document.createElement("td");
    $td1.innerHTML = `${index + 1}`;
    $td2.innerHTML = `${element[head1]}`;
    $td3.innerHTML = `${element[head2]}`;
    $td4.innerHTML = `${element[head3]}`;
    $td5.innerHTML = `${formatDate(element.created)}`;
    $tr.append($td1, $td2, $td3, $td4, $td5);
    tbody.append($tr);

    createActionsBtns($tr, index);
    // if (index > 9) {
    //   document.getElementById(`row-${index}`).style.display = "none";
    // }
  });
  checkBoxAddListener();
}
function name(params) {
  const btnChange = document.querySelectorAll(".btn-pages");
  const allPages = document.getElementById("all-pages");
  const currPage = document.getElementById("curr-page");
  const pages = document.getElementById("amount-item");
  const searchById = document.getElementById("input-search-index");
  const searchByTxt = document.getElementById("input-search-text");
  if (allPages.innerText === "1") btnChange[1].setAttribute("disabled", "");
  btnChange.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      switch (index) {
        case 0:
          currPage.value--;
          // checkButtonPages();
          break;
        case 1:
          currPage.value++;
          // checkButtonPages();
          break;
        default:
          alert("Coś jest źle!!");
          break;
      }
      // showTableBody();
      checkButtonPages();
    });
  });

  currPage.addEventListener("input", () => {
    searchById.value = "";
    searchByTxt.value = "";
    if (
      parseInt(currPage.value) > 0 &&
      parseInt(currPage.value) <= parseInt(allPages.innerText)
    ) {
      // showTableBody();
      checkButtonPages();
      // console.log(allPages.innerText);
    } else {
      currPage.value = "";
      console.log("złe dane");
      checkButtonPages();
    }

    // console.log(currPage.value);
    ////
    ////sprawdzić czy wproiwadzona wartość to liczba i potem czy nie przekracza zakresu allpages
    ////
    ////
    ////
    ////
    ////
    //// 19799773
  });
  pages.addEventListener("change", () => {
    // console.log(pages.options[pages.selectedIndex].text);
    //USTAWIĆ ODPOWIENDNIO currPage
    //currPage.value=
    // searchById.value = "";
    // searchByText.value = "";
    // const tempPages = parseInt(document.getElementById("all-pages").innerText);
    // currPage.value = Math.floor(
    //   (parseInt(document.getElementById("all-pages").innerText) *
    //     parseInt(currPage.value)) /
    //     tempPages
    // );
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
      // showTableBody(parseInt(searchById.value));
      ///////////////////////////
    } else {
      // showTableBody();
      searchById.value = "";
      console.log("złe dane");
    }
    checkButtonPages();
  });
  let tempText = "nazwie";
  if (key === "films") tempText = "tytule";
  searchByTxt.setAttribute("placeholder", `Wyszukaj po ${tempText}`);
  searchByTxt.addEventListener("input", () => {
    //////////////////////////
    currPage.value = 1;
    searchById.value = "";
    searchByText(searchByTxt.value);
    // console.log(searchByText.value);
    // if (searchByText.value === "") showTableBody();
    // else showTableBody(searchByText.value);
    // console.log("PAGES VALUE");
  });
}
function showContent() {
  if (document.getElementById("nothing-to-show"))
    document.getElementById("nothing-to-show").remove();

  const tBody = Array.from(document.querySelectorAll("#table-body tr"));
  const currPage = document.getElementById("curr-page").value;
  const searchByID = document.getElementById("input-search-index");
  const searchByText = document.getElementById("input-search-text");
  let searchBy;
  const pages = parseInt(document.getElementById("amount-item").value);
  document.getElementById("all-pages").innerText = `${Math.ceil(
    tBody.length / pages
  )}`;
  document.getElementById("all-pages").innerText = `${Math.ceil(
    tBody.length / pages
  )}`;
  searchByID.setAttribute("placeholder", `1-${tBody.length}`);
  if (searchByID.value !== "") {
    searchBy = searchByID.value;
  } else if (searchByText.value !== "") {
    searchBy = searchByText.value;
  } else {
    searchBy = null;
  }
  if (tBody.length !== 0) {
    tBody.forEach((element, index) => {
      if (searchBy === null) {
        if (Math.floor(index / pages) === currPage - 1) {
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
          let tempPages = parseInt(
            document.getElementById("all-pages").innerText
          );
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
function checkButtonPages() {
  const btnChange = document.querySelectorAll(".btn-pages");
  const allPages = document.getElementById("all-pages");
  const currPage = document.getElementById("curr-page");
  // const pages = document.getElementById("amount-item");
  if (allPages.innerText === "1") {
    // console.log(`ALL PAGES: ${allPages.innerText} = 1`);
    btnChange[0].setAttribute("disabled", "");
    btnChange[1].setAttribute("disabled", "");
  } else {
    if (currPage.value !== "") {
      btnChange[0].removeAttribute("disabled");
      btnChange[1].removeAttribute("disabled");
      if (parseInt(currPage.value) === 1) {
        // console.log(`Pierwszy warunek: ${currPage.value} > 1`);
        btnChange[0].setAttribute("disabled", "");
      } else {
        // console.log("Else pierwszye");
        btnChange[0].removeAttribute("disabled");
      }
      if (parseInt(currPage.value) === parseInt(allPages.innerText)) {
        // console.log(
        //   `Drugi warunek: ${currPage.value} <= ${allPages.innerText}`
        // );
        btnChange[1].setAttribute("disabled", "");
      } else {
        // console.log("Else drugi");
        btnChange[1].removeAttribute("disabled");
      }
    } else {
      btnChange[0].setAttribute("disabled", "");
      btnChange[1].setAttribute("disabled", "");
    }
  }
}
function changeCurrPage() {
  const tBody = Array.from(document.querySelectorAll("#table-body tr"));
  const tBodyDisabled = tBody.filter((row) => row.style.display !== "none");
  const currPage = document.getElementById("curr-page");
  console.log("Disabled", tBodyDisabled);
}
function searchByIndex(search) {
  search = parseInt(search);
  const tBody = document.getElementById("table-body");
  tBody.innerHTML = "";
  createData();
  if (isFinite(search)) {
    const tBodyRows = Array.from(document.querySelectorAll("#table-body tr"));
    tBodyRows.forEach((element) => {
      if (parseInt(element.querySelectorAll("td")[0].innerText) !== search) {
        element.remove();
      }
    });
  }
  paginacja();
}
function searchByText(text = "") {
  const tBody = document.getElementById("table-body");
  tBody.innerHTML = "";
  createData();
  if (text === "") {
  } else {
    const tBodyRows = Array.from(document.querySelectorAll("#table-body tr"));
    tBodyRows.forEach((element) => {
      console.log(element);
      if (
        !element
          .querySelectorAll("td")[1]
          .innerText.toLowerCase()
          .includes(text.toLowerCase())
      ) {
        element.remove();
      }
    });
  }
  paginacja();
}
function paginacja() {
  const tBody = Array.from(document.querySelectorAll("#table-body tr"));
  const allPages = document.getElementById("all-pages");
  const currPage = parseInt(document.getElementById("curr-page").value) || 1;
  const pages = parseInt(document.getElementById("amount-item").value);
  const tempAllPages =
    Math.ceil(tBody.length / pages) > 0 ? Math.ceil(tBody.length / pages) : 1;
  allPages.innerText = `${tempAllPages}`;
  if (currPage > 1 && currPage > allPages.innerText) {
    document.getElementById("curr-page").value--;
    paginacja();
  } else {
    if (tBody.length === 0) {
      const nothingToShow = document.createElement("tr");
      nothingToShow.setAttribute("id", "nothing-to-show");
      nothingToShow.innerHTML += `<td>"Brak elelemntów do wyświetlenia"</td>`;
      document.getElementById("table-body").append(nothingToShow);
    } else {
      tBody.forEach((element, index) => {
        if (Math.floor(index / pages) === currPage - 1) {
          element.removeAttribute("style");
        } else {
          element.style.display = "none";
        }
      });
    }
    checkButtonPages();
  }
}
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
  keyCatcher.push(key.toLowerCase());
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
    // showTableBody();
  });
});

// //////  Array.from(tBody).length /

// document.getElementById("showAlertBtn").addEventListener("click", function () {
//   document.getElementById("showInfoBox").style.display = "block";
// });

// document.getElementById("closeInfoBtn").addEventListener("click", function () {
//   document.getElementById("showInfoBox").style.display = "none";
// });

// // Close the info box when clicking anywhere outside of it
// window.onclick = function (event) {
//   if (event.target == document.getElementById("showInfoBox")) {
//     document.getElementById("showInfoBox").style.display = "none";
//   }
// }
document.getElementById("sprawdzaj").addEventListener("click", () => {
  // const text = document.getElementById("input-search-text").value;
  // console.log("text", text);
  // searchByText(text);
  // changeCurrPage();
  // checkButtonPages();
  // showTableBody();
  // const sprawdz = document.querySelector(".active").innerText;
  // console.log(sprawdz);
  // createData();
  // test();
  // searchByIndex();
  paginacja();
});

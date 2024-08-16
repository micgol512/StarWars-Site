import { rowData } from "./data.js";

const $body = document.body;
//zostałem przy tym rozwiązaniu bo tablica bedzie prechowywała zawsze max 5 znaków
//gdzie string jak nidy nie wpiszemy słowa będzie się powiększał
const keyCatcher = ["."];

const startPage = () => {
  createHeader();
  hiddenPowerSound();
  createMainBtns();
  createStartLogo();
};
const createHeader = () => {
  const header = document.createElement("header");
  const radioWrapper = document.createElement("div");
  const label = document.createElement("label");

  header.innerHTML = `<div>Wpisz '<strong>YODA</strong>' albo '<strong>VADER</strong>' by skorzystać z tajnej mocy!!!</div>`;

  radioWrapper.id = "radio-wrapper";
  label.textContent = "Wybierz moc strony:";
  label.htmlFor = "selectSite";
  radioWrapper.append(label);
  for (let i = 1; i <= 3; i++) {
    const radio = document.createElement("input");
    radio.id = `site-${i}`;
    radio.type = "radio";
    radio.name = "selectSite";
    radio.className = "radioSite";
    i === 1 ? (radio.checked = true) : null;
    radioWrapper.append(radio);
    radio.addEventListener("click", () => {
      setColor(i);
    });
  }

  header.append(radioWrapper);
  $body.append(header);
};
const hiddenPowerSound = () => {
  const keyVader = "vader";
  const keyYoda = "yoda";
  const vaderSound = new Audio("./media/audio/vader.mp3");
  const yodaSound = new Audio("./media/audio/yoda.mp3");
  document.addEventListener("keypress", ({ key }) => {
    keyCatcher.push(key.toLowerCase());
    if (keyCatcher.length > keyVader.length) {
      keyCatcher.shift();
    }
    if (keyCatcher.join("").slice(1) === keyYoda) {
      vaderSound.pause();
      vaderSound.currentTime = 0;
      yodaSound.play();
    } else if (keyCatcher.join("") === keyVader) {
      yodaSound.pause();
      yodaSound.currentTime = 0;
      vaderSound.play();
    }
  });
};
const createMainBtns = () => {
  const menuBtnWrapper = document.createElement("div");
  const menuBtnNames = Object.keys(rowData);

  menuBtnWrapper.className = "buttons wrapper";
  $body.append(menuBtnWrapper);

  menuBtnNames.forEach((btnName, index) => {
    const btn = document.createElement("button");
    menuBtnWrapper.append(btn);
    btn.id = `menuBtn-${index}`;
    btn.className = "menuBtns";
    btn.innerText = btnName.toUpperCase();
    btn.addEventListener("click", () => {
      removeStartLogo();
      for (let i = 0; i < menuBtnNames.length; i++) {
        document.getElementById(`menuBtn-${i}`).className = "menuBtns";
      }
      btn.className = "menuBtns active";
      createTable(btnName);
    });
  });
};
const createStartLogo = () => {
  const logo = document.createElement("img");
  logo.src = "./media/images/logo.png";
  logo.id = "logo";
  $body.append(logo);
};
const removeStartLogo = () => {
  if (document.getElementById("logo")) document.getElementById("logo").remove();
};
const formatDate = (date) => {
  const formatedDate = new Date(date);
  const year = formatedDate.getFullYear();
  const month = String(formatedDate.getMonth() + 1).padStart(2, "0");
  const day = String(formatedDate.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
};
const createTable = (key) => {
  if (document.getElementById("wrapper-content")) {
    document.getElementById("wrapper-content").remove();
    document.getElementById("wrapper-search").remove();
  }
  const searcher = document.createElement("div");
  const contenter = document.createElement("div");
  searcher.id = "wrapper-search";
  searcher.className = "wrapper searcher";
  searcher.innerHTML = `
  <div class="wrapper-searcher">
  <label for="input-search-index">Search by index:</label>
  <input type="number" id="input-search-index" class="searcher-by"/>
  </div>
  <div class="wrapper-searcher">
  <label for="input-search-text">Search by text:</label>
  <input id="input-search-text" class="searcher-by" />
  </div>`;
  contenter.id = "wrapper-content";
  contenter.className = "wrapper content";
  $body.append(searcher, contenter);
  const tableContent = document.createElement("table");
  tableContent.id = "table-content";
  tableContent.innerHTML = `<thead id="table-head">
      </thead><tbody id="table-body"></tbody>`;
  contenter.append(tableContent);

  createData();

  const pagesWrapper = document.createElement("div");
  pagesWrapper.id = "wrapper-page-changer";
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
  contenter.append(pagesWrapper);

  const btnChange = document.querySelectorAll(".btn-pages");
  const allPages = document.getElementById("all-pages");
  const currPage = document.getElementById("curr-page");
  const pages = document.getElementById("amount-item");
  const searchById = document.getElementById("input-search-index");
  const searchByTxt = document.getElementById("input-search-text");
  btnChange.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      switch (index) {
        case 0:
          currPage.value--;
          break;
        case 1:
          currPage.value++;
          break;
        default:
          alert("Coś jest źle!!");
          break;
      }
      pagination();
    });
  });
  pagination();
  const tBody = Array.from(document.querySelectorAll("#table-body tr"));
  let searchTempText = "name";
  if (key === "films") searchTempText = "title";
  searchByTxt.placeholder = `Search by ${searchTempText}.`;
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
    pagination();
  });
  currPage.addEventListener("blur", () => {
    if (currPage.value === "") {
      currPage.value = 1;
    }
  });

  pages.addEventListener("change", () => {
    const firstRow = Array.from(
      document.querySelectorAll("#table-body tr:not([class])")
    ).findIndex((element) => element.style.display !== "none");
    currPage.value = Math.floor(firstRow / pages.value) + 1;
    pagination();
  });
};
//oddzielna funkcja bo jak tworzyłem tam gdzie przyciski to odwoływało się tylko do ostatnio
//zaznaczonego checkboxa tylko
const checkBoxAddListener = () => {
  let checkBoxTab = Array.from(document.querySelectorAll(".checkBoxSelect"));
  let btnDelChecked = null;
  checkBoxTab.forEach((check, index) => {
    //jak definiuje tą funkcję poza i odnoszę się to przy odznaczeniu checkboxa
    //nie usówa mi Listenera czyli usówa nawet odznaczone (ale zaznaczone kiedyś i odznaczone)
    const removeRowWithIndex = () => {
      document.getElementById(`row-${index}`).remove();
      btnDelChecked.remove();
      pagination();
    };
    check.addEventListener("change", () => {
      checkBoxTab = Array.from(document.querySelectorAll(".checkBoxSelect"));
      let isSomeChecked = checkBoxTab.some((item) => item.checked);
      if (!document.getElementById("btnDelChecked")) {
        btnDelChecked = document.createElement("button");
        btnDelChecked.textContent = "Remove all";
        btnDelChecked.id = "btnDelChecked";
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
};
const createActionsBtns = (parent, index) => {
  const activeBtn = document.querySelector(".active").innerText.toLowerCase();
  const showBtn = document.createElement("button");
  showBtn.textContent = "✙";
  showBtn.className = "showBtn";
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "deleteBtn";
  // deleteBtn.textContent = "✘";
  const checkBox = document.createElement("input");
  checkBox.className = "checkBoxSelect";
  checkBox.type = "checkbox";
  const $td = document.createElement("td");
  $td.className = "actions-buttons";
  $td.append(showBtn, deleteBtn, checkBox);
  parent.append($td);

  showBtn.addEventListener("click", () => {
    createInfo(activeBtn, index);
    document.getElementById("closeInfoBtn").addEventListener("click", () => {
      document.getElementById("showInfoBox").remove();
      $body.style.overflow = "auto";
    });
  });
  deleteBtn.addEventListener("click", () => {
    parent.remove();
    pagination();
  });
};
const setColor = (select) => {
  switch (select) {
    case 1:
      document.documentElement.style.setProperty(
        "--mainColor",
        "rgb(0, 255, 21)"
      );
      document.documentElement.style.setProperty(
        "--btnBgHoverColor",
        "rgba(0, 255, 0, 0.425)"
      );
      document.documentElement.style.setProperty(
        "--btnHoverColor",
        "rgb(241, 206, 206)"
      );
      document.documentElement.style.setProperty(
        "--infoColor",
        " rgb(0, 70, 0)"
      );
      break;
    case 2:
      document.documentElement.style.setProperty(
        "--mainColor",
        "rgb(255, 0, 0)"
      );
      document.documentElement.style.setProperty(
        "--btnBgHoverColor",
        "rgba(255, 0, 0, 0.425)"
      );
      document.documentElement.style.setProperty(
        "--btnHoverColor",
        "rgb(241, 206, 206)"
      );
      document.documentElement.style.setProperty(
        "--infoColor",
        " rgb(70, 0, 0)"
      );
      break;
    case 3:
      document.documentElement.style.setProperty(
        "--mainColor",
        "rgb(0, 225, 255)"
      );
      document.documentElement.style.setProperty(
        "--btnBgHoverColor",
        "rgba(0, 225, 255, 0.425)"
      );
      document.documentElement.style.setProperty(
        "--btnHoverColor",
        "rgb(206, 241, 241)"
      );
      document.documentElement.style.setProperty(
        "--infoColor",
        "rgb(0, 0, 70)"
      );
      break;

    default:
      break;
  }
};
const createInfo = (btnName, index) => {
  if (document.getElementById("showInfoBox")) {
    document.getElementById("showInfoBox").remove();
  }
  const infoRow = rowData[btnName][index];
  const windowInfo = document.createElement("div");
  $body.style.overflow = "hidden";
  windowInfo.id = "showInfoBox";
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
      if (key === "opening_crawl") {
        value = value.split("\\r\\n").join("<br>");
      }
      infoContent.innerHTML += `<li><strong>${key.toUpperCase()}:</strong>  ${value}</li>`;
    });
    infoContent.innerHTML += "</ul>";
  }
};
const createData = () => {
  const activeBtn = document.querySelector(".active").innerText.toLowerCase();
  if (document.getElementById("nothing-to-show"))
    document.getElementById("nothing-to-show").remove();
  const rowKeys = Object.keys(rowData[activeBtn][0]);
  const $thead = document.getElementById("table-head");
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
    $tr.id = `row-${index}`;
    const $td1 = document.createElement("td");
    const $td2 = document.createElement("td");
    const $td3 = document.createElement("td");
    const $td4 = document.createElement("td");
    const $td5 = document.createElement("td");
    $td1.innerHTML = `${index + 1}`;
    $td2.innerHTML = `${element[head1]}`;
    $td3.innerHTML = `${element[head2].split("\\r\\n").join("<br>")}`;
    $td4.innerHTML = `${element[head3]}`;
    $td5.innerHTML = `${formatDate(element.created)}`;
    $tr.append($td1, $td2, $td3, $td4, $td5);
    tbody.append($tr);
    createActionsBtns($tr, index);
  });
  checkBoxAddListener();
};
const checkButtonPages = () => {
  const btnChange = document.querySelectorAll(".btn-pages");
  const allPages = document.getElementById("all-pages");
  const currPage = document.getElementById("curr-page");
  if (allPages.innerText === "1") {
    btnChange[0].disabled = true;
    btnChange[1].disabled = true;
  } else {
    //musi sprawdzać czy pusty string bo jak nie to można pójść np na stronę 2
    //wejść poza zakres tj ustawić stronę na 1 i wtedy przyciskiem wejść na minusowe strony
    if (currPage.value !== "") {
      btnChange[0].disabled = false;
      btnChange[1].disabled = false;
      if (parseInt(currPage.value) === 1) {
        btnChange[0].disabled = true;
      } else {
        btnChange[0].disabled = false;
      }
      if (parseInt(currPage.value) === parseInt(allPages.innerText)) {
        btnChange[1].disabled = true;
      } else {
        btnChange[1].disabled = false;
      }
    } else {
      btnChange[0].disabled = true;
      btnChange[1].disabled = true;
    }
  }
};
const searchByIndex = (search = "") => {
  const tBodyRows = Array.from(document.querySelectorAll("#table-body tr"));
  tBodyRows.forEach((element) => {
    element.removeAttribute("class");
    // // zawiera nr indexu
    // if (
    //   !element
    //     .querySelector("td")
    //     .innerText.toLowerCase()
    //     .includes(search.toLowerCase())
    // )
    // pokazuje wyłącznie ten index
    if (
      search !== "" &&
      element.querySelector("td").innerText.toLowerCase() !==
        search.toLowerCase()
    )
      element.className = "disabled";
  });
  pagination();
};
const searchByText = (text = "") => {
  const tBodyRows = Array.from(document.querySelectorAll("#table-body tr"));
  tBodyRows.forEach((element) => {
    element.removeAttribute("class");
    if (
      !element
        .querySelector("td ~ td")
        .innerText.toLowerCase()
        .includes(text.toLowerCase())
    )
      element.className = "disabled";
  });
  pagination();
};
const pagination = () => {
  const tBody = Array.from(document.querySelectorAll("#table-body tr"));
  const tBodyClassless = Array.from(
    document.querySelectorAll("#table-body tr:not([class])")
  );
  const allPages = document.getElementById("all-pages");
  const currPageValue =
    parseInt(document.getElementById("curr-page").value) || 1;
  const pagesValue = parseInt(document.getElementById("amount-item").value);
  const tempAllPages =
    Math.ceil(tBodyClassless.length / pagesValue) > 0
      ? Math.ceil(tBodyClassless.length / pagesValue)
      : 1;
  allPages.innerText = `${tempAllPages}`;
  if (document.getElementById("nothing-to-show") !== null)
    document.getElementById("nothing-to-show").remove();
  if (currPageValue > 1 && currPageValue > allPages.innerText) {
    document.getElementById("curr-page").value--;
    pagination();
  } else {
    if (
      tBodyClassless.length === 0 &&
      document.getElementById("nothing-to-show") === null
    ) {
      const nothingToShow = document.createElement("tr");
      nothingToShow.id = "nothing-to-show";
      nothingToShow.innerHTML += `<td></td><td>"Brak elementów do wyświetlenia"</td>`;
      document.getElementById("table-body").append(nothingToShow);
    } else {
      tBodyClassless.forEach((element, index) => {
        if (Math.floor(index / pagesValue) === currPageValue - 1) {
          element.removeAttribute("style");
        } else {
          element.style.display = "none";
        }
      });
    }
    checkButtonPages();
  }
  const searchById = document.getElementById("input-search-index");
  searchById.placeholder = `${tBody.length === 0 ? "0" : "1"} from ${
    tBody.length
  }`;
};

startPage();

const dashboardGrid = document.querySelector(".dashboard__grid");
const currentElement = document.querySelector('[aria-current="true"]');
const currentTimeframe = currentElement.dataset.timeframe;
const timeframeList = document.querySelector(".timeframe-list");

async function getData() {
  const url = "data.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return null;
  }
}

function createActivityCard(activity, timeframeName) {
  const activityCard = document.createElement("article");
  activityCard.classList.add(
    "activity-card",
    `activity-card--${activity.title.toLowerCase().replace(/\s+/g, "-")}`
  );

  const activityCardBody = document.createElement("div");
  activityCardBody.classList.add("activity-card__body");

  const activityCardHeader = document.createElement("header");
  activityCardHeader.classList.add("activity-card__header");

  const activityCardTitle = document.createElement("h2");
  activityCardTitle.classList.add("activity-card__title");
  activityCardTitle.textContent = activity.title;

  const activityCardOptions = document.createElement("button");
  activityCardOptions.classList.add("activity-card__options");
  activityCardOptions.setAttribute(
    "aria-label",
    `Options for ${activity.title}`
  );

  const optionsIcon = document.createElement("img");
  optionsIcon.src = "./images/icon-ellipsis.svg";
  optionsIcon.alt = "";

  activityCardOptions.appendChild(optionsIcon);
  activityCardHeader.append(activityCardTitle, activityCardOptions);

  const activityCardStats = document.createElement("div");
  activityCardStats.classList.add("activity-card__stats");

  const currentTime = document.createElement("p");
  currentTime.textContent = `${activity.timeframes[timeframeName].current}hrs`;
  currentTime.classList.add("activity-card__current-time");

  const previousTime = document.createElement("p");
  let label = "";
  switch (timeframeName) {
    case "weekly":
      label = "Last Week";
      break;
    case "monthly":
      label = "Last Month";
      break;
    default:
      label = "Yesterday";
      break;
  }
  previousTime.textContent = `${label} - ${activity.timeframes[timeframeName].previous}hrs`;
  previousTime.classList.add("activity-card__previous-time");

  activityCardStats.append(currentTime, previousTime);
  activityCardBody.append(activityCardHeader, activityCardStats);
  activityCard.appendChild(activityCardBody);

  return activityCard;
}

async function init() {
  const data = await getData();
  if (!data) {
    console.error("Failed to fetch activity data. Cannot build dashboard");
    return;
  }
  for (const activity of data) {
    const activityCard = createActivityCard(activity, currentTimeframe);
    dashboardGrid.appendChild(activityCard);
  }
}

init();

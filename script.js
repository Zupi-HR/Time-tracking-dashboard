const dashboardGrid = document.querySelector(".dashboard__grid");
const timeframeList = document.querySelector(".timeframe-list");

let activitiesData = [];

const TIMEFRAME_LABELS = {
  weekly: "Last Week",
  monthly: "Last Month",
  daily: "Yesterday",
};

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

  previousTime.textContent = `${TIMEFRAME_LABELS[timeframeName]} - ${activity.timeframes[timeframeName].previous}hrs`;
  previousTime.classList.add("activity-card__previous-time");

  activityCardStats.append(currentTime, previousTime);
  activityCardBody.append(activityCardHeader, activityCardStats);
  activityCard.appendChild(activityCardBody);
  return activityCard;
}

function updateDashboard(timeframe) {
  const currentActiveBtn = timeframeList.querySelector('[aria-current="true"]');
  currentActiveBtn?.removeAttribute("aria-current");
  const newActiveBtn = timeframeList.querySelector(
    `[data-timeframe="${timeframe}"]`
  );
  newActiveBtn?.setAttribute("aria-current", "true");
  renderCards(timeframe);
}

function renderCards(timeframe) {
  dashboardGrid
    .querySelectorAll(".activity-card")
    .forEach((card) => card.remove());

  if (!activitiesData || activitiesData.length === 0) {
    console.error("Failed to read activity data. Data is invalid or empty!");
    return;
  }
  const fragment = document.createDocumentFragment();
  for (const activity of activitiesData) {
    const activityCard = createActivityCard(activity, timeframe);
    fragment.appendChild(activityCard);
  }
  dashboardGrid.appendChild(fragment);
}

function handleTimeframeClick(event) {
  const clickedButton = event.target.closest(".timeframe-btn");
  if (!clickedButton || clickedButton.hasAttribute("aria-current")) {
    return;
  }
  const selectedTimeframe = clickedButton.dataset.timeframe;
  updateDashboard(selectedTimeframe);
}

async function init() {
  activitiesData = await getData();
  if (!activitiesData) return;
  const initialTimeFrame = "weekly";
  updateDashboard(initialTimeFrame);
  timeframeList.addEventListener("click", handleTimeframeClick);
}

init();

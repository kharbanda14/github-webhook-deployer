/*Toggle dropdown list*/
/*https://gist.github.com/slavapas/593e8e50cf4cc16ac972afcbad4f70c8*/

var userMenuDiv = document.getElementById("userMenu");
var userMenu = document.getElementById("userButton");

var navMenuDiv = document.getElementById("nav-content");
var navMenu = document.getElementById("nav-toggle");

document.onclick = check;

function check(e) {
  var target = (e && e.target) || (event && event.srcElement);

  // User Menu
  if (!checkParent(target, userMenuDiv)) {
    // click NOT on the menu
    if (checkParent(target, userMenu)) {
      // click on the link
      if (userMenuDiv.classList.contains("invisible")) {
        userMenuDiv.classList.remove("invisible");
      } else {
        userMenuDiv.classList.add("invisible");
      }
    } else {
      // click both outside link and outside menu, hide menu
      userMenuDiv.classList.add("invisible");
    }
  }

  // Nav Menu
  if (!checkParent(target, navMenuDiv)) {
    // click NOT on the menu
    if (checkParent(target, navMenu)) {
      // click on the link
      if (navMenuDiv.classList.contains("hidden")) {
        navMenuDiv.classList.remove("hidden");
      } else {
        navMenuDiv.classList.add("hidden");
      }
    } else {
      // click both outside link and outside menu, hide menu
      navMenuDiv.classList.add("hidden");
    }
  }
}

function checkParent(t, elm) {
  while (t.parentNode) {
    if (t == elm) {
      return true;
    }
    t = t.parentNode;
  }
  return false;
}

// request for notification permission
Notification.requestPermission().then((status) => {
  console.log("Notification Status", status);
});

axios.defaults.baseURL = baseUrl;

const dashboardWs = io("/dashboard", {
  query: {
    token: wsToken,
  },
});

dashboardWs.on("notification", (data) => {
  let notify = new Notification(data.title, {
    body: data.body,
  });
  if (data.action) notify.onclick = () => window.open(data.action);
});

function deleteApp(appId) {
  if (confirm("Are you sure?")) {
    axios
      .delete(["dashboard/apps/delete", appId].join("/"))
      .then(() => window.location.reload())
      .catch(() => alert("There was an error deleting app"));
  }
}

function toggleAppState(appId) {
  if (confirm("Are you sure?")) {
    axios
      .put(["dashboard/apps/app-state", appId].join("/"))
      .then(() => window.location.reload())
      .catch(() => alert("There was an error deleting app"));
  }
}

function activityFeed() {
  return {
    feed: [],
    message: "Hello world",

    init() {
      this.getFeed();
      dashboardWs.on("activity", (data) => {
        console.log("New Activtiy", data);
        this.feed.unshift(data);
      });
    },

    getFeed() {
      axios
        .get("dashboard/activity/recent")
        .then((res) => {
          this.feed = res.data;
        })
        .catch(() => alert("There was an error getting data"));
    },
  };
}

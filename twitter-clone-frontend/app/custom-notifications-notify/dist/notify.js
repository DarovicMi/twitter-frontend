let wrapper = undefined;

if (document.querySelector(".wrapper__notify") == null) {
  wrapper = document.createElement("div");
  wrapper.classList.add("wrapper__notify");
}

class Notify {
  constructor(title, description, type = "info", userOptions = {}) {
    this.title = title;
    this.description = description;
    this.type = type;
    this.userOptions = userOptions;
    this.init();
  }

  init() {
    if (this.title.length > 0 && this.description.length > 0) {
      this.createNotifySkeleton();
    } else {
      if (this.title <= 0) {
        console.error("Incorrect title");
      }
      if (this.description.length <= 0) {
        console.error("Incorrect description");
      }
    }
  }

  createOptions() {
    let options = {
      vAlign: "top",
      hAlign: "right",
      autoClose: true,
      autoCloseDuration: 5000,
      closeOnCrossClick: true,
      closeOnNotifyClick: false,
    };
    this.options = options;
  }

  setNotifyOptions() {
    let uOpt = this.userOptions;
    let opt = this.options;

    if (uOpt.hasOwnProperty("vAlign")) {
      let vAlignArr = ["top", "bottom"];
      if (uOpt.vAlign !== opt.vAlign && vAlignArr.includes(uOpt.vAlign)) {
        opt.vAlign = uOpt.vAlign;
      }
    }
    if (uOpt.hasOwnProperty("hAlign")) {
      let hAlignArr = ["left", "right"];
      if (uOpt.hAlign !== opt.hAlign && hAlignArr.includes(uOpt.hAlign)) {
        opt.hAlign = uOpt.hAlign;
      }
    }
    if (uOpt.hasOwnProperty("autoClose")) {
      if (
        uOpt.autoClose !== opt.autoClose &&
        typeof uOpt.autoClose == "boolean"
      ) {
        opt.autoClose = uOpt.autoClose;
      }
    }
    if (uOpt.hasOwnProperty("autoCloseDuration")) {
      if (uOpt.autoCloseDuration != opt.autoCloseDuration) {
        opt.autoCloseDuration = uOpt.autoCloseDuration;
      }
    }
    if (uOpt.hasOwnProperty("closeOnCrossClick")) {
      if (
        uOpt.closeOnCrossClick !== opt.closeOnCrossClick &&
        typeof uOpt.closeOnCrossClick == "boolean"
      ) {
        opt.closeOnCrossClick = uOpt.closeOnCrossClick;
      }
    }
    if (uOpt.hasOwnProperty("closeOnNotifyClick")) {
      if (
        uOpt.closeOnNotifyClick !== opt.closeOnNotifyClick &&
        typeof uOpt.closeOnNotifyClick == "boolean"
      ) {
        opt.closeOnNotifyClick = uOpt.closeOnNotifyClick;
      }
    }

    this.options = opt;
  }

  configureNotifyPosition() {
    const notifyContainer = this.notifyContainer;
    const wrapper = notifyContainer.parentElement;
    const opt = this.options;

    if (opt.hAlign === "left") {
      wrapper.classList.add("hLeft");
      wrapper.classList.remove("hRight");
    } else {
      wrapper.classList.add("hRight");
      wrapper.classList.remove("hLeft");
    }

    if (opt.vAlign === "bottom") {
      wrapper.classList.add("vBottom");
      wrapper.classList.remove("vTop");
    } else {
      wrapper.classList.add("vTop");
      wrapper.classList.remove("vBottom");
    }
  }

  createNotifySkeleton() {
    this.createOptions();
    this.setNotifyOptions();

    const body = document.querySelector("body");

    const notifyContainer = document.createElement("div");
    notifyContainer.classList.add("notify__container");
    notifyContainer.classList.add("notify__show");

    const notifyClose = document.createElement("div");
    notifyClose.classList.add("notify__close");

    const notifyTitle = document.createElement("div");
    notifyTitle.classList.add("notify__title");

    const notifyDescription = document.createElement("div");
    notifyDescription.classList.add("notify__description");

    wrapper.appendChild(notifyContainer);
    notifyContainer.appendChild(notifyClose);
    notifyContainer.appendChild(notifyTitle);
    notifyContainer.appendChild(notifyDescription);

    body.prepend(wrapper);

    this.notifyContainer = notifyContainer;

    this.configureNotifyPosition();

    this.checkTypeOfWarn();
  }

  checkTypeOfWarn() {
    let type = this.type;
    let typeStyle = {};
    switch (type) {
      case "info":
        typeStyle = {
          background: "#4fa0d6f0",
          backgroundHover: "#3498db",
        };
        this.setStyleOfType(typeStyle);
        break;
      case "success":
        typeStyle = {
          background: "#76c798f0",
          backgroundHover: "#2ecc71",
        };
        this.setStyleOfType(typeStyle);
        break;
      case "warning":
        typeStyle = {
          background: "#ecad48f0",
          backgroundHover: "#f39c12",
        };
        this.setStyleOfType(typeStyle);
        break;
      case "error":
        typeStyle = {
          background: "#e74c3cf0",
          backgroundHover: "#e74c3c",
        };
        this.setStyleOfType(typeStyle);
        break;
      case "notify":
        typeStyle = {
          background: "#555555f0",
          backgroundHover: "#333",
        };
        this.setStyleOfType(typeStyle);
        break;
      default:
        typeStyle = {
          background: "#4fa0d6f0",
          backgroundHover: "#3498db",
        };
        this.setStyleOfType(typeStyle);
        break;
    }
  }
  setStyleOfType(type) {
    const notifyContainer = this.notifyContainer;
    notifyContainer.style.backgroundColor = type.background;
    notifyContainer.addEventListener("mouseenter", function () {
      notifyContainer.style.backgroundColor = type.backgroundHover;
    });
    notifyContainer.addEventListener("mouseleave", function () {
      notifyContainer.style.backgroundColor = type.background;
    });

    this.notifyLoadData();
  }

  notifyLoadData() {
    const notifyContainer = this.notifyContainer;
    const notifyTitle = notifyContainer.querySelector(".notify__title");
    const notifyDescription = notifyContainer.querySelector(
      ".notify__description"
    );
    const notifyClose = notifyContainer.querySelector(".notify__close");

    notifyTitle.innerHTML = `<p>${this.title}</p>`;
    notifyDescription.innerHTML = `<p>${this.description}</p>`;

    let that = this;
    let opt = this.options;

    if (opt.autoClose) {
      setTimeout(() => {
        that.closeNotify();
      }, opt.autoCloseDuration);
    }

    if (!opt.closeOnCrossClick) {
      const crossElement = notifyContainer.querySelector(".notify__close");
      crossElement.remove();
    }

    if (opt.closeOnNotifyClick) {
      notifyContainer.addEventListener("click", () => {
        that.closeNotify();
      });
    }

    notifyClose.addEventListener("click", function () {
      that.closeNotify();
    });
  }

  closeNotify() {
    const notifyContainer = this.notifyContainer;
    notifyContainer.style.display = "none";
    notifyContainer.remove();
  }
}

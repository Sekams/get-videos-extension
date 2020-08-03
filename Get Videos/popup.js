function Notification(options) {
  let el = this;

  el.self = $(".toast-message");
  el.close = this.self.find(".close");
  el.message = el.self.find(".message");
  el.top = options.topPos;
  el.classNames = options.classNames;
  el.autoClose =
    typeof options.autoClose === "boolean" ? options.autoClose : false;
  el.autoCloseTimeout =
    options.autoClose && typeof options.autoCloseTimeout === "number"
      ? options.autoCloseTimeout
      : 3000;

  // Methods
  el.reset = function () {
    el.message.empty();
    el.self.removeClass(el.classNames);
  };
  el.show = function (msg, type) {
    el.reset();
    el.self.css("top", el.top);
    el.message.text(msg);
    el.self.addClass(type);

    if (el.autoClose) {
      setTimeout(function () {
        el.hide();
      }, el.autoCloseTimeout);
    }
  };
  el.hide = function () {
    el.self.css("top", "-100%");
    el.reset();
  };

  el.close.on("click", this.hide);
}

const showToast = (msg, type) => {
  let notification = new Notification({
    topPos: 10,
    classNames: "success danger",
    autoClose: true,
    autoCloseTimeout: 3000,
  });

  notification.show(msg, type);
};

document.addEventListener(
  "DOMContentLoaded",
  () => {
    try {
      const container = document.querySelector(".container");
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentTab = tabs[0];
        chrome.tabs.sendMessage(currentTab.id, { action: "getDOM" }, function (
          response
        ) {
          const { dom } = response;
          const re = /\<video.*?\/video\>/gi;
          let match,
            count = 0;
          while ((match = re.exec(dom)) != null) {
            const video = match[0];
            const re1 = /src="(.*?)"/gi;
            if (video) {
              count++;
              const src = encodeURI(re1.exec(video)[1]);
              navigator.clipboard.writeText(currentTab.title).then(
                function () {
                  showToast("Title Copied to Clipboard!", "success");
                },
                function (err) {
                  showToast("Title Copy Failed!", "danger");
                }
              );
              container.innerHTML += `
                    <div class="video-container">
                        <a href="${src}" target="_blank">
                            <video autoplay muted loop src="${src}" poster="img/loading.gif">
                            </video>
                        </a>
                        <a class="submit-btn" href="${src}" download>
                            Download
                        </a>
                    </div>
                `;
            }
          }
        });
      });
    } catch (error) {
        showToast("Something Went Wrong", "danger");
    }
  },
  false
);

(function () {
  const hostName = 'https://XXXXXXXXXXXXXX';
  const app = {
    GiftCardWidget: null,

    // Host: "https://greeting-cards-freshcut.onthemap.com",
    Host: "https://XXXXXXXXXXXXXX",

    Routes: {
      Settings: "/api/widget",
    },

    Settings: {
      popup: {
        title: "Personalize card",
      },
      cards: [
        {
          id: "12321312321",
          title: "Card title",
          image_url: "String",
          max_characters: 33,
        },
      ],
    },
    CDN: {
      // Style:
      //   "https://otm-cdn-private.s3.amazonaws.com/gift-card-generator.min.css",
      // Script:
      //   "https://otm-cdn-private.s3.amazonaws.com/giftcard-generator.min.js",
      Style: "https://XXXXXXXXXXXXXX/public/gift-card-generator.min.css",
      Script: "https://XXXXXXXXXXXXXX/public/giftcard-generator.min.js",
    },

    Name: "GiftCardWidget",

    Run: function () {
      const shop = Shopify.shop;
      app.LoadSettings(shop, function (settings) {
        app.Settings = settings;
        if (!settings.settings.appEnabled) {
          const collectionButtons = document.querySelectorAll(
            ".product-action-buttons"
          );
          if (collectionButtons) {
            collectionButtons.forEach((el) => {
              el.classList.add("greeting-cards-disabled");
            });
          }
          return;
        }

        app.AppendGiftCardWidget(function () {
          app.AccessibilityWidget = app.ConfigurePlugin(app.Settings);
        });
      });
    },

    Request: function (url, type, data = null) {
      return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();

        xhr.open(type, url);

        if (type === "POST") {
          xhr.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
          );
        }

        xhr.onload = function () {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject("The request failed!");
          }
        };

        xhr.send(data);
      });
    },

    Get: function (url) {
      return app.Request(url, "GET");
    },

    LoadSettings: function (shop, callback) {
      const settingsLoaded = function (settings) {
        callback(settings.payload);
      };

      const settingsUrl = app.Host + app.Routes.Settings;

      app
        .Get(settingsUrl + "?shop=" + shop)
        .then(settingsLoaded)
        .catch(function (err) {
          console.error("Something wen't wrong. %s", err);
        });
    },
    AppendGiftCardWidget: function (callback) {
      const cssLink = this.CDN.Style;

      if (
        !document.querySelectorAll('link[href="' + cssLink + '"]').length > 0
      ) {
        var style = document.createElement("link");
        style.href = cssLink;
        style.rel = "stylesheet";
        document.head.appendChild(style);
      }

      const scriptSrc = this.CDN.Script;

      if (!document.querySelectorAll('[src="' + scriptSrc + '"]').length > 0) {
        var script = document.createElement("script");
        script.src = scriptSrc;
        script.async = true;
        script.type = "text/javascript";

        script.onload = callback;
        document.head.appendChild(script);
      }
    },
    ConfigurePlugin: function (settings) {
      GiftCardWidget(settings);
    },
  };

  if (window["GiftCardWidget"]) {
    return;
  }

  app.Run();

  window["GiftCardWidget"] = app;
})();

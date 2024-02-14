import dayjs from 'dayjs';
export default function(app) {
  app.directive("format-time", {
    mounted(el, bindings) {
      let formatString = "YYYY-MM-DD HH:mm:ss";
      if (bindings.value) {
        formatString = bindings.value;
      }

      const formatTimestamp = (textContent) => {
        let timestamp = parseInt(textContent, 10);
        if (!isNaN(timestamp)) {
          if (textContent.length === 10) {
            timestamp *= 1000;
          }
          return dayjs(timestamp).format(formatString);
        }
        return textContent; 
      };

      el.textContent = formatTimestamp(el.textContent);
    },
    updated(el, bindings) {
      let formatString = "YYYY-MM-DD HH:mm:ss";
      if (bindings.value) {
        formatString = bindings.value;
      }

      console.log(el.dataset.timestamp, el.textContent, bindings.value);

      const formatTimestamp = (textContent) => {
        let timestamp = parseInt(textContent, 10);
        if (!isNaN(timestamp)) {
          // if (textContent.length === 10) {
          //   timestamp *= 1000;
          // }
          return dayjs(timestamp).format(formatString);
        }
        return textContent;
      };

      el.textContent = formatTimestamp(el.dataset.timestamp);
    }
  });

  app.directive("focus", {
    mounted(el) {
      el.focus();
    }
  });
}

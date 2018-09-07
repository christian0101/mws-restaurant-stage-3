/**
 * Toast notifications.
 */

let queue = [];

/**
 * Toast ntification contructor.
 */
function Toast(text, duration, buttons) {
  const toast = this;

  this.answer = new Promise(function(resolve) {
    toast._answerResolver = resolve;
  });

  this.gone = new Promise(function(resolve) {
    toast._goneResolver = resolve;
  });
}

/**
 * Create toast notification.
 * @param message text message to display
 * @param duration time in seconds before dismissing
 * @param buttons array of buttons
 */
Toast.prototype.create = (message = 'No message', duration = null, buttons = ['dismiss']) => {
  const toast = new Toast(message, duration, buttons);

  const toastElement = document.createElement('div');
  toastElement.id = 'toast';
  toastElement.className = 'toast';
  toastElement.tabIndex = '-1';
  const textElement = document.createElement('span');
  textElement.innerHTML = message;
  textElement.className = 'toast-text';
  toastElement.appendChild(textElement);

  if (buttons) {
    const buttonsElement = document.createElement('span');
    buttonsElement.className = 'toast-buttons'
    buttons.forEach((button) => {
      const toastButton = document.createElement('button');
      toastButton.id = button;
      toastButton.innerHTML = button;
      toastButton.className = 'unbutton';
      buttonsElement.appendChild(toastButton);
    });
    toastElement.appendChild(buttonsElement);

    buttonsElement.addEventListener('click', function(event) {
      const button = event.target;
      if (!button) return;
      toast._answerResolver(button.innerHTML);
      toast.dismiss(toastElement, toast);
    });

    buttonsElement.addEventListener('scroll', function(event) {
      if (buttonsElement.scrollLeft > 10) {
        textElement.className = 'toast-text_scrolled';
      } else {
        textElement.className = 'toast-text';
      }
    });
  }

  if (duration) {
    setTimeout(() => {
      toast.dismiss(toastElement, toast);
    }, duration * 1000);
  }

  queue.push(toastElement);
  toast.show(toast);

  return toast;
}

/**
 * Display toast notification from queue.
 */
Toast.prototype.show = (toast) => {
  if (!document.getElementById('toast')) {
    const notification = queue.shift();
    document.body.appendChild(notification);
    notification.focus();
  }
}

/**
 * Dismiss toast notification.
 */
Toast.prototype.dismiss = (toastElement, toast) => {
  toast._answerResolver();

  toastElement.classList.add('toast-dismissed');

  setTimeout(() => {
    toastElement.parentNode.removeChild(toastElement);
    if (queue.length > 0) {
      toast.show();
    }
  }, 450);

  return this.gone;
}

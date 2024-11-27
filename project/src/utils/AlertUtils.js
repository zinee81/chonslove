import Swal from "sweetalert2";

export function ShowAlert(icon, title, html, useTimer = true) {
  const options = {
    icon,
    title,
    html,
    confirmButtonText: "확인",
    customClass: {
      confirmButton: "swal2-confirm",
    },
  };

  if (useTimer) {
    options.timer = 2000;
  }

  return Swal.fire(options);
}

export function ShowConfirm(icon, title, html) {
  return Swal.fire({
    icon,
    title,
    html,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "확인",
    cancelButtonText: "취소",
  });
}

export function ShowLoading(title, html = "") {
  Swal.fire({
    title,
    html,
    allowEscapeKey: false,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
    customClass: {
      confirmButton: "swal2-customLoading",
    },
  });
}

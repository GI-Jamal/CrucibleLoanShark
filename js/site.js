const tooltipTriggerList = document.querySelectorAll(
  '[data-bs-toggle="tooltip"]'
);
const tooltipList = [...tooltipTriggerList].map(
  (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

function displayMessage() {
  let msg = document.getElementById("message").value;
  //alert(msg);

  Swal.fire({
    backdrop: false,
    title: "App Name",
    text: msg,
  });
}
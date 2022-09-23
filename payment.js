// pagos

let paymentBtn = document.querySelector("btn-payment");

paymentBtn.addEventListener("click", function (event) {
  event.preventDefault();
  paymentBtn.addEventListener("click", () => {
    Swal.fire({
      title: "¿Estas seguro de realizar el pago?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "¡Listo, pedido realizado!",
          "Recibiras un mail con el pedido que realizaste.",
          "success"
        );
      }
    });
  });
});

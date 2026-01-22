async function payNow() {
  try {
    const res = await fetch("http://localhost:4000/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId: "course_001" })
    });

    const data = await res.json();
    const order = data.order;

    const options = {
      key: "rzp_test_S6VMein9qvkkDl",
      amount: order.amount,          
      currency: "INR",
      name: "Demo Payment",
      description: "₹10 Test Payment",
      order_id: order.id,

      handler: function (response) {
        console.log(response);

        fetch("http://localhost:4000/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          })
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              alert("Payment Verified");
            } 
            else {
              alert("Verification Failed");
            }
          });
      },

      modal: {
        ondismiss: function () {
          alert("Payment popup closed");
        }
      },

      prefill: {
        name: "Shailesh Mangal",
        email: "mangalshailesh100@gmail.com",
        contact: "9588868194"
      },

      theme: { color: "#3399cc" }
    };

    const rzp = new Razorpay(options);
    rzp.open();

  } 
  catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
}

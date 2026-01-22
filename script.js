async function payNow() {
    try {
      // 1️⃣ Create order from backend
      const res = await fetch("https://payment-int-production.up.railway.app/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: 100
        })
      });
  
      const data = await res.json();
      const order = data.order;
  
      // 2️⃣ Razorpay options
      const options = {
        key: "rzp_test_S6VMein9qvkkDl", 
        amount: order.amount,
        currency: "INR",
        name: "Demo Payment",
        description: "Test Transaction",
        order_id: order.id,
  
        handler: async function (response) {
          // 3️⃣ Verify payment on backend
          const verifyRes = await fetch("https://payment-int-production.up.railway.app/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });
  
          const verifyData = await verifyRes.json();
  
          if (verifyData.success) {
            alert("Payment Successful ✅");
          } else {
            alert("Payment Verification Failed ❌");
          }
        },
  
        prefill: {
          name: "Shailesh",
          email: "mangalshailesh100@gmail.com",
          contact: "9588868194"
        },
        theme: {
          color: "#3399cc"
        }
      };
  
      // 4️⃣ Open Razorpay popup
      const rzp = new Razorpay(options);
      rzp.open();
  
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  }
  
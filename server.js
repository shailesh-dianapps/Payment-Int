require("dotenv").config();

const express = require("express");
const razorpay = require("./razorpay");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Razorpay Server Running");
});

/* ========= CREATE ORDER ========= */
app.post("/create-order", async (req, res) => {
  try{
    const { courseId } = req.body;

    // Backend-controlled pricing
    const COURSE_PRICES = {
      course_001: 10 // ₹10 ONLY
    };

    const amount = COURSE_PRICES[courseId];

    if(!amount){
      return res.status(400).json({
        success: false,
        message: "Invalid course"
      });
    }

    const options = {
      amount: amount * 100, // ₹10 → 1000 paise
      currency: "INR",
      receipt: "order_rcptid_" + Date.now()
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({ success: true, order });
  } 
  catch(err){
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/* ========= VERIFY PAYMENT ========= */
app.post("/verify-payment", (req, res) => {
  const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if(expectedSign === razorpay_signature){
    res.json({ success: true, message: "Payment verified" });
  }
  else{
    res.status(400).json({ success: false, message: "Invalid signature" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

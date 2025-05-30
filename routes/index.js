var express = require('express');
var router = express.Router();
require('dotenv').config();
const ecpay_payment = require('ecpay_aio_nodejs');

// console.log(process.env)
const {MERCHANTID, HASHKEY, HASHIV, HOST} = process.env

const { TEXT } = process.env
console.log(TEXT)

// 設定檔
const options = {
  "OperationMode": "Test", //Test or Production
  "MercProfile": {
    "MerchantID": MERCHANTID,
    "HashKey": HASHKEY,
    "HashIV": HASHIV
  },
  "ChoosePayment": "ALL",
  // "IgnorePayment": "ATM#CVS#BARCODE#TWQR#BNPL",
  "IgnorePayment": [
//    "Credit",
//    "WebATM",
   "ATM",
   "CVS",
   "BARCODE",
   "AndroidPay",
   "TWQR",
   "ApplePay",
   "BNPL",
  //  "GWPay",
   "WeiXin"
  ],
  "IsProjectContractor": false
}

function getCurrentDateTimeFormatted() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', TEXT });
});

router.post('/return', function(req, res, next) {
  console.log('post =====================================return: ', req.body)
  res.send('1|OK')
})

router.get('/return', function(req, res, next) {
  console.log('get =====================================return: ', req.body) 
  res.send('1|OK')
})

router.get('/checkout', function(req, res, next) {
  // const no = `1234567${Date.now().toString()}`
  // const time = getCurrentDateTimeFormatted()
  // const base_param = {
  //   MerchantTradeNo: no,
  //   MerchantTradeDate: time,
  //   TotalAmount: '100',
  //   TradeDesc: '測試交易描述',
  //   ItemName: '測試商品等',
  //   ReturnURL: '${HOST}/return',
  //   ClientBackURL: '${HOST}/index.html', // 消費者點選此按鈕後，會將頁面導回到此設定的網址
  //   // ChooseSubPayment: '',
  //   // OrderResultURL: '${HOST}/payment_result', // 有別於ReturnURL (server端的網址)，OrderResultURL為特店的client端(前端)網址。消費者付款完成後，綠界會將付款結果參數以POST方式回傳到到該網址。詳細說明請參考付款結果通知。; 若與[ClientBackURL]同時設定，將會以此參數為主
  //   // NeedExtraPaidInfo: '1',
    
  //   // ItemURL: 'http://item.test.tw',
  //   // Remark: '交易備註',
  //   // HoldTradeAMT: '1',
  //   // StoreID: '',
  //   // CustomField1: '',
  //   // CustomField2: '',
  //   // CustomField3: '',
  //   // CustomField4: ''
  // }

  const order = {
    id: `1234567${Date.now().toString()}`,
    price: '700',
    description: '測試'
  }

  const BACKEND_HOST = 'https://demo-pawpawplanet-backend.onrender.com';//config.get('ecpay.backendHost')
  const FRONTEND_HOST = 'https://demo-pawpawplanet-frontend.onrender.com';//config.get('ecpay.frontendHost')
  // const no = `${order.id}_001`
  const time = getCurrentDateTimeFormatted()
  const base_param = {
    MerchantTradeNo: order.id,
    MerchantTradeDate: time,
    TotalAmount: order.price,
    TradeDesc: order.description || '測試交易描述',
    ItemName: '測試訂單',
    ReturnURL: 'https://ecpay-ldg4.onrender.com/return',
    // ReturnURL: `${BACKEND_HOST}/api/order/ecpay-result`,
    ClientBackURL: 'https://ecpay-ldg4.onrender.com/index.html', // 消費者點選此按鈕後，會將頁面導回到此設定的網址
    // OrderResultURL: '${FRONTEND_HOST}/payment_result', // 有別於ReturnURL (server端的網址)，OrderResultURL為特店的client端(前端)網址。消費者付款完成後，綠界會將付款結果參數以POST方式回傳到到該網址。詳細說明請參考付款結果通知。; 若與[ClientBackURL]同時設定，將會以此參數為主
    CustomField1: order.id
  }

  const create = new ecpay_payment(options)
  const html = create.payment_client.aio_check_out_all(base_param)
  console.log(html)


  res.render('checkout', { title: 'Express', html });
});

module.exports = router;

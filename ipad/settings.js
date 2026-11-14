// 外国人用 iPad の設定

// 要望の送り先（Apps Script の受け箱のウェブアプリの URL。…/exec で終わるもの）。
// 空のあいだは試作：送った要望は、同じブラウザの「スタッフ用の受け取り画面.html」にだけ出る。
const REQUEST_URL = "https://script.google.com/macros/s/AKfycbztNwRosDbwMSiAt_LHBz5d7QvHObI2rwAkaN66e74i840T_tBB-D_FRD681yBj8mQ1ww/exec";

// 「同時通訳」ボタンで開く先。
// iPad の「ショートカット」アプリで「Open Translate」という名前のショートカット（中身：App を開く → 翻訳）を作っておくと、
// ボタン1つで Apple の翻訳アプリが開く。院内の自作の翻訳を https で使えるようになったら、その URL に変える。
const TRANSLATE_URL = "shortcuts://run-shortcut?name=Open%20Translate";

// HP に載せた版の印（make_pack.py が足す）
const PACKED_BUILD = true;

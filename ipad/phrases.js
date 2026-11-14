// make_phrases.py が作るファイル。直接は直さない
const PHRASES = [
 {
  "scene": "受付",
  "en": "Hello. Do you have an appointment?",
  "ja": "こんにちは。ご予約はありますか？",
  "audio": "音声/p01.mp3"
 },
 {
  "scene": "受付",
  "en": "Do you have Japanese health insurance?",
  "ja": "日本の健康保険はお持ちですか？",
  "audio": "音声/p02.mp3"
 },
 {
  "scene": "受付",
  "en": "May I see your My Number card or your insurance card?",
  "ja": "マイナ保険証か資格確認書を見せていただけますか？",
  "audio": "音声/p03.mp3"
 },
 {
  "scene": "受付",
  "en": "Without Japanese health insurance, all fees are self-paid. Please read this guide.",
  "ja": "日本の保険がない場合は、全額自己負担です。こちらの案内をお読みください。",
  "audio": "音声/p04.mp3"
 },
 {
  "scene": "受付",
  "en": "Please fill in this form.",
  "ja": "こちらの用紙にご記入ください。",
  "audio": "音声/p05.mp3"
 },
 {
  "scene": "受付",
  "en": "We will use a translation app to talk with you.",
  "ja": "翻訳アプリを使ってお話しします。",
  "audio": "音声/p06.mp3"
 },
 {
  "scene": "受付",
  "en": "Please have a seat. We will call your name.",
  "ja": "おかけになってお待ちください。お名前でお呼びします。",
  "audio": "音声/p07.mp3"
 },
 {
  "scene": "検査・診察",
  "en": "Please come this way.",
  "ja": "こちらへどうぞ。",
  "audio": "音声/p08.mp3"
 },
 {
  "scene": "検査・診察",
  "en": "We will do a test before you see the doctor.",
  "ja": "診察の前に検査をします。",
  "audio": "音声/p09.mp3"
 },
 {
  "scene": "検査・診察",
  "en": "Please watch this short video about the test.",
  "ja": "検査について、短い動画をご覧ください。",
  "audio": "音声/p10.mp3"
 },
 {
  "scene": "検査・診察",
  "en": "Please wait a moment.",
  "ja": "少々お待ちください。",
  "audio": "音声/p11.mp3"
 },
 {
  "scene": "検査・診察",
  "en": "The doctor will see you now.",
  "ja": "先生が診察します。",
  "audio": "音声/p12.mp3"
 },
 {
  "scene": "検査・診察",
  "en": "Are you in pain?",
  "ja": "痛みはありますか？",
  "audio": "音声/p13.mp3"
 },
 {
  "scene": "検査・診察",
  "en": "Please tell us if you feel unwell.",
  "ja": "気分が悪いときは教えてください。",
  "audio": "音声/p14.mp3"
 },
 {
  "scene": "会計",
  "en": "Please wait in the waiting room for your payment slip.",
  "ja": "お会計票ができるまで、待合室でお待ちください。",
  "audio": "音声/p15.mp3"
 },
 {
  "scene": "会計",
  "en": "Please pay at this machine.",
  "ja": "こちらの機械でお支払いください。",
  "audio": "音声/p16.mp3"
 },
 {
  "scene": "会計",
  "en": "We cannot accept QR code payments, such as PayPay.",
  "ja": "PayPay などのQRコード決済は使えません。",
  "audio": "音声/p17.mp3"
 },
 {
  "scene": "会計",
  "en": "Please take this prescription to a pharmacy.",
  "ja": "この処方箋を薬局にお持ちください。",
  "audio": "音声/p18.mp3"
 },
 {
  "scene": "会計",
  "en": "Here is your receipt.",
  "ja": "領収書です。",
  "audio": "音声/p19.mp3"
 },
 {
  "scene": "会計",
  "en": "Thank you. Take care.",
  "ja": "ありがとうございました。お大事に。",
  "audio": "音声/p20.mp3"
 }
];
const COMMON_PHRASES = [
 {
  "en": "One more time, please.",
  "ja": "もう一度お願いします。",
  "audio": "音声/c01.mp3"
 },
 {
  "en": "Please wait a moment.",
  "ja": "少々お待ちください。",
  "audio": "音声/c02.mp3"
 },
 {
  "en": "Are you OK?",
  "ja": "大丈夫ですか？",
  "audio": "音声/c03.mp3"
 },
 {
  "en": "Does it hurt?",
  "ja": "痛いですか？",
  "audio": "音声/c04.mp3"
 },
 {
  "en": "Please relax.",
  "ja": "力を抜いてください。",
  "audio": "音声/c05.mp3"
 },
 {
  "en": "Good. You are doing well.",
  "ja": "いいですよ。その調子です。",
  "audio": "音声/c06.mp3"
 },
 {
  "en": "It is finished. Thank you.",
  "ja": "終わりました。ありがとうございました。",
  "audio": "音声/c07.mp3"
 }
];
const TEST_PHRASES = {
 "01": [
  {
   "en": "Please remove your hearing aids, earrings, and hair clips.",
   "ja": "補聴器・イヤリング・髪どめを外してください。",
   "audio": "音声/t01_01.mp3"
  },
  {
   "en": "Please put on the headphones.",
   "ja": "ヘッドホンをつけてください。",
   "audio": "音声/t01_02.mp3"
  },
  {
   "en": "Press the button when you hear a sound.",
   "ja": "音が聞こえたら、ボタンを押してください。",
   "audio": "音声/t01_03.mp3"
  },
  {
   "en": "Please press the button even if the sound is very soft.",
   "ja": "とても小さい音でも、ボタンを押してください。",
   "audio": "音声/t01_04.mp3"
  },
  {
   "en": "You will hear a rushing noise. Please ignore it.",
   "ja": "「ザー」という音が聞こえます。気にしないでください。",
   "audio": "音声/t01_05.mp3"
  },
  {
   "en": "Now we will test the other ear.",
   "ja": "次は反対の耳を調べます。",
   "audio": "音声/t01_06.mp3"
  },
  {
   "en": "I will put a small device behind your ear.",
   "ja": "耳の後ろに小さな器具を当てます。",
   "audio": "音声/t01_07.mp3"
  },
  {
   "en": "You can take off the headphones.",
   "ja": "ヘッドホンを外してください。",
   "audio": "音声/t01_08.mp3"
  }
 ],
 "02": [
  {
   "en": "Please blow your nose gently.",
   "ja": "やさしく鼻をかんでください。",
   "audio": "音声/t02_01.mp3"
  },
  {
   "en": "I will put a soft tip on your nostril.",
   "ja": "鼻の穴に、やわらかい先端を当てます。",
   "audio": "音声/t02_02.mp3"
  },
  {
   "en": "Please close your mouth.",
   "ja": "口を閉じてください。",
   "audio": "音声/t02_03.mp3"
  },
  {
   "en": "Breathe normally through your nose.",
   "ja": "鼻でふつうに呼吸してください。",
   "audio": "音声/t02_04.mp3"
  },
  {
   "en": "Please do not talk.",
   "ja": "話さないでください。",
   "audio": "音声/t02_05.mp3"
  },
  {
   "en": "Now the other side.",
   "ja": "次は反対側です。",
   "audio": "音声/t02_06.mp3"
  }
 ],
 "03": [
  {
   "en": "I will put a soft tip in your ear.",
   "ja": "耳に、やわらかい先端を当てます。",
   "audio": "音声/t03_01.mp3"
  },
  {
   "en": "Please do not swallow.",
   "ja": "つばを飲み込まないでください。",
   "audio": "音声/t03_02.mp3"
  },
  {
   "en": "Please do not talk.",
   "ja": "話さないでください。",
   "audio": "音声/t03_03.mp3"
  },
  {
   "en": "Please keep your head still.",
   "ja": "頭を動かさないでください。",
   "audio": "音声/t03_04.mp3"
  },
  {
   "en": "You may feel a little pressure.",
   "ja": "少し押される感じがします。",
   "audio": "音声/t03_05.mp3"
  },
  {
   "en": "Now the other ear.",
   "ja": "次は反対の耳です。",
   "audio": "音声/t03_06.mp3"
  }
 ],
 "04": [
  {
   "en": "Do you take blood thinners?",
   "ja": "血をさらさらにする薬を飲んでいますか？",
   "audio": "音声/t04_01.mp3"
  },
  {
   "en": "Have you ever felt faint during a blood test?",
   "ja": "採血で気分が悪くなったことはありますか？",
   "audio": "音声/t04_02.mp3"
  },
  {
   "en": "Does your skin react to alcohol wipes?",
   "ja": "アルコールでかぶれますか？",
   "audio": "音声/t04_03.mp3"
  },
  {
   "en": "Are you allergic to latex?",
   "ja": "ラテックスのアレルギーはありますか？",
   "audio": "音声/t04_04.mp3"
  },
  {
   "en": "Please roll up your sleeve.",
   "ja": "袖をまくってください。",
   "audio": "音声/t04_05.mp3"
  },
  {
   "en": "Please make a light fist.",
   "ja": "軽く手を握ってください。",
   "audio": "音声/t04_06.mp3"
  },
  {
   "en": "You will feel a small prick.",
   "ja": "チクッとします。",
   "audio": "音声/t04_07.mp3"
  },
  {
   "en": "Please open your hand.",
   "ja": "手を開いてください。",
   "audio": "音声/t04_08.mp3"
  },
  {
   "en": "Please press here firmly for about 5 minutes. Do not rub.",
   "ja": "ここを約5分しっかり押さえてください。もまないでください。",
   "audio": "音声/t04_09.mp3"
  }
 ],
 "05": [
  {
   "en": "I will spray medicine into your nose.",
   "ja": "鼻に薬をスプレーします。",
   "audio": "音声/t05_01.mp3"
  },
  {
   "en": "Please sit back and keep your head still.",
   "ja": "深く座って、頭を動かさないでください。",
   "audio": "音声/t05_02.mp3"
  },
  {
   "en": "Breathe slowly through your nose.",
   "ja": "鼻でゆっくり呼吸してください。",
   "audio": "音声/t05_03.mp3"
  },
  {
   "en": "Please say “eee.”",
   "ja": "「イー」と言ってください。",
   "audio": "音声/t05_04.mp3"
  },
  {
   "en": "Raise your hand if you want to stop.",
   "ja": "止めてほしいときは手を挙げてください。",
   "audio": "音声/t05_05.mp3"
  },
  {
   "en": "Please do not eat or drink until the numbness goes away.",
   "ja": "しびれが治まるまで、飲んだり食べたりしないでください。",
   "audio": "音声/t05_06.mp3"
  }
 ],
 "06": [
  {
   "en": "Please lift your chin a little.",
   "ja": "あごを少し上げてください。",
   "audio": "音声/t06_01.mp3"
  },
  {
   "en": "Please keep your head still.",
   "ja": "頭を動かさないでください。",
   "audio": "音声/t06_02.mp3"
  },
  {
   "en": "Please open your mouth wide and say “ahh.”",
   "ja": "口を大きく開けて「アー」と言ってください。",
   "audio": "音声/t06_03.mp3"
  },
  {
   "en": "Please put your mask back on.",
   "ja": "マスクをつけてください。",
   "audio": "音声/t06_04.mp3"
  },
  {
   "en": "Please wait here for the result.",
   "ja": "ここで結果をお待ちください。",
   "audio": "音声/t06_05.mp3"
  }
 ],
 "07": [
  {
   "en": "Please put on the goggles.",
   "ja": "ゴーグルをつけてください。",
   "audio": "音声/t07_01.mp3"
  },
  {
   "en": "Please keep your eyes open.",
   "ja": "目を開けていてください。",
   "audio": "音声/t07_02.mp3"
  },
  {
   "en": "Please look straight ahead.",
   "ja": "まっすぐ前を見てください。",
   "audio": "音声/t07_03.mp3"
  },
  {
   "en": "Please lie down slowly.",
   "ja": "ゆっくり横になってください。",
   "audio": "音声/t07_04.mp3"
  },
  {
   "en": "Please turn your head to the right.",
   "ja": "頭を右に向けてください。",
   "audio": "音声/t07_05.mp3"
  },
  {
   "en": "Please turn your head to the left.",
   "ja": "頭を左に向けてください。",
   "audio": "音声/t07_06.mp3"
  },
  {
   "en": "Please sit up slowly.",
   "ja": "ゆっくり起き上がってください。",
   "audio": "音声/t07_07.mp3"
  },
  {
   "en": "Do you feel dizzy?",
   "ja": "目が回りますか？",
   "audio": "音声/t07_08.mp3"
  }
 ],
 "10": [
  {
   "en": "Please breathe in through your nose, and out through your mouth.",
   "ja": "鼻から吸って、口から吐いてください。",
   "audio": "音声/t10_01.mp3"
  },
  {
   "en": "Please hold this in your mouth, and breathe in slowly.",
   "ja": "これを口にくわえて、ゆっくり吸ってください。",
   "audio": "音声/t10_02.mp3"
  },
  {
   "en": "Please breathe slowly and deeply.",
   "ja": "ゆっくり深く呼吸してください。",
   "audio": "音声/t10_03.mp3"
  },
  {
   "en": "Please continue until I tell you it is finished.",
   "ja": "終わりをお伝えするまで続けてください。",
   "audio": "音声/t10_04.mp3"
  },
  {
   "en": "If you cough a lot, please stop.",
   "ja": "せきが続いたら、やめてください。",
   "audio": "音声/t10_05.mp3"
  }
 ],
 "11": [
  {
   "en": "I will put anesthetic liquid in your ear.",
   "ja": "耳に麻酔の液を入れます。",
   "audio": "音声/t11_01.mp3"
  },
  {
   "en": "Please keep your head still.",
   "ja": "頭を動かさないでください。",
   "audio": "音声/t11_02.mp3"
  },
  {
   "en": "You may feel a slight tingling.",
   "ja": "少しピリピリすることがあります。",
   "audio": "音声/t11_03.mp3"
  },
  {
   "en": "You may hear a sound. Please do not move.",
   "ja": "音がします。動かないでください。",
   "audio": "音声/t11_04.mp3"
  },
  {
   "en": "Please keep water out of your ear.",
   "ja": "耳に水が入らないようにしてください。",
   "audio": "音声/t11_05.mp3"
  }
 ],
 "12": [
  {
   "en": "When did your fever start?",
   "ja": "熱はいつから出ていますか？",
   "audio": "音声/t12_01.mp3"
  },
  {
   "en": "Does anyone in your family have the flu?",
   "ja": "家族にインフルエンザの人はいますか？",
   "audio": "音声/t12_02.mp3"
  },
  {
   "en": "Please wear a mask.",
   "ja": "マスクをつけてください。",
   "audio": "音声/t12_03.mp3"
  },
  {
   "en": "Please wait in this area.",
   "ja": "こちらでお待ちください。",
   "audio": "音声/t12_04.mp3"
  },
  {
   "en": "Please rest and drink plenty of fluids.",
   "ja": "休んで、水分をしっかりとってください。",
   "audio": "音声/t12_05.mp3"
  }
 ],
 "13": [
  {
   "en": "Which ear hurts?",
   "ja": "どちらの耳が痛いですか？",
   "audio": "音声/t13_01.mp3"
  },
  {
   "en": "Does your child have a fever?",
   "ja": "お子さんに熱はありますか？",
   "audio": "音声/t13_02.mp3"
  },
  {
   "en": "Please take all of the medicine as directed.",
   "ja": "薬は言われたとおりに最後まで飲んでください。",
   "audio": "音声/t13_03.mp3"
  },
  {
   "en": "Please avoid swimming for now.",
   "ja": "しばらくプールは控えてください。",
   "audio": "音声/t13_04.mp3"
  },
  {
   "en": "Please come back for a check-up.",
   "ja": "また診察に来てください。",
   "audio": "音声/t13_05.mp3"
  }
 ]
};
const QA = [
 {
  "q": "How much will it cost?",
  "qja": "費用はいくらですか？",
  "en": "With Japanese health insurance, you pay your share, usually 30 percent. Without Japanese insurance, all fees are self-paid: 33,000 yen for a first visit, plus 11,000 yen for each test or ear treatment, such as earwax removal. We will tell you before adding one.",
  "ja": "日本の健康保険があれば、自己負担分（ふつう3割）です。保険がなければ全額自費で、初診33,000円に、検査や耳の処置（耳あか取りなど）1つごとに11,000円を足します。足す前にお伝えします。",
  "audio": "音声/q01.mp3"
 },
 {
  "q": "Can I use my travel insurance?",
  "qja": "旅行保険は使えますか？",
  "en": "Please pay the full amount here first. We will give you a receipt, so you can claim the money from your insurance company later. If you need an English medical certificate, please tell us. There is an extra fee.",
  "ja": "ここで全額お支払いください。領収書をお渡しするので、あとで保険会社に請求してください。英文の診断書が必要なときはお伝えください（別料金）。",
  "audio": "音声/q02.mp3"
 },
 {
  "q": "How much is an English medical certificate?",
  "qja": "英文診断書はいくらですか？",
  "en": "It is 11,000 yen if you were examined with Japanese health insurance, and 22,000 yen without Japanese insurance.",
  "ja": "日本の健康保険で診察した方は11,000円、日本の保険がない方は22,000円です。",
  "audio": "音声/q03.mp3"
 },
 {
  "q": "How can I pay?",
  "qja": "支払い方法は？",
  "en": "You can use cash, credit cards, e-money such as iD and QUICPay, and IC transit cards. QR code payments, such as PayPay, cannot be used.",
  "ja": "現金・クレジットカード・電子マネー（iD・QUICPay）・交通系ICが使えます。PayPay などのQRコード決済は使えません。",
  "audio": "音声/q04.mp3"
 },
 {
  "q": "Where do I get my medicine?",
  "qja": "薬はどこでもらえますか？",
  "en": "Please take your prescription to a pharmacy. The medicine is paid for separately at the pharmacy.",
  "ja": "処方箋を薬局に持って行ってください。お薬代は薬局で別にお支払いください。",
  "audio": "音声/q05.mp3"
 },
 {
  "q": "Do I need an appointment?",
  "qja": "予約は必要ですか？",
  "en": "Yes. Our clinic works by appointment. Online booking needs a Japanese mobile phone number. If you do not have one, please ask our staff. We can book for you.",
  "ja": "はい、予約制です。ネット予約には日本の携帯電話番号が要ります。お持ちでない方はスタッフに声をかけてください。こちらで予約をお取りします。",
  "audio": "音声/q06.mp3"
 },
 {
  "q": "When will I be called?",
  "qja": "いつ呼ばれますか？",
  "en": "We will call you by name. The waiting time depends on how busy we are. Please wait in the waiting room.",
  "ja": "お名前でお呼びします。待ち時間は混み具合によります。待合室でお待ちください。",
  "audio": "音声/q07.mp3"
 },
 {
  "q": "Is there an interpreter?",
  "qja": "通訳はいますか？",
  "en": "Our staff are not native English speakers. We use a translation app. If possible, we recommend coming with someone who can interpret.",
  "ja": "スタッフは英語を母語としていません。翻訳アプリを使ってお話しします。できれば、通訳できる方と一緒に来てください。",
  "audio": "音声/q08.mp3"
 },
 {
  "q": "Can you see children?",
  "qja": "子どもも診てもらえますか？",
  "en": "Yes. Children in elementary and junior high school need to come with a parent or guardian. We do not take blood tests for children.",
  "ja": "はい。小学生・中学生は保護者の方と一緒に来てください。お子さんの採血はしていません。",
  "audio": "音声/q09.mp3"
 },
 {
  "q": "What should I bring?",
  "qja": "持ち物は？",
  "en": "If you have Japanese health insurance, please bring your My Number card or insurance document. Please also bring your medication notebook, referral letters, and test results if you have them.",
  "ja": "日本の健康保険がある方は、マイナ保険証か資格確認書をお持ちください。お薬手帳・紹介状・検査結果もあればお持ちください。",
  "audio": "音声/q10.mp3"
 },
 {
  "q": "When should I come back?",
  "qja": "次はいつ来ればいいですか？",
  "en": "The doctor will tell you. If your symptoms get worse, please come back sooner, or see a doctor.",
  "ja": "医師がお伝えします。症状が悪くなったら、早めに来るか、受診してください。",
  "audio": "音声/q11.mp3"
 },
 {
  "q": "What should I do if I feel very sick at night?",
  "qja": "夜に具合が悪くなったら？",
  "en": "In an emergency, call 119 for an ambulance. For medical advice in Tokyo, you can call #7119. The service is mainly in Japanese.",
  "ja": "緊急のときは119番で救急車を呼んでください。東京では、#7119で医療の相談ができます（主に日本語）。",
  "audio": "音声/q12.mp3"
 },
 {
  "q": "What are your opening hours?",
  "qja": "診療時間は？",
  "en": "Please check our website, kyobashi-ent.com, for the latest hours. We are closed on Wednesday mornings, Saturdays, Sundays, and national holidays.",
  "ja": "最新の診療時間はホームページ（kyobashi-ent.com）をご覧ください。休診日は水曜午前・土曜・日曜・祝日です。",
  "audio": "音声/q13.mp3"
 }
];

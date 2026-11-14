// ============================================================
// 外国の方の予約のお手伝い（ホームページ用・試作）2026-11-13
//   ・ホームページ（kyobashi-ent.com）の右下に小さな事務員を出し、英語・中国語・韓国語で予約を手伝う
//   ・決まった文だけで答える（Claude は使わない。キーも料金も要らない）
//   ・2026-11-13 改：空いている時間（受付の左のパソコンの Claude が、デジスマを見て受け箱に写したもの）だけを出し、
//     選んで送ればその場で予約が確定する（メールを待たない）。そのあと Claude がデジカル・デジスマに登録する
//   ・空きの写しがない・古いときは、前のやり方（希望を書いて申し込み → スタッフがメールで返事）になる
//   ・SUBMIT_URL が空のときは試作：どこにも送らない
//   ・ホームページに載せる前に、理事長の OK をもらう
// ============================================================
(() => {
  if (window.__kyobashiBookingHelp) return;
  window.__kyobashiBookingHelp = true;

  // ---- 設定 ----
  const INST = "e6f0c701-e294-4511-8472-298e16a1e5a0";   // デジスマの医療機関の番号
  const MENUS = {
    foreign:     { id: "e99a7931-99f7-4bad-8571-7e73d09be384", name: "Foreign visitors (first visit)" },   // 日本の保険なし（自費）
    translation: { id: "87de2ac3-6350-4f2f-a4d8-24fde875858d", name: "Translation app" },                  // 日本の保険あり
  };
  const bookUrl = m => `https://patient.digikar-smart.jp/institutions/${INST}/reserve?treatmentMenuId=${MENUS[m].id}&firstVisit=true`;
  const SUBMIT_URL = "https://script.google.com/macros/s/AKfycbwycg_NBq1pDQV2jyHMfdtZRSmiK13qZXu2-W4SZT9da-i6iTwJZx2m0KRCKBa-d3xq/exec";   // 申し込みの受け箱（クリニックのスプレッドシート。2026-11-13 公開。空にすると試作：どこにも送らない）
  // 外国の方の枠は 16:00・16:30 だけ（保険なし・保険ありとも。デジスマの「外国の方・通訳アプリ」の枠。2026-11-14 理事長）
  const FOREIGN_TIMES = ["16:00", "16:30"];
  // 祝日（claude-answer.js と同じ。2027年まで）
  const HOLIDAYS = ["2026-11-03","2026-11-23","2027-01-01","2027-01-11","2027-02-11","2027-02-23","2027-03-21","2027-03-22",
    "2027-04-29","2027-05-03","2027-05-04","2027-05-05","2027-07-19","2027-08-11","2027-09-20","2027-09-23","2027-10-11",
    "2027-11-03","2027-11-23"];

  // ---- 文（英・中・韓） ----
  const T = {
    fab:      { en: "Booking help", zh: "预约帮助", ko: "예약 도움" },
    title:    { en: "Booking help for international patients", zh: "外国患者预约帮助", ko: "외국인 환자 예약 도움" },
    hello:    { en: "Hello! I can help you book an appointment at Kyobashi Takaracho ENT Clinic.", zh: "您好！我来帮您预约京桥宝町耳鼻咽喉科。", ko: "안녕하세요! 교바시 다카라초 이비인후과 예약을 도와드리겠습니다." },
    askIns:   { en: "Do you have Japanese public health insurance?", zh: "您有日本的公共医疗保险吗？", ko: "일본 공적 건강보험이 있으신가요?" },
    insYes:   { en: "Yes, I have it", zh: "有", ko: "네, 있습니다" },
    insNo:    { en: "No (visitor / traveler)", zh: "没有（游客・旅行者）", ko: "아니요 (여행자)" },
    feeNo:    { en: "All fees are self-pay: first visit 33,000 yen, plus 11,000 yen for each test. We will tell you before any test.",
                zh: "费用全部自费：初诊 33,000日元，每做一项检查另加 11,000日元。做检查之前会先告诉您。",
                ko: "전액 자비입니다. 초진 33,000엔, 검사 1가지당 11,000엔이 추가됩니다. 검사 전에 미리 알려 드립니다." },
    feeYes:   { en: "With Japanese insurance, you pay your normal share. If we use a translation app during the consultation, a translation fee of 3,300 yen is added. Please bring your My Number card (health insurance) or eligibility certificate.",
                zh: "有日本保险的话，按保险比例付费。诊察时如果使用翻译软件，另收翻译费 3,300日元。请带上My Number卡（保险证）或资格确认书。",
                ko: "일본 보험이 있으시면 본인 부담금만 내시면 됩니다. 진료 중 통역 앱을 사용하면 통역료 3,300엔이 추가됩니다. 마이넘버 카드(보험증) 또는 자격확인서를 가져와 주세요." },
    askPhone: { en: "Do you have a Japanese mobile phone number (starting with 070, 080 or 090)?", zh: "您有日本的手机号码吗？（以070、080、090开头）", ko: "일본 휴대폰 번호(070, 080, 090으로 시작)가 있으신가요?" },
    phoneWhy: { en: "Our online booking page sends a code by SMS to a Japanese mobile number.", zh: "网上预约需要通过短信向日本手机号码发送验证码。", ko: "온라인 예약은 일본 휴대폰 번호로 문자 인증번호를 보냅니다." },
    yes:      { en: "Yes", zh: "有", ko: "네" },
    no:       { en: "No", zh: "没有", ko: "아니요" },
    selfBook: { en: "You can book online yourself. The booking page is in Japanese, so here is how to use it:", zh: "您可以自己在网上预约。预约页面是日语的，操作方法如下：", ko: "직접 온라인으로 예약하실 수 있습니다. 예약 페이지는 일본어이므로 사용 방법을 안내해 드립니다:" },
    selfSteps:{ en: ["Tap the button below. It opens the booking page for your menu: “{menu}”.", "Choose a date and time (空き = open).", "Enter your name in letters, exactly as in your passport.", "Enter the code sent to your phone by SMS to finish."],
                zh: ["点击下面的按钮，会打开您的预约项目「{menu}」的页面。", "选择日期和时间（空き＝有空位）。", "姓名请用英文字母，与护照相同。", "输入短信收到的验证码，即可完成预约。"],
                ko: ["아래 버튼을 누르면 「{menu}」 예약 페이지가 열립니다.", "날짜와 시간을 선택하세요 (空き = 예약 가능).", "이름은 여권과 같은 영문으로 입력하세요.", "문자로 받은 인증번호를 입력하면 예약이 완료됩니다."] },
    openBook: { en: "Open the booking page", zh: "打开预约页面", ko: "예약 페이지 열기" },
    orAsk:    { en: "Having trouble? We can book for you instead.", zh: "操作有困难？我们也可以帮您预约。", ko: "어려우신가요? 저희가 대신 예약해 드릴 수도 있습니다." },
    askUs:    { en: "Please book for me", zh: "请帮我预约", ko: "대신 예약해 주세요" },
    weBook:   { en: "No problem. Our staff will book for you. Please fill in this form. Your booking is confirmed only after we reply by email.",
                zh: "没问题，我们的工作人员会帮您预约。请填写下面的表格。收到我们的回复邮件后，预约才算确定。",
                ko: "괜찮습니다. 직원이 대신 예약해 드립니다. 아래 양식을 작성해 주세요. 저희가 이메일로 답장을 드려야 예약이 확정됩니다." },
    fName:    { en: "Full name (letters, as in your passport)", zh: "姓名（英文字母，与护照相同）", ko: "이름 (여권과 같은 영문)" },
    fNameLocal:{ en: "Name in Chinese characters / kanji (if you have one)", zh: "汉字姓名（如有）", ko: "한자 이름 (있으면)" },
    fBirth:   { en: "Date of birth", zh: "出生日期", ko: "생년월일" },
    fSex:     { en: "Sex", zh: "性别", ko: "성별" },
    male:     { en: "Male", zh: "男", ko: "남성" },
    female:   { en: "Female", zh: "女", ko: "여성" },
    fEmail:   { en: "Email (we will reply here)", zh: "电子邮箱（我们会回复到这里）", ko: "이메일 (여기로 답장드립니다)" },
    fPhone:   { en: "Phone (with country code)", zh: "电话（请加国家代码）", ko: "전화번호 (국가번호 포함)" },
    fStay:    { en: "Where you are staying in Japan (hotel or address)", zh: "在日本的住处（酒店或地址）", ko: "일본 내 숙소 (호텔 또는 주소)" },
    fWhen1:   { en: "Preferred date and time", zh: "希望的日期和时间", ko: "희망 날짜와 시간" },
    fWhen2:   { en: "Second choice (optional)", zh: "第二希望（选填）", ko: "두 번째 희망 (선택)" },
    pickTime: { en: "Time", zh: "时间", ko: "시간" },
    fWhat:    { en: "What is the problem? (choose all that apply)", zh: "哪里不舒服？（可多选）", ko: "어디가 불편하신가요? (복수 선택)" },
    sym:      { en: ["Ear", "Nose", "Throat", "Dizziness", "Other"], zh: ["耳朵", "鼻子", "喉咙", "头晕", "其他"], ko: ["귀", "코", "목", "어지럼증", "기타"] },
    fNote:    { en: "Anything else (optional, short)", zh: "其他（选填，简短）", ko: "기타 (선택, 짧게)" },
    consent:  { en: "I agree that the clinic uses this information only to make my appointment and contact me. (Our system, including an AI assistant, processes it on the clinic's behalf.)",
                zh: "我同意诊所仅为预约和联系我而使用以上信息。（包括AI助手在内的系统会代表诊所处理这些信息。）",
                ko: "위 정보를 예약과 연락 목적으로만 사용하는 것에 동의합니다. (AI 도우미를 포함한 시스템이 병원을 대신하여 처리합니다.)" },
    sameDay:  { en: "Same-day requests: please send at least 1 hour before. If the schedule is full, you may have to wait a long time, and an urgent-visit fee may apply.",
                zh: "当天的预约请至少提前1小时发送。如果当天已约满，可能需要等候较长时间，并可能加收紧急就诊费。",
                ko: "당일 예약은 최소 1시간 전에 보내 주세요. 예약이 꽉 찬 경우 오래 기다리실 수 있으며, 긴급 진료비가 추가될 수 있습니다." },
    confirm:  { en: "Check your request", zh: "确认内容", ko: "내용 확인" },
    send:     { en: "Send request", zh: "发送申请", ko: "신청 보내기" },
    edit:     { en: "Edit", zh: "修改", ko: "수정" },
    back:     { en: "Back", zh: "返回", ko: "뒤로" },
    restart:  { en: "Start over", zh: "重新开始", ko: "처음부터" },
    sent:     { en: "Thank you. We received your request. We will reply by email. Your booking is not confirmed until you receive our reply.",
                zh: "谢谢。我们已收到您的申请，会在诊疗时间内用邮件回复您。收到回复前，预约尚未确定。",
                ko: "감사합니다. 신청을 받았습니다. 진료 시간 중에 이메일로 답장드리겠습니다. 답장을 받으시기 전까지는 예약이 확정되지 않습니다." },
    testNote: { en: "(Test version: nothing was sent.)", zh: "（测试版：未实际发送。）", ko: "(시험판: 실제로 보내지지 않았습니다.)" },
    sending:  { en: "Sending…", zh: "正在发送…", ko: "보내는 중…" },
    sendFail: { en: "Sorry, we could not send your request. Please check your connection and press Send again in a few minutes.",
                zh: "抱歉，申请未能发送。请检查网络，几分钟后再按“发送”。",
                ko: "죄송합니다. 신청을 보내지 못했습니다. 인터넷 연결을 확인하고 몇 분 후 다시 보내기를 눌러 주세요." },
    reqBtn:   { en: "📅 Choose a time and book", zh: "📅 选择时间预约", ko: "📅 시간을 골라 예약" },   // 2026-11-14 予約のボタンを分かりやすく
    howWorks: { en: "Choose an open time and fill in the form. We will send you an email — press the button in it to confirm your appointment.",
                zh: "请选择空闲的时间并填写表格。我们会给您发邮件，按下邮件中的按钮即可确定预约。",
                ko: "비어 있는 시간을 고르고 양식을 작성해 주세요. 이메일을 보내 드리며, 메일 속 버튼을 누르면 예약이 확정됩니다." },
    weBookNow:{ en: "Choose a time from the open times below. After you press “Book”, we will send you an email. Press the button in the email within 30 minutes to confirm.",
                zh: "请从下面的空闲时间中选择。按下“预约”后，我们会给您发邮件。请在30分钟内按下邮件中的按钮确认。",
                ko: "아래의 비어 있는 시간 중에서 골라 주세요. “예약”을 누르면 이메일을 보내 드립니다. 30분 이내에 메일 속 버튼을 눌러 확정해 주세요." },
    fSlot:    { en: "Date and time (open times only)", zh: "日期和时间（仅显示空闲时间）", ko: "날짜와 시간 (예약 가능한 시간만)" },
    loading:  { en: "Checking open times…", zh: "正在查询空闲时间…", ko: "예약 가능한 시간을 확인하는 중…" },
    noOpen:   { en: "There are no open times we can offer online right now. Please send a request below, and our staff will reply by email.",
                zh: "目前没有可以在线预约的空闲时间。请在下面发送申请，工作人员会通过邮件回复您。",
                ko: "지금은 온라인으로 안내할 수 있는 빈 시간이 없습니다. 아래에서 신청을 보내 주시면 직원이 이메일로 답장드립니다." },
    noOpenStop:{ en: "Sorry, there are no times you can book online right now. Please try again later (open times are updated every morning). Appointments for international patients are at 16:00 or 16:30 on weekdays.",
                zh: "很抱歉，目前没有可以在线预约的时间。请稍后再试（每天早上更新空闲时间）。外国患者的预约时间为工作日的16:00或16:30。",
                ko: "죄송합니다. 지금은 온라인으로 예약할 수 있는 시간이 없습니다. 나중에 다시 시도해 주세요 (빈 시간은 매일 아침 업데이트됩니다). 외국인 환자의 예약 시간은 평일 16:00 또는 16:30입니다." },
    book:     { en: "Book this time", zh: "预约", ko: "예약하기" },
    taken:    { en: "Sorry, that time has just been taken. Please choose another time.", zh: "抱歉，这个时间刚刚被预约了。请选择其他时间。", ko: "죄송합니다. 방금 그 시간이 마감되었습니다. 다른 시간을 골라 주세요." },
    booked:   { en: "Almost done! Please check your email.", zh: "还差一步！请查看您的邮件。", ko: "거의 다 되었습니다! 이메일을 확인해 주세요." },
    bookedHow:{ en: "We sent an email to {email}. Press “Confirm my appointment” in the email within 30 minutes. Your appointment is not confirmed until you press it. (If you cannot find the email, please check your spam folder.)",
                zh: "我们已向 {email} 发送了邮件。请在30分钟内按下邮件中的“确认预约”。按下之前预约尚未确定。（如果找不到邮件，请查看垃圾邮件文件夹。）",
                ko: "{email} 로 이메일을 보냈습니다. 30분 이내에 메일 속 “예약 확정하기”를 눌러 주세요. 누르기 전까지는 예약이 확정되지 않습니다. (메일이 보이지 않으면 스팸함을 확인해 주세요.)" },
    dup:      { en: "You already have an appointment with this email address. To change it, please cancel it first with the button in our email.",
                zh: "这个邮箱已经有预约了。如需更改，请先用我们邮件中的按钮取消。",
                ko: "이 이메일 주소로 이미 예약이 있습니다. 변경하시려면 먼저 저희 메일의 버튼으로 취소해 주세요." },
    mailFail: { en: "We could not send an email to this address. Please check your email address.",
                zh: "无法向这个邮箱发送邮件。请检查邮箱地址。",
                ko: "이 주소로 이메일을 보낼 수 없습니다. 이메일 주소를 확인해 주세요." },

    closeFull:{ en: "Back to the page", zh: "返回页面", ko: "페이지로 돌아가기" },
    faqTitle: { en: "Common questions", zh: "常见问题", ko: "자주 묻는 질문" },
    faqMore:  { en: "More questions (FAQ page)", zh: "更多问题（常见问题页面）", ko: "더 많은 질문 (FAQ 페이지)" },
    // メールのボタンから来たとき
    lkLoading:{ en: "Checking your booking…", zh: "正在查询您的预约…", ko: "예약을 확인하는 중…" },
    lkOk:     { en: "Your appointment is confirmed. We also sent you an email.", zh: "您的预约已确定。我们也给您发了邮件。", ko: "예약이 확정되었습니다. 이메일도 보내 드렸습니다." },
    lkAlready:{ en: "This appointment is already confirmed.", zh: "此预约已经确定。", ko: "이 예약은 이미 확정되었습니다." },
    lkExpired:{ en: "Sorry, more than 30 minutes have passed, so this booking was cancelled. Please book again.", zh: "抱歉，已超过30分钟，此预约已取消。请重新预约。", ko: "죄송합니다. 30분이 지나 이 예약은 취소되었습니다. 다시 예약해 주세요." },
    lkAsk:    { en: "Do you want to cancel this appointment?", zh: "要取消这个预约吗？", ko: "이 예약을 취소하시겠습니까?" },
    lkCancel: { en: "Cancel my appointment", zh: "取消预约", ko: "예약 취소하기" },
    lkCancelled:{ en: "Your appointment has been cancelled.", zh: "您的预约已取消。", ko: "예약이 취소되었습니다." },
    lkNotFound:{ en: "We could not find this booking.", zh: "找不到这个预约。", ko: "이 예약을 찾을 수 없습니다." },
    lkFail:   { en: "Sorry, something went wrong. Please open the link in the email again in a few minutes.", zh: "抱歉，出了点问题。请过几分钟再打开邮件中的链接。", ko: "죄송합니다. 문제가 생겼습니다. 몇 분 후 메일 속 링크를 다시 열어 주세요." },
    come:     { en: "Please come to the reception 10 minutes before this time.", zh: "请在预约时间前10分钟到前台。", ko: "예약 시간 10분 전까지 접수처로 와 주세요." },
    bYear:    { en: "Year", zh: "年", ko: "년" },    // 2026-11-14 生年月日のプルダウン
    bMonth:   { en: "Month", zh: "月", ko: "월" },
    bDay:     { en: "Day", zh: "日", ko: "일" },
    sndOn:    { en: "Voice on", zh: "声音开", ko: "음성 켜짐" },    // 2026-11-14 AI コンシェルジュの声のボタン
    sndOff:   { en: "Voice off", zh: "声音关", ko: "음성 꺼짐" },
    need:     { en: "Please fill in the required items.", zh: "请填写必填项。", ko: "필수 항목을 입력해 주세요." },
    latin:    { en: "Please write your name in letters (A–Z), as in your passport.", zh: "姓名请用英文字母（A–Z）填写。", ko: "이름은 영문(A–Z)으로 입력해 주세요." },
    hours:    { en: "Clinic hours: Mon, Tue, Thu, Fri 10:00–13:30 / Mon–Fri 15:00–18:30. Closed Wednesday morning, Saturday, Sunday and holidays.",
                zh: "诊疗时间：周一、二、四、五 10:00–13:30／周一至周五 15:00–18:30。周三上午、周六、周日及节假日休诊。",
                ko: "진료 시간: 월·화·목·금 10:00–13:30 / 월~금 15:00–18:30. 수요일 오전, 토·일요일, 공휴일 휴진." },
    access:   { en: "2F Kowa Bldg, 2-12-4 Kyobashi, Chuo-ku, Tokyo. 1 min from Takaracho Station (Toei Asakusa Line), exit A6/A7.",
                zh: "东京都中央区京桥2-12-4 光和大厦2楼。都营浅草线宝町站A6・A7出口步行1分钟。",
                ko: "도쿄도 주오구 교바시 2-12-4 고와빌딩 2층. 도에이 아사쿠사선 다카라초역 A6・A7 출구에서 도보 1분." },
    bring:    { en: "Please bring: passport, your medicines or a list of them, and any test results.", zh: "请携带：护照、正在服用的药或药名清单、检查结果（如有）。", ko: "지참물: 여권, 복용 중인 약 또는 약 목록, 검사 결과(있으면)." },
    noSlot:   { en: "No times available on this day for this menu.", zh: "这一天没有可选的时间。", ko: "이 날은 선택할 수 있는 시간이 없습니다." },
  };

  // ---- よくある質問（決まった答え。AI 受付の旅行者向けのボタン・HP の /faq-en と同じ内容。HP を直したら、ここも直す）----
  const FAQ = [
    { id: "fees", q: { en: "💴 Fees", zh: "💴 费用", ko: "💴 비용" },
      a: { en: "You pay the full cost yourself (Japanese health insurance is not used). First visit: 33,000 yen. Each test: +11,000 yen. Minor surgery: +44,000 yen. Follow-up within 7 days for the same symptoms: 22,000 yen. Medicine from the pharmacy is also charged in full, separately. Fees are paid in Japanese yen.",
           zh: "费用全部自费（不使用日本健康保险）。初诊33,000日元，每项检查加11,000日元，小手术加44,000日元，7天内因同一症状复诊22,000日元。药局的药费也另外全额自费。用日元支付。",
           ko: "전액 자비입니다(일본 건강보험은 사용하지 않습니다). 초진 33,000엔, 검사 1가지당 +11,000엔, 간단한 수술 +44,000엔, 7일 이내 같은 증상의 재진 22,000엔입니다. 약국의 약값도 별도로 전액 자비입니다. 결제는 일본 엔으로 합니다." } },
    { id: "insurance", q: { en: "🧾 Using travel insurance", zh: "🧾 使用旅行保险", ko: "🧾 여행자 보험 이용" },
      a: { en: "Please pay at the clinic and claim the cost from your insurance company later. You usually need: (1) the receipt and itemized statement — we give them to you when you pay (in Japanese); (2) an English medical certificate — 22,000 yen; please check with your insurance company whether you need it; (3) the receipt from the pharmacy. Please tell the reception staff that you will use travel insurance.",
           zh: "请先在诊所付款，之后再向保险公司申请理赔。一般需要：①收据和明细单（付款时给您，日语）；②英文诊断书（22,000日元，是否需要请向保险公司确认）；③药局的收据。请告诉前台您要使用旅行保险。",
           ko: "병원에서 결제하신 후 나중에 보험사에 청구해 주세요. 보통 필요한 것은 ① 영수증과 명세서(결제 시 드림, 일본어), ② 영문 진단서(22,000엔, 필요 여부는 보험사에 확인), ③ 약국 영수증입니다. 접수처에 여행자 보험을 이용한다고 말씀해 주세요." } },
    { id: "lang", q: { en: "🗣 Language / interpreter", zh: "🗣 语言・翻译", ko: "🗣 언어・통역" },
      a: { en: "Consultations are in Japanese. If speaking Japanese is difficult for you, please come with an interpreter (a family member or friend is fine). You can also choose a consultation using a translation app. The translation fee is included in the fees.",
           zh: "诊察使用日语。日语交流有困难的话，请和翻译一起来（家人或朋友也可以）。也可以使用翻译软件诊察。翻译费已包含在费用中。",
           ko: "진료는 일본어로 합니다. 일본어가 어려우시면 통역해 줄 분과 함께 와 주세요(가족이나 친구도 괜찮습니다). 통역 앱을 사용한 진료도 가능합니다. 통역료는 비용에 포함되어 있습니다." } },
    { id: "medicine", q: { en: "💊 Medicine / pharmacy", zh: "💊 药・药局", ko: "💊 약・약국" },
      a: { en: "We do not give out medicine at the clinic. We give you a prescription, and you get your medicine at a pharmacy — there is one on the 1st floor of our building. Please pay for the medicine at the pharmacy. A prescription is valid for 4 days, including the day it is issued.",
           zh: "本院不直接发药。我们开处方，请到药局取药——本大楼1楼就有药局。药费请在药局支付。处方有效期包括开具当天共4天。",
           ko: "병원에서는 약을 드리지 않습니다. 처방전을 드리니 약국에서 받아 주세요. 건물 1층에 약국이 있습니다. 약값은 약국에서 결제해 주세요. 처방전은 발행일 포함 4일간 유효합니다." } },
    { id: "pay", q: { en: "💳 Payment", zh: "💳 付款方式", ko: "💳 결제 방법" },
      a: { en: "We accept cash, credit cards, e-money and transportation IC cards (including contactless payment). QR code payments such as PayPay cannot be used.",
           zh: "可以使用现金、信用卡、电子钱包、交通IC卡（包括感应支付）。不能使用PayPay等二维码支付。",
           ko: "현금, 신용카드, 전자머니, 교통 IC카드(터치 결제 포함)를 이용하실 수 있습니다. PayPay 등 QR코드 결제는 이용하실 수 없습니다." } },
    { id: "hours", q: { en: "📍 Access", zh: "📍 交通", ko: "📍 오시는 길" },   // 2026-11-14 診療時間は書かない（場所だけ）
      a: { en: "Please come at the time of your appointment. 2F Kowa Bldg, 2-12-4 Kyobashi, Chuo-ku, Tokyo — 1 min from Takaracho Station (Toei Asakusa Line), exit A6/A7.",
           zh: "请在预约的时间来院。东京都中央区京桥2-12-4 光和大厦2楼，都营浅草线宝町站A6・A7出口步行1分钟。",
           ko: "예약하신 시간에 와 주세요. 도쿄도 주오구 교바시 2-12-4 고와빌딩 2층, 도에이 아사쿠사선 다카라초역 A6・A7 출구에서 도보 1분." } },
  ];

  // ---- 言語（ブラウザの言葉から。選び直せる） ----
  const nav = (navigator.language || "en").toLowerCase();
  let lang = nav.startsWith("zh") ? "zh" : nav.startsWith("ko") ? "ko" : "en";
  const t = k => (T[k] && (T[k][lang] || T[k].en)) || "";
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---- 見た目（ホームページの CSS とぶつからないよう、Shadow DOM の中に作る） ----
  const host = document.createElement("div");
  host.id = "kyobashi-booking-help";
  const root = host.attachShadow({ mode: "open" });
  root.innerHTML = `<style>
    :host { all: initial; }
    * { box-sizing: border-box; font-family: "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", "Malgun Gothic", sans-serif; }
    .fab { position: fixed; right: 18px; bottom: 18px; z-index: 2147483000; display: flex; align-items: center; gap: 10px;
      background: #1f3a5f; color: #fff; border: 0; border-radius: 999px; padding: 6px 18px 6px 6px; cursor: pointer;
      box-shadow: 0 6px 18px rgba(0,0,0,.28); font-size: 15px; font-weight: bold; }
    .face { width: 54px; height: 54px; border-radius: 50%; overflow: hidden; background: radial-gradient(circle at 50% 40%, #eaf2f8, #c9dbea); border: 3px solid #fff; flex: 0 0 auto; }
    .face svg { width: 100%; height: 100%; display: block; }
    .panel { position: fixed; right: 18px; bottom: 90px; z-index: 2147483000; width: min(400px, calc(100vw - 24px)); max-height: min(640px, calc(100vh - 110px));
      background: #fff; border-radius: 16px; box-shadow: 0 10px 32px rgba(0,0,0,.3); display: none; flex-direction: column; overflow: hidden; color: #22303f; }
    .panel.open { display: flex; }
    .hd { background: #1f3a5f; color: #fff; padding: 10px 12px; display: flex; align-items: center; gap: 10px; }
    #mouth-open, #eyes-closed { display: none; }
    .hd .face { width: 40px; height: 40px; border-width: 2px; }
    .hd .ttl { flex: 1; font-size: 14px; font-weight: bold; line-height: 1.3; }
    .hd button { background: none; border: 0; color: #fff; font-size: 22px; cursor: pointer; line-height: 1; }
    .langs { display: flex; gap: 6px; padding: 8px 12px 0; }
    .langs button { border: 1px solid #b8c6d6; background: #fff; color: #1f3a5f; border-radius: 999px; padding: 3px 10px; font-size: 13px; cursor: pointer; }
    .langs button.on { background: #1f3a5f; color: #fff; }
    .bd { padding: 10px 14px 14px; overflow-y: auto; font-size: 14px; line-height: 1.55; }
    .msg { background: #eef3f8; border-radius: 12px; padding: 9px 12px; margin: 8px 0; }
    .q { font-weight: bold; margin: 10px 0 6px; }
    .row { display: flex; gap: 8px; flex-wrap: wrap; margin: 6px 0; }
    .btn { flex: 1 1 auto; border: 2px solid #1f3a5f; background: #fff; color: #1f3a5f; border-radius: 10px; padding: 9px 10px; font-size: 14px; font-weight: bold; cursor: pointer; }
    .btn.main { background: #2e7d32; border-color: #2e7d32; color: #fff; }
    .btn.ghost { border: 1px solid #aab; color: #556; font-weight: normal; flex: 0 0 auto; }
    ol { margin: 6px 0 6px 20px; padding: 0; }
    label { display: block; font-weight: bold; margin: 10px 0 3px; font-size: 13px; }
    input[type=text], input[type=email], input[type=tel], input[type=date], select, textarea {
      width: 100%; padding: 7px 8px; border: 1px solid #b8c6d6; border-radius: 8px; font-size: 14px; }
    textarea { height: 56px; resize: vertical; }
    .inl { display: flex; gap: 6px; }
    .inl > * { flex: 1; }
    .chk { display: flex; flex-wrap: wrap; gap: 4px 12px; font-weight: normal; }
    .chk label { font-weight: normal; margin: 0; display: flex; align-items: center; gap: 4px; }
    .small { font-size: 12px; color: #556; }
    .err { color: #c62828; font-weight: bold; margin-top: 8px; }
    .sum { background: #f6f8fb; border: 1px solid #dde4ec; border-radius: 10px; padding: 8px 10px; font-size: 13px; }
    .sum div { margin: 2px 0; }
    .info { font-size: 12px; color: #445; border-top: 1px solid #e3e8ee; margin-top: 12px; padding-top: 8px; }
    /* よくある質問のボタン（2026-11-13） */
    .faqq { margin-top: 16px; }
    .faqone { margin-top: 18px; justify-content: center; }
    .faqs { display: flex; flex-wrap: wrap; gap: 6px; }
    .faqb { border: 1px solid #b8c6d6; background: #f6f9fc; color: #1f3a5f; border-radius: 999px; padding: 6px 12px; font-size: 13px;
      cursor: pointer; text-decoration: none; font-family: inherit; }
    .faqb:hover { background: #e8f0f8; }
    .panel.full .faqb { font-size: 15px; padding: 8px 14px; }
    /* スマホ：ホームページの下の帯（LINE・予約・電話）に重ならないよう、上にずらす */
    @media (max-width: 767px) {
      .fab { bottom: 76px; right: 10px; padding: 4px 14px 4px 4px; font-size: 14px; }
      .fab .face { width: 46px; height: 46px; }
      .panel { right: 8px; left: 8px; width: auto; bottom: 138px; max-height: calc(100vh - 150px); }
    }
    /* 「Book online」から開いたとき：右下の小さな画面ではなく、画面いっぱいの予約の画面にする（2026-11-13 理事長） */
    .panel.full { inset: 0; right: 0; bottom: 0; left: 0; width: 100vw; height: 100vh; height: 100dvh; max-height: none; border-radius: 0; box-shadow: none; background: #f4f7fb; }
    .panel.full .hd { padding: 14px max(16px, calc((100vw - 760px) / 2)); }
    .panel.full .hd .face { width: 52px; height: 52px; }
    .panel.full .hd .ttl { font-size: 20px; }
    .panel.full .hd button { font-size: 16px; font-weight: bold; border: 2px solid #fff; border-radius: 999px; padding: 6px 14px; }
    .panel.full .langs { justify-content: center; padding: 12px; background: #fff; }
    .panel.full .bd { width: min(760px, 100%); margin: 0 auto; padding: 20px 16px 40px; font-size: 16px; background: #fff; flex: 1; }
    .panel.full .btn { font-size: 16px; padding: 12px 16px; }
    .fab.hide { display: none; }
    /* ページの下に帯（LINE・予約など）がないときは、スマホでも右下の角に出す */
    @media (max-width: 767px) { .fab.nobar { bottom: 18px; } .panel.nobar:not(.full) { bottom: 80px; max-height: calc(100vh - 92px); } }
    @media (max-width: 767px) {
      .panel.full .hd .face { width: 40px; height: 40px; }
      .panel.full .hd .ttl { font-size: 16px; }
      .panel.full .hd button { font-size: 13px; padding: 5px 10px; white-space: nowrap; }
    }
    /* ---- AI コンシェルジュの形（2026-11-14 理事長：HP でも待合室と同じ事務員が話しかけて案内する）----
       画面いっぱいのときだけ、上に大きな事務員と吹き出し。吹き出しには、その画面で事務員が言うこと（最初の .msg）を出す */
    .stage { display: none; }
    .panel.full .stage { display: flex; align-items: flex-end; gap: 14px; width: min(760px, 100%); margin: 0 auto; padding: 16px 16px 0; background: #fff; }
    .stage .big { width: 120px; height: 150px; flex: 0 0 auto; border-radius: 16px; overflow: hidden; background: radial-gradient(circle at 50% 35%, #eaf2f8, #c9dbea); }
    .stage .big svg { width: 100%; height: 100%; display: block; }
    .bubble { position: relative; flex: 1; background: #eef3f8; border-radius: 16px; padding: 12px 14px; margin-bottom: 14px; font-size: 16px; line-height: 1.6; min-height: 56px; }
    .bubble:before { content: ""; position: absolute; left: -10px; bottom: 20px; border: 10px solid transparent; border-right-color: #eef3f8; border-left: 0; }
    .bubble .msg { background: none !important; padding: 0; margin: 0; }
    .stage.talking #mouth-open { display: inline; } .stage.talking #mouth-closed { display: none; }
    .stage.blink #eyes-closed { display: inline; } .stage.blink #eyes { display: none; }
    .hd button.snd { font-size: 14px; font-weight: bold; border: 2px solid #fff; border-radius: 999px; padding: 5px 12px; white-space: nowrap; }
    .panel:not(.full) .hd button.snd { display: none; }
    .bday select { min-width: 0; }
    /* ---- スマホ（2026-11-14 理事長「みんなスマホから取るので、スムーズに」）----
       ・上の帯：顔は出さず（下に大きな事務員がいる）、ボタンは印だけ（🔇・×）。題は1〜2行に
       ・入力欄の字は 16px（iPhone は 16px より小さいと、欄を押すたびに画面が拡大されるため）
       ・画面全体をまとめて動かす（事務員の場所も一緒に上へ流れ、入力欄を広く使える）
       ・押すところは指で押しやすい高さ（44px 以上） */
    @media (max-width: 767px) {
      .panel.full { overflow-y: auto; -webkit-overflow-scrolling: touch; display: none; }
      .panel.full.open { display: block; }
      .panel.full .hd { position: sticky; top: 0; z-index: 2; padding: 8px 10px; gap: 8px; }
      .panel.full .hd .face { display: none; }
      .panel.full .hd .ttl { font-size: 15px; }
      .panel.full .hd button { min-width: 44px; min-height: 40px; padding: 4px 10px; font-size: 18px; }
      .panel.full .hd .tx { display: none; }
      .panel.full .langs { padding: 8px; }
      .panel.full .langs button { font-size: 15px; padding: 6px 14px; }
      .panel.full .stage { padding: 10px 12px 0; gap: 10px; }
      .stage .big { width: 72px; height: 90px; }
      .bubble { font-size: 15px; padding: 10px 12px; margin-bottom: 10px; }
      .panel.full .bd { padding: 12px 14px calc(40px + env(safe-area-inset-bottom)); overflow: visible; }
      .panel.full input[type=text], .panel.full input[type=email], .panel.full input[type=tel], .panel.full input[type=date],
      .panel.full select, .panel.full textarea { font-size: 16px; min-height: 44px; padding: 8px 10px; }
      .panel.full textarea { min-height: 80px; }
      .panel.full .btn { min-height: 48px; font-size: 16px; }
      .panel.full .faqb { min-height: 40px; }
      .panel.full .chk label { min-height: 36px; font-size: 15px; }
      .panel.full input[type=checkbox] { width: 20px; height: 20px; }
    }
  </style>
  <button class="fab" id="fab"><span class="face"><svg viewBox="20 60 360 360" preserveAspectRatio="xMidYMin slice" xmlns="http://www.w3.org/2000/svg"> <g id="body-group"> <g id="legs"> <rect x="137" y="780" width="30" height="92" rx="10" fill="#ecd0bd"/> <rect x="233" y="780" width="30" height="92" rx="10" fill="#ecd0bd"/> <ellipse cx="150" cy="876" rx="26" ry="11" fill="#22252b"/> <ellipse cx="250" cy="876" rx="26" ry="11" fill="#22252b"/> <path d="M100 630 L300 630 L320 795 L80 795 Z" fill="#18304f"/> </g> <g class="head-part head-back"> <path d="M95 210 Q90 90 200 75 Q310 90 305 210 L315 340 Q300 360 280 330 L120 330 Q100 360 85 340 Z" fill="#3b2a24"/> </g> <g id="torso"> <rect x="178" y="330" width="44" height="80" rx="18" fill="#f6d7c3"/> <path d="M128 402 L272 402 Q302 410 306 452 L302 655 L98 655 L94 452 Q98 410 128 402 Z" fill="var(--navy)"/> <path d="M165 402 L200 470 L235 402 Z" fill="#fff"/> <path d="M200 470 L196 655 L204 655 Z" fill="#e9eef5"/> <circle cx="200" cy="530" r="4" fill="#e9eef5"/> <circle cx="200" cy="590" r="4" fill="#e9eef5"/> <path d="M182 407 Q200 432 218 407 L212 442 Q200 434 188 442 Z" fill="var(--accent)"/> <rect x="212" y="478" width="52" height="24" rx="4" fill="#fff"/> <text x="238" y="495" font-size="12" text-anchor="middle" fill="var(--navy)" font-weight="bold">Reception</text> <g id="arm-rest"> <rect x="94" y="418" width="32" height="182" rx="16" fill="#1a3352"/> <rect x="96" y="592" width="28" height="14" rx="5" fill="#fff"/> <ellipse cx="110" cy="628" rx="14" ry="22" fill="#fbe3d3"/> </g> <g id="arm-guide"> <rect x="274" y="418" width="32" height="182" rx="16" fill="#1a3352"/> <rect x="276" y="592" width="28" height="14" rx="5" fill="#fff"/> <ellipse cx="290" cy="630" rx="15" ry="24" fill="#fbe3d3"/> <ellipse cx="279" cy="618" rx="5" ry="11" fill="#f6d7c3" transform="rotate(-20 279 618)"/> </g> </g> <g class="head-part head-front"> <ellipse cx="200" cy="235" rx="95" ry="110" fill="#fbe3d3"/> <path d="M105 215 Q110 110 200 105 Q295 110 296 215 Q270 150 215 145 Q230 175 180 190 Q150 195 105 215 Z" fill="#3b2a24"/> <path d="M140 190 Q160 182 178 190" stroke="#3b2a24" stroke-width="4" fill="none" stroke-linecap="round"/> <path d="M222 190 Q240 182 260 190" stroke="#3b2a24" stroke-width="4" fill="none" stroke-linecap="round"/> <g id="eyes"> <ellipse cx="160" cy="215" rx="13" ry="16" fill="#2b2b3a"/> <ellipse cx="240" cy="215" rx="13" ry="16" fill="#2b2b3a"/> <circle cx="165" cy="209" r="4.5" fill="#fff"/> <circle cx="245" cy="209" r="4.5" fill="#fff"/> </g> <g id="eyes-closed"> <path d="M146 218 Q160 228 174 218" stroke="#2b2b3a" stroke-width="4" fill="none" stroke-linecap="round"/> <path d="M226 218 Q240 228 254 218" stroke="#2b2b3a" stroke-width="4" fill="none" stroke-linecap="round"/> </g> <ellipse cx="140" cy="262" rx="16" ry="9" fill="#f4b5a6" opacity=".6"/> <ellipse cx="260" cy="262" rx="16" ry="9" fill="#f4b5a6" opacity=".6"/> <path id="mouth-closed" d="M182 285 Q200 298 218 285" stroke="#c0605a" stroke-width="4" fill="none" stroke-linecap="round"/> <ellipse id="mouth-open" cx="200" cy="290" rx="14" ry="11" fill="#c0605a"/> <path d="M100 230 Q95 300 160 305" stroke="#555" stroke-width="4" fill="none"/> <circle cx="163" cy="305" r="6" fill="#555"/> <rect x="88" y="205" width="18" height="40" rx="8" fill="#555"/> </g> </g> </svg></span><span id="fabTxt"></span></button>
  <div class="panel" id="panel" role="dialog">
    <div class="hd"><span class="face"><svg viewBox="20 60 360 360" preserveAspectRatio="xMidYMin slice" xmlns="http://www.w3.org/2000/svg"> <g id="body-group"> <g id="legs"> <rect x="137" y="780" width="30" height="92" rx="10" fill="#ecd0bd"/> <rect x="233" y="780" width="30" height="92" rx="10" fill="#ecd0bd"/> <ellipse cx="150" cy="876" rx="26" ry="11" fill="#22252b"/> <ellipse cx="250" cy="876" rx="26" ry="11" fill="#22252b"/> <path d="M100 630 L300 630 L320 795 L80 795 Z" fill="#18304f"/> </g> <g class="head-part head-back"> <path d="M95 210 Q90 90 200 75 Q310 90 305 210 L315 340 Q300 360 280 330 L120 330 Q100 360 85 340 Z" fill="#3b2a24"/> </g> <g id="torso"> <rect x="178" y="330" width="44" height="80" rx="18" fill="#f6d7c3"/> <path d="M128 402 L272 402 Q302 410 306 452 L302 655 L98 655 L94 452 Q98 410 128 402 Z" fill="var(--navy)"/> <path d="M165 402 L200 470 L235 402 Z" fill="#fff"/> <path d="M200 470 L196 655 L204 655 Z" fill="#e9eef5"/> <circle cx="200" cy="530" r="4" fill="#e9eef5"/> <circle cx="200" cy="590" r="4" fill="#e9eef5"/> <path d="M182 407 Q200 432 218 407 L212 442 Q200 434 188 442 Z" fill="var(--accent)"/> <rect x="212" y="478" width="52" height="24" rx="4" fill="#fff"/> <text x="238" y="495" font-size="12" text-anchor="middle" fill="var(--navy)" font-weight="bold">Reception</text> <g id="arm-rest"> <rect x="94" y="418" width="32" height="182" rx="16" fill="#1a3352"/> <rect x="96" y="592" width="28" height="14" rx="5" fill="#fff"/> <ellipse cx="110" cy="628" rx="14" ry="22" fill="#fbe3d3"/> </g> <g id="arm-guide"> <rect x="274" y="418" width="32" height="182" rx="16" fill="#1a3352"/> <rect x="276" y="592" width="28" height="14" rx="5" fill="#fff"/> <ellipse cx="290" cy="630" rx="15" ry="24" fill="#fbe3d3"/> <ellipse cx="279" cy="618" rx="5" ry="11" fill="#f6d7c3" transform="rotate(-20 279 618)"/> </g> </g> <g class="head-part head-front"> <ellipse cx="200" cy="235" rx="95" ry="110" fill="#fbe3d3"/> <path d="M105 215 Q110 110 200 105 Q295 110 296 215 Q270 150 215 145 Q230 175 180 190 Q150 195 105 215 Z" fill="#3b2a24"/> <path d="M140 190 Q160 182 178 190" stroke="#3b2a24" stroke-width="4" fill="none" stroke-linecap="round"/> <path d="M222 190 Q240 182 260 190" stroke="#3b2a24" stroke-width="4" fill="none" stroke-linecap="round"/> <g id="eyes"> <ellipse cx="160" cy="215" rx="13" ry="16" fill="#2b2b3a"/> <ellipse cx="240" cy="215" rx="13" ry="16" fill="#2b2b3a"/> <circle cx="165" cy="209" r="4.5" fill="#fff"/> <circle cx="245" cy="209" r="4.5" fill="#fff"/> </g> <g id="eyes-closed"> <path d="M146 218 Q160 228 174 218" stroke="#2b2b3a" stroke-width="4" fill="none" stroke-linecap="round"/> <path d="M226 218 Q240 228 254 218" stroke="#2b2b3a" stroke-width="4" fill="none" stroke-linecap="round"/> </g> <ellipse cx="140" cy="262" rx="16" ry="9" fill="#f4b5a6" opacity=".6"/> <ellipse cx="260" cy="262" rx="16" ry="9" fill="#f4b5a6" opacity=".6"/> <path id="mouth-closed" d="M182 285 Q200 298 218 285" stroke="#c0605a" stroke-width="4" fill="none" stroke-linecap="round"/> <ellipse id="mouth-open" cx="200" cy="290" rx="14" ry="11" fill="#c0605a"/> <path d="M100 230 Q95 300 160 305" stroke="#555" stroke-width="4" fill="none"/> <circle cx="163" cy="305" r="6" fill="#555"/> <rect x="88" y="205" width="18" height="40" rx="8" fill="#555"/> </g> </g> </svg></span><span class="ttl" id="ttl"></span><button id="snd" class="snd"></button><button id="x" aria-label="close">×</button></div>
    <div class="langs" id="langs"><button data-l="en">English</button><button data-l="zh">中文</button><button data-l="ko">한국어</button></div>
    <div class="stage" id="stage"><div class="big"><svg viewBox="20 60 360 360" preserveAspectRatio="xMidYMin slice" xmlns="http://www.w3.org/2000/svg"> <g id="body-group"> <g id="legs"> <rect x="137" y="780" width="30" height="92" rx="10" fill="#ecd0bd"/> <rect x="233" y="780" width="30" height="92" rx="10" fill="#ecd0bd"/> <ellipse cx="150" cy="876" rx="26" ry="11" fill="#22252b"/> <ellipse cx="250" cy="876" rx="26" ry="11" fill="#22252b"/> <path d="M100 630 L300 630 L320 795 L80 795 Z" fill="#18304f"/> </g> <g class="head-part head-back"> <path d="M95 210 Q90 90 200 75 Q310 90 305 210 L315 340 Q300 360 280 330 L120 330 Q100 360 85 340 Z" fill="#3b2a24"/> </g> <g id="torso"> <rect x="178" y="330" width="44" height="80" rx="18" fill="#f6d7c3"/> <path d="M128 402 L272 402 Q302 410 306 452 L302 655 L98 655 L94 452 Q98 410 128 402 Z" fill="var(--navy)"/> <path d="M165 402 L200 470 L235 402 Z" fill="#fff"/> <path d="M200 470 L196 655 L204 655 Z" fill="#e9eef5"/> <circle cx="200" cy="530" r="4" fill="#e9eef5"/> <circle cx="200" cy="590" r="4" fill="#e9eef5"/> <path d="M182 407 Q200 432 218 407 L212 442 Q200 434 188 442 Z" fill="var(--accent)"/> <rect x="212" y="478" width="52" height="24" rx="4" fill="#fff"/> <text x="238" y="495" font-size="12" text-anchor="middle" fill="var(--navy)" font-weight="bold">Reception</text> <g id="arm-rest"> <rect x="94" y="418" width="32" height="182" rx="16" fill="#1a3352"/> <rect x="96" y="592" width="28" height="14" rx="5" fill="#fff"/> <ellipse cx="110" cy="628" rx="14" ry="22" fill="#fbe3d3"/> </g> <g id="arm-guide"> <rect x="274" y="418" width="32" height="182" rx="16" fill="#1a3352"/> <rect x="276" y="592" width="28" height="14" rx="5" fill="#fff"/> <ellipse cx="290" cy="630" rx="15" ry="24" fill="#fbe3d3"/> <ellipse cx="279" cy="618" rx="5" ry="11" fill="#f6d7c3" transform="rotate(-20 279 618)"/> </g> </g> <g class="head-part head-front"> <ellipse cx="200" cy="235" rx="95" ry="110" fill="#fbe3d3"/> <path d="M105 215 Q110 110 200 105 Q295 110 296 215 Q270 150 215 145 Q230 175 180 190 Q150 195 105 215 Z" fill="#3b2a24"/> <path d="M140 190 Q160 182 178 190" stroke="#3b2a24" stroke-width="4" fill="none" stroke-linecap="round"/> <path d="M222 190 Q240 182 260 190" stroke="#3b2a24" stroke-width="4" fill="none" stroke-linecap="round"/> <g id="eyes"> <ellipse cx="160" cy="215" rx="13" ry="16" fill="#2b2b3a"/> <ellipse cx="240" cy="215" rx="13" ry="16" fill="#2b2b3a"/> <circle cx="165" cy="209" r="4.5" fill="#fff"/> <circle cx="245" cy="209" r="4.5" fill="#fff"/> </g> <g id="eyes-closed"> <path d="M146 218 Q160 228 174 218" stroke="#2b2b3a" stroke-width="4" fill="none" stroke-linecap="round"/> <path d="M226 218 Q240 228 254 218" stroke="#2b2b3a" stroke-width="4" fill="none" stroke-linecap="round"/> </g> <ellipse cx="140" cy="262" rx="16" ry="9" fill="#f4b5a6" opacity=".6"/> <ellipse cx="260" cy="262" rx="16" ry="9" fill="#f4b5a6" opacity=".6"/> <path id="mouth-closed" d="M182 285 Q200 298 218 285" stroke="#c0605a" stroke-width="4" fill="none" stroke-linecap="round"/> <ellipse id="mouth-open" cx="200" cy="290" rx="14" ry="11" fill="#c0605a"/> <path d="M100 230 Q95 300 160 305" stroke="#555" stroke-width="4" fill="none"/> <circle cx="163" cy="305" r="6" fill="#555"/> <rect x="88" y="205" width="18" height="40" rx="8" fill="#555"/> </g> </g> </svg></div><div class="bubble" id="bubble" aria-live="polite"></div></div>
    <div class="bd" id="bd"></div>
  </div>`;
  const $ = s => root.querySelector(s);
  const bd = $("#bd");

  // ---- 進み具合 ----
  const st = { menu: "", step: "start", form: {}, slots: null, slotsState: "", booked: "", link: null };
  // link：メールのボタンから来たとき { action: "confirm"|"cancel", id, state, when, menuName }
  // slotsState：""＝まだ／"loading"＝読んでいる／"ok"＝案内できる時間がある／"none"＝ない・読めない（申し込みで受ける）

  function chrome_() {
    $("#fabTxt").textContent = t("fab");
    $("#ttl").textContent = t("title");
    // 画面いっぱいのときは「× 閉じる」と文字でも出す（元のページに戻るボタン）
    // スマホでは文字（.tx）を隠して印だけにする（帯からはみ出さないように。2026-11-14）
    $("#x").innerHTML = $("#panel").classList.contains("full") ? `<span class="ic">×</span><span class="tx"> ${esc(t("closeFull"))}</span>` : "×";
    $("#x").setAttribute("aria-label", t("closeFull"));
    root.querySelectorAll("#langs button").forEach(b => b.classList.toggle("on", b.dataset.l === lang));
    $("#snd").innerHTML = `<span class="ic">${sound ? "🔊" : "🔇"}</span><span class="tx"> ${esc(t(sound ? "sndOn" : "sndOff"))}</span>`;
    $("#snd").setAttribute("aria-label", t(sound ? "sndOn" : "sndOff"));
  }

  // ---- 声と口の動き（AI コンシェルジュ。2026-11-14 理事長：声は最初は切っておき、🔇 を押したら話す）----
  //   ブラウザの声（speechSynthesis）を使う。キーも料金も要らない。Azure の声は HP では使わない（キーを公開できないため）
  let sound = false;
  try { sound = sessionStorage.getItem("kbhSound") === "1"; } catch (e) {}
  const VLANG = { en: "en-US", zh: "zh-CN", ko: "ko-KR" };
  let lastSaid = "", flapT = null;
  function pickVoice(l) {
    const vs = (window.speechSynthesis ? speechSynthesis.getVoices() : []).filter(v => (v.lang || "").toLowerCase().replace("_", "-").startsWith(l));
    // 2026-11-14 理事長「声が男性になっている。画面のコンシェルジュは女性なので、女性の声に」
    //   女性の声の名前（Windows・Chrome・iPhone・Android）を先に選び、男性の声の名前は使わない
    const FEMALE = /Aria|Jenny|Michelle|Ana|Emma|Ava|Sonia|Libby|Natasha|Clara|Samantha|Karen|Moira|Tessa|Victoria|Allison|Susan|Zira|Hazel|Xiaoxiao|Xiaoyi|Xiaohan|Xiaomo|Xiaoxuan|HsiaoChen|HsiaoYu|HiuMaan|HiuGaai|Huihui|Yaoyao|Tingting|Ting-Ting|Meijia|Sin-ji|SunHi|SeoHyeon|JiMin|Yuna|Heami|female|Female|Google\sUS English|Google\sUK English Female|Google\s普通话|Google\s國語|Google\s粤語|Google\s한국의/;   // Chrome の声の名前の空白は NBSP のことがあるので \s
    const MALE = /Guy|Andrew|Brian|Christopher|Eric|Roger|Steffan|Davis|Tony|Jason|Ryan|Thomas|William|Liam|Aaron|Fred|Daniel|Alex|Rishi|Arthur|Gordon|Mark|David|George|James|Yunxi|Yunjian|Yunyang|Yunxia|Yunhao|Kangkang|YunJhe|WanLung|InJoon|Hyunsu|BongJin|GookMin|Male|male|UK English Male/;
    const fem = vs.filter(v => FEMALE.test(v.name) && !MALE.test(v.name));
    const notMale = vs.filter(v => !MALE.test(v.name));
    // 同じ言葉の中では、地域が合う声（en-US・zh-CN・ko-KR）を先に
    const loc = (VLANG[l] || "").toLowerCase();
    const best = list => {
      const L = list.filter(v => (v.lang || "").toLowerCase().replace("_", "-") === loc).concat(list);
      return L.find(v => /Natural|Online/.test(v.name)) || L.find(v => /Google/.test(v.name)) || L[0];
    };
    return best(fem) || best(notMale) || null;   // 女性の声が見つからないときは、男性と分かる声は使わない（既定の声）
  }
  function talking(on) {
    const s = $("#stage"); clearTimeout(flapT); s.classList.remove("talking");
    if (!on) return;
    // 口パク：一定のリズムだと機械っぽいので、間隔をばらつかせる
    const flap = () => { s.classList.toggle("talking"); flapT = setTimeout(flap, 110 + Math.random() * 110); };
    flap();
  }
  function stopTalk() { try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {} talking(false); }
  // 絵文字は読まない
  const plain = s => String(s || "").replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, "").replace(/\s+/g, " ").trim();
  function sayIt(text, force) {
    text = plain(text);
    if (!text || (!force && text === lastSaid)) return;
    lastSaid = text;
    if (!sound || !window.speechSynthesis) return;
    stopTalk();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = VLANG[lang] || "en-US";
    const v = pickVoice(lang); if (v) u.voice = v;
    u.rate = 0.95;
    u.onstart = () => talking(true);
    u.onend = u.onerror = () => talking(false);
    speechSynthesis.speak(u);
  }
  // まばたき（ときどき）
  setInterval(() => { const s = $("#stage"); if (!s) return; s.classList.add("blink"); setTimeout(() => s.classList.remove("blink"), 140); }, 4200);
  // 事務員が言うこと：吹き出しの文＋（あれば）その画面の質問（.q。よくある質問の見出しは除く）
  function sayText() {
    let say = $("#bubble").innerText;
    const q = bd.querySelector(".q");
    if (q && !q.classList.contains("faqq") && plain(q.textContent) !== plain(say)) say += " " + q.textContent;
    return say;
  }
  // 画面ごとに、事務員が言うこと（最初の .msg）を吹き出しに移し、声が入っていれば読む
  function concierge() {
    const bub = $("#bubble");
    bub.innerHTML = "";
    if (!$("#panel").classList.contains("full")) { stopTalk(); lastSaid = ""; return; }
    const first = bd.querySelector(".msg"), q = bd.querySelector(".q");
    if (first) bub.appendChild(first);
    else if (q) bub.textContent = q.textContent;
    sayIt(sayText());
  }
  // 2026-11-14 理事長「診療時間・受付時間は書かない（その時間に来ればよいと思われるため。予約した時間に来てもらう）」→ 場所だけ
  const info = () => `<div class="info">${esc(t("access"))}</div>`;

  function render() {
    chrome_();
    const s = st.step;
    if (s === "start") {
      // 2026-11-14 理事長「日本の健康保険を持っていない人のためのページ。完全に旅行者向け」→ 保険の質問をやめ、予約のボタン1つ
      bd.innerHTML = `<div class="msg">${esc(t("hello"))}</div>
        <div class="row"><button class="btn main" data-a="insNo">${esc(t("reqBtn"))}</button></div>
        <div class="small">${esc(t("feeNo"))}</div>
        <div class="faqs faqone"><button class="faqb" data-a="faqs">❓ ${esc(t("faqTitle"))}</button></div>${info()}`;
      // 2026-11-14 理事長「よくある質問より先に予約を出す」：よくある質問は1つのボタンにまとめ、押すと一覧の画面へ
    } else if (s === "faqs") {
      bd.innerHTML = `<div class="q faqq">${esc(t("faqTitle"))}</div>
        <div class="faqs">${FAQ.map(f => `<button class="faqb" data-faq="${f.id}">${esc(f.q[lang] || f.q.en)}</button>`).join("")}
          <a class="faqb" href="/faq-en" target="_blank" rel="noopener">❓ ${esc(t("faqMore"))} ↗</a></div>
        <div class="row"><button class="btn ghost" data-a="restart">${esc(t("back"))}</button></div>${info()}`;
    } else if (s === "faq") {
      // よくある質問の答え（決まった文）
      const f = FAQ.find(x => x.id === st.faq) || FAQ[0];
      bd.innerHTML = `<div class="q">${esc(f.q[lang] || f.q.en)}</div><div class="msg">${esc(f.a[lang] || f.a.en)}</div>
        <div class="row"><button class="btn ghost" data-a="faqs">${esc(t("back"))}</button></div>${info()}`;
    } else if (s === "phone") {
      // 2026-11-14 理事長「下にスクロールしないと予約が出てこない」→ 予約のボタンをいちばん上に。料金・持ち物はその下
      bd.innerHTML = `<div class="msg">${esc(t("howWorks"))}</div>
        <div class="row"><button class="btn main" data-a="phoneNo">${esc(t("reqBtn"))}</button></div>
        <div class="small"><b>${esc(MENUS[st.menu].name)}</b> — ${esc(t(st.menu === "foreign" ? "feeNo" : "feeYes"))}</div>
        <div class="small">${esc(t("bring"))}</div>
        <div class="row"><button class="btn ghost" data-a="restart">${esc(t("back"))}</button></div>`;
    } else if (s === "self") {
      const steps = T.selfSteps[lang].map(x => `<li>${esc(x.replace("{menu}", MENUS[st.menu].name))}</li>`).join("");
      bd.innerHTML = `<div class="msg">${esc(t("selfBook"))}<ol>${steps}</ol></div>
        <div class="row"><a class="btn main" style="text-align:center;text-decoration:none" href="${bookUrl(st.menu)}" target="_blank" rel="noopener">${esc(t("openBook"))} ↗</a></div>
        <div class="small" style="margin-top:10px">${esc(t("orAsk"))}</div>
        <div class="row"><button class="btn" data-a="phoneNo">${esc(t("askUs"))}</button></div>
        <div class="msg small">${esc(t("bring"))}</div>
        <div class="row"><button class="btn ghost" data-a="toPhone">${esc(t("back"))}</button></div>`;
    } else if (s === "form") {
      renderForm();
    } else if (s === "confirm") {
      const f = st.form;
      const symTxt = f.sym.map(i => T.sym[lang][i]).join(", ");
      bd.innerHTML = `<div class="q">${esc(t("confirm"))}</div><div class="sum">
        <div>${esc(MENUS[st.menu].name)}</div>
        <div>${esc(t("fName"))}: <b>${esc(f.name)}</b></div>
        ${f.nameLocal ? `<div>${esc(t("fNameLocal"))}: <b>${esc(f.nameLocal)}</b></div>` : ""}
        <div>${esc(t("fBirth"))}: ${esc(f.birth)} / ${esc(t(f.sex))}</div>
        <div>${esc(t("fEmail"))}: ${esc(f.email)}</div>
        ${f.phone ? `<div>${esc(t("fPhone"))}: ${esc(f.phone)}</div>` : ""}
        ${f.stay ? `<div>${esc(t("fStay"))}: ${esc(f.stay)}</div>` : ""}
        ${f.slot ? `<div>${esc(t("fSlot"))}: <b>${esc(slotLabel(f.slot))}</b></div>` : `<div>${esc(t("fWhen1"))}: <b>${esc(f.d1)} ${esc(f.t1)}</b></div>
        ${f.d2 ? `<div>${esc(t("fWhen2"))}: ${esc(f.d2)} ${esc(f.t2)}</div>` : ""}`}
        ${symTxt ? `<div>${esc(t("fWhat"))}: ${esc(symTxt)}</div>` : ""}
        ${f.note ? `<div>${esc(t("fNote"))}: ${esc(f.note)}</div>` : ""}
        </div>
        <div class="row"><button class="btn ghost" data-a="toForm">${esc(t("edit"))}</button><button class="btn main" data-a="send">${esc(t(f.slot ? "book" : "send"))}</button></div>
        ${st.err ? `<div class="err">${esc(st.err)}</div>` : ""}`;
    } else if (s === "link") {
      // メールのボタン（Confirm・Cancel）から来たとき
      const L = st.link, whenBox = L.when ? `<div class="msg"><span style="font-size:1.2em;font-weight:bold">${esc(slotLabel(L.when))}</span><br>${esc(L.menuName || "")}</div>` : "";
      const say = { loading: "lkLoading", confirmed: "lkOk", already: "lkAlready", expired: "lkExpired", ask: "lkAsk", cancelled: "lkCancelled", notfound: "lkNotFound", fail: "lkFail" }[L.state] || "lkFail";
      const good = L.state === "confirmed" || L.state === "already";
      bd.innerHTML = `<div class="msg"${good ? ' style="background:#e8f5e9"' : ""}><b>${good ? "✅ " : ""}${esc(t(say))}</b></div>${whenBox}
        ${good ? `<div class="msg">${esc(t("come"))}</div><div class="msg small">${esc(t("bring"))}</div>` : ""}
        ${L.state === "ask" ? `<div class="row"><button class="btn" style="border-color:#c62828;color:#c62828" data-a="doCancel">${esc(t("lkCancel"))}</button></div>` : ""}
        ${L.state === "expired" || L.state === "cancelled" ? `<div class="row"><button class="btn main" data-a="restart">${esc(t("restart"))}</button></div>` : ""}
        ${info()}`;
    } else if (s === "sent" && st.booked) {
      // 時間を押さえて、確認のメールを送ったとき（メールの「Confirm」を押すと確定。2026-11-13 理事長：いたずら対策）
      bd.innerHTML = `<div class="msg" style="background:#fff8e1"><b>📧 ${esc(t("booked"))}</b><br><span style="font-size:1.25em;font-weight:bold">${esc(slotLabel(st.booked))}</span><br>${esc(MENUS[st.menu].name)}</div>
        <div class="msg">${esc(t("bookedHow").replace("{email}", st.form.email || ""))}</div>
        <div class="msg small">${esc(t("bring"))}</div>
        <div class="row"><button class="btn ghost" data-a="restart">${esc(t("restart"))}</button></div>${info()}`;
    } else if (s === "sent") {
      bd.innerHTML = `<div class="msg">${esc(t("sent"))}</div>${SUBMIT_URL ? "" : `<div class="small">${esc(t("testNote"))}</div>`}
        <div class="msg small">${esc(t("bring"))}</div>
        <div class="row"><button class="btn ghost" data-a="restart">${esc(t("restart"))}</button></div>${info()}`;
    }
    bd.scrollTop = 0;
    $("#panel").scrollTop = 0;   // スマホは画面全体が動くので、そちらも上に戻す
    concierge();
  }

  // ---- 申し込みの欄 ----
  const pad = n => String(n).padStart(2, "0");
  const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  function tokyoNow() { return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" })); }
  // その日に選べる時刻（診療日だけ。外国人メニューは 16:00・16:30 だけ）
  function timesFor(dateStr) {
    if (!dateStr) return [];
    const d = new Date(dateStr + "T00:00:00");
    const w = d.getDay(), md = (d.getMonth() + 1) * 100 + d.getDate();
    if (w === 0 || w === 6 || HOLIDAYS.includes(dateStr) || md >= 1229 || md <= 103) return [];
    let list;
    // 2026-11-14：保険あり（通訳アプリ）も 16:00・16:30 だけ。前の「診療時間の全部」は下に残す（使わない）
    if (st.menu === "foreign" || st.menu === "translation") list = FOREIGN_TIMES.slice();
    else {
      list = [];
      const add = (h1, m1, h2, m2) => { for (let m = h1 * 60 + m1; m <= h2 * 60 + m2; m += 30) list.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`); };
      if (w !== 3) add(10, 0, 13, 0);   // 水曜の午前は休診
      add(15, 0, 18, 0);
    }
    // 今日なら、1時間より先の時刻だけ
    const now = tokyoNow();
    if (dateStr === ymd(now)) { const lim = now.getHours() * 60 + now.getMinutes() + 60; list = list.filter(x => +x.slice(0, 2) * 60 + +x.slice(3) >= lim); }
    return list;
  }
  // 日時を読みやすく（例：Mon, 16 Nov 2026, 16:00）
  function slotLabel(s) {
    const d = new Date(String(s).slice(0, 10) + "T00:00:00");
    if (isNaN(d)) return s;
    const loc = lang === "zh" ? "zh-CN" : lang === "ko" ? "ko-KR" : "en-GB";
    return d.toLocaleDateString(loc, { weekday: "short", day: "numeric", month: "short", year: "numeric" }) + "  " + String(s).slice(11, 16);
  }
  // 案内できる時間を受け箱から読む（受付の左のパソコンの Claude が、空いている時間だけを写している）
  async function loadSlots() {
    if (!SUBMIT_URL) { st.slotsState = "none"; return; }
    st.slotsState = "loading";
    try {
      const r = await fetch(SUBMIT_URL + "?action=slots&t=" + Date.now());
      const j = await r.json();
      const list = (j.ok && j.fresh && j.slots && j.slots[st.menu]) || [];
      st.slots = list; st.slotsState = list.length ? "ok" : "none";
    } catch (e) { st.slots = []; st.slotsState = "none"; }
    if (st.step === "form") { readFormSoft(); render(); }
  }
  function readFormSoft() { if ($("#fName")) readForm(); }
  // 生年月日：年・月・日の3つのプルダウン（2026-11-14 理事長「スマホからスムーズに」。
  //   スマホの日付の欄は今日のカレンダーから始まり、何十年もさかのぼるのが手間なため）
  function birthSel(birth) {
    const [by, bm, bdd] = String(birth || "").split("-").map(Number);
    const yNow = tokyoNow().getFullYear();
    const opt = (v, lab, sel) => `<option value="${v}"${sel ? " selected" : ""}>${lab}</option>`;
    let ys = opt("", t("bYear")), ms = opt("", t("bMonth")), ds = opt("", t("bDay"));
    for (let y = yNow; y >= 1920; y--) ys += opt(y, y, y === by);
    for (let m = 1; m <= 12; m++) ms += opt(m, m, m === bm);
    for (let d = 1; d <= 31; d++) ds += opt(d, d, d === bdd);
    return `<div class="inl bday"><select id="bY" autocomplete="bday-year">${ys}</select><select id="bM" autocomplete="bday-month">${ms}</select><select id="bD" autocomplete="bday-day">${ds}</select></div>`;
  }
  // 3つのプルダウンから YYYY-MM-DD を作る（ない日付・未来の日は空にする）
  function birthVal() {
    const y = +($("#bY") || {}).value, m = +($("#bM") || {}).value, d = +($("#bD") || {}).value;
    if (!y || !m || !d) return "";
    const dt = new Date(y, m - 1, d);
    if (dt.getMonth() !== m - 1 || dt > tokyoNow()) return "";
    return `${y}-${pad(m)}-${pad(d)}`;
  }
  function renderForm() {
    const f = st.form;
    if (st.slotsState === "loading" || st.slotsState === "") {
      bd.innerHTML = `<div class="msg">${esc(t("loading"))}</div>`;
      if (st.slotsState === "") loadSlots();
      return;
    }
    const slotMode = st.slotsState === "ok";
    // 2026-11-14 理事長決定：空き時間が出ていないときは、申し込みを受けない（スタッフは外国の方に連絡しない決まりのため、返事をする人がいない）
    if (!slotMode) {
      bd.innerHTML = `<div class="msg">${esc(t("noOpenStop"))}</div>
        <div class="row"><button class="btn ghost" data-a="restart">${esc(t("back"))}</button></div>${info()}`;
      return;
    }
    const today = ymd(tokyoNow());
    const max = ymd(new Date(tokyoNow().getTime() + 60 * 86400000));
    const symBoxes = T.sym[lang].map((x, i) => `<label><input type="checkbox" name="sym" value="${i}"${(f.sym || []).includes(i) ? " checked" : ""}>${esc(x)}</label>`).join("");
    // 時間の欄：空きがあれば、その中から1つ選ぶ。なければ前のやり方（希望を書いて申し込み）
    const byDay = {};
    (st.slots || []).forEach(s => (byDay[s.slice(0, 10)] = byDay[s.slice(0, 10)] || []).push(s));
    const slotSel = `<label>${esc(t("fSlot"))} *</label><select id="fSlot"><option value=""></option>` +
      Object.keys(byDay).map(day => `<optgroup label="${esc(slotLabel(day + " 00:00").slice(0, -7))}">` +
        byDay[day].map(s => `<option value="${esc(s)}"${f.slot === s ? " selected" : ""}>${esc(slotLabel(s))}</option>`).join("") + `</optgroup>`).join("") + `</select>`;
    bd.innerHTML = `<div class="msg">${esc(t(slotMode ? "weBookNow" : "weBook"))}</div>${slotMode ? "" : `<div class="msg small">${esc(t("noOpen"))}</div>`}
      ${slotMode ? slotSel : ""}
      <div class="small"><b>${esc(MENUS[st.menu].name)}</b> — ${esc(t(st.menu === "foreign" ? "feeNo" : "feeYes"))}</div>
      <label>${esc(t("fName"))} *</label><input type="text" id="fName" autocomplete="name" autocapitalize="characters" autocorrect="off" spellcheck="false" value="${esc(f.name || "")}" placeholder="SMITH JOHN">
      <label>${esc(t("fNameLocal"))}</label><input type="text" id="fNameLocal" maxlength="40" value="${esc(f.nameLocal || "")}" placeholder="陳大文">
      <label>${esc(t("fBirth"))} *</label>${birthSel(f.birth)}
      <label>${esc(t("fSex"))} *</label><select id="fSex"><option value=""></option><option value="male"${f.sex === "male" ? " selected" : ""}>${esc(t("male"))}</option><option value="female"${f.sex === "female" ? " selected" : ""}>${esc(t("female"))}</option></select>
      <label>${esc(t("fEmail"))} *</label><input type="email" id="fEmail" autocomplete="email" inputmode="email" autocapitalize="off" autocorrect="off" spellcheck="false" value="${esc(f.email || "")}">
      <label>${esc(t("fPhone"))} *</label><input type="tel" id="fPhone" autocomplete="tel" inputmode="tel" value="${esc(f.phone || "")}" placeholder="+1 555 123 4567">
      <label>${esc(t("fStay"))}</label><input type="text" id="fStay" value="${esc(f.stay || "")}">
      ${slotMode ? "" : `<label>${esc(t("fWhen1"))} *</label><div class="inl"><input type="date" id="d1" min="${today}" max="${max}" value="${esc(f.d1 || "")}"><select id="t1"></select></div>
      <label>${esc(t("fWhen2"))}</label><div class="inl"><input type="date" id="d2" min="${today}" max="${max}" value="${esc(f.d2 || "")}"><select id="t2"></select></div>
      <div class="small">${esc(t("sameDay"))}</div>`}
      <label>${esc(t("fWhat"))}</label><div class="chk">${symBoxes}</div>
      <label>${esc(t("fNote"))}</label><textarea id="fNote" maxlength="200">${esc(f.note || "")}</textarea>
      <label class="chk" style="margin-top:12px"><span><input type="checkbox" id="agree"${f.agree ? " checked" : ""}> ${esc(t("consent"))}</span></label>
      <div class="err" id="err"></div>
      <div class="row"><button class="btn ghost" data-a="toPhone">${esc(t("back"))}</button><button class="btn main" data-a="check">${esc(t("confirm"))}</button></div>`;
    const fill = (dId, tId, keep) => {
      const sel = $("#" + tId), list = timesFor($("#" + dId).value);
      sel.innerHTML = `<option value="">${esc(t("pickTime"))}</option>` + list.map(x => `<option${x === keep ? " selected" : ""}>${x}</option>`).join("");
      sel.disabled = !$("#" + dId).value;
      if ($("#" + dId).value && !list.length) sel.innerHTML = `<option value="">${esc(t("noSlot"))}</option>`;
    };
    if (!slotMode) {
      fill("d1", "t1", f.t1); fill("d2", "t2", f.t2);
      $("#d1").addEventListener("change", () => fill("d1", "t1"));
      $("#d2").addEventListener("change", () => fill("d2", "t2"));
    }
    if (st.err) { $("#err").textContent = st.err; st.err = ""; }
  }
  function readForm() {
    const v = id => ($("#" + id) ? $("#" + id).value || "" : "").trim();
    st.form = {
      name: v("fName").toUpperCase().replace(/\s+/g, " "), nameLocal: v("fNameLocal").replace(/\s+/g, " "), birth: birthVal(), sex: v("fSex"), email: v("fEmail"), phone: v("fPhone"), stay: v("fStay"),
      d1: v("d1"), t1: v("t1"), d2: v("d2"), t2: v("t2"), slot: v("fSlot"),
      sym: [...root.querySelectorAll('input[name=sym]:checked')].map(x => +x.value), note: v("fNote"), agree: $("#agree").checked,
    };
    const f = st.form;
    const when = st.slotsState === "ok" ? !!f.slot : (f.d1 && f.t1);
    // 2026-11-14：電話は必須（デジスマの予約に電話番号が要るため）。数字が7けた以上
    if (!f.name || !f.birth || !f.sex || !f.email || !when || !f.agree || (f.phone.replace(/\D/g, "").length < 7) || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) return t("need");
    if (!/^[A-Z][A-Z .'\-,]*$/.test(f.name)) return t("latin");
    if (f.d2 && !f.t2) { f.d2 = ""; }
    return "";
  }

  // 流れ（2026-11-13 理事長）：日本語のデジスマの予約ページには飛ばさない。全員この画面で申し込み、クリニックが代わりに予約する
  // ---- 送る ----
  //   ・SUBMIT_URL（受け箱＝クリニックのスプレッドシート）に送る。メールは送らない
  //   ・SUBMIT_URL が空のときは試作：どこにも送らない
  //   ・送れなかったときは確認の画面に残り、もう一度押してもらう
  let sending = false;
  async function send() {
    if (sending) return;
    const f = st.form;
    const payload = {
      kind: "foreign-booking-request", at: new Date().toISOString(), lang,
      menu: st.menu, menuName: MENUS[st.menu].name, insurance: st.menu === "translation",
      name: f.name, nameLocal: f.nameLocal, birth: f.birth, sex: f.sex, email: f.email, phone: f.phone, stay: f.stay,
      slot: f.slot || "",
      first: f.slot || `${f.d1} ${f.t1}`, second: f.slot ? "" : (f.d2 ? `${f.d2} ${f.t2}` : ""),
      symptoms: f.sym.map(i => T.sym.en[i]), note: f.note,
    };
    if (SUBMIT_URL) {
      sending = true;
      const btn = root.querySelector('[data-a="send"]');
      if (btn) { btn.disabled = true; btn.textContent = t("sending"); }
      let ok = false, j = {};
      try {
        // text/plain で送る（Apps Script はこの形なら事前の確認なしで受け取れる）
        const r = await fetch(SUBMIT_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
        j = await r.json().catch(() => ({}));
        ok = !!j.ok;
      } catch (e) { ok = false; }
      sending = false;
      if (!ok && j.error === "taken") {
        // 送るまでのあいだに、ほかの人がその時間を取った → 時間を選び直してもらう
        st.form.slot = ""; st.err = t("taken"); st.step = "form"; st.slotsState = ""; render(); return;
      }
      if (!ok && (j.error === "dup" || j.error === "mail")) {
        // 同じメールで予約がある／メールが送れない（書き間違い）→ 欄の画面に戻って直してもらう
        st.err = t(j.error === "dup" ? "dup" : "mailFail"); st.step = "form"; render(); return;
      }
      if (!ok) { st.err = t("sendFail"); render(); return; }
      st.booked = j.pending ? f.slot : "";
    } else {
      window.__lastBookingRequest = payload;   // 試作：確かめるためにだけ残す（どこにも送らない）
      console.log("[試作] 申し込みの中身（送っていません）", payload);
    }
    st.err = ""; st.step = "sent"; render();
  }

  // ---- ボタン ----
  root.addEventListener("click", e => {
    const fq = e.target.closest("[data-faq]");
    if (fq) { st.faq = fq.dataset.faq; st.step = "faq"; render(); return; }
    const b = e.target.closest("[data-a],[data-l],#fab,#x,#snd");
    if (!b) return;
    if (b.id === "snd") {
      sound = !sound;
      try { sessionStorage.setItem("kbhSound", sound ? "1" : "0"); } catch (e) {}
      chrome_();
      if (sound) sayIt(sayText(), true); else stopTalk();
      return;
    }
    if (b.id === "fab") { $("#panel").classList.toggle("open"); render(); return; }
    if (b.id === "x") { if ($("#panel").classList.contains("full") && history.state && history.state.kbh) history.back(); else closeHelp(); return; }
    if (b.dataset.l) { if (st.step === "form") readForm(); lang = b.dataset.l; render(); return; }
    const a = b.dataset.a;
    // メニューが決まったら、案内できる時間を先に読み始める（欄の画面で待たせないように）
    if (a === "insYes") { st.menu = "translation"; st.step = "phone"; loadSlots(); }
    else if (a === "insNo") { st.menu = "foreign"; st.step = "form"; st.slotsState = ""; }
    else if (a === "faqs") st.step = "faqs";
    else if (a === "phoneYes") st.step = "self";
    else if (a === "phoneNo") st.step = "form";
    else if (a === "toPhone") { if (st.step === "form") readForm(); st.step = "start"; }   // 2026-11-14 保険の画面をなくしたので、戻るは最初の画面へ
    else if (a === "restart") { st.menu = ""; st.form = {}; st.step = "start"; st.booked = ""; st.slotsState = ""; st.link = null; }
    else if (a === "check") { const err = readForm(); if (err) { $("#err").textContent = err; return; } st.step = "confirm"; }
    else if (a === "toForm") st.step = "form";
    else if (a === "send") { send(); return; }
    else if (a === "doCancel") { linkCall(true); return; }
    render();
  });

  const put = () => { document.body.appendChild(host); chrome_(); };
  if (document.body) put(); else document.addEventListener("DOMContentLoaded", put);

  // ---- このページの「Book online」などのボタン（2026-11-13 理事長）----
  //   英語のページにある、日本語のデジスマの予約ページへのリンクを押したら、
  //   日本語のページは開かずに、このお手伝いの画面を開く（外国の方が日本語のページに行っても予約できないため）
  // 画面いっぱいで開く。ブラウザの「戻る」でも元のページに戻れるようにする
  function openHelp() {
    const p = $("#panel");
    const wasOpen = p.classList.contains("open");
    p.classList.add("open", "full");
    $("#fab").classList.add("hide");
    document.documentElement.style.overflow = "hidden";   // うしろのページが動かないように
    if (!(history.state && history.state.kbh)) history.pushState({ kbh: 1 }, "");
    if (!wasOpen) render(); else { chrome_(); concierge(); }
    $("#bd").scrollTop = 0;
  }
  function closeHelp() {
    const p = $("#panel");
    p.classList.remove("open", "full");
    $("#fab").classList.remove("hide");
    stopTalk(); lastSaid = "";
    chrome_();
    document.documentElement.style.overflow = "";
  }
  window.addEventListener("popstate", () => { if ($("#panel").classList.contains("full")) closeHelp(); });
  window.openKyobashiBookingHelp = openHelp;

  // ---- メールのボタンから来たとき（?booking=confirm|cancel&id=…。2026-11-13）----
  //   受け箱（script.google.com）に直接行かせると、Google に複数ログインしている人は開けないため、
  //   HP で受けて、ここから受け箱に頼む（ログインの状態に左右されない）
  async function linkCall(yes) {
    const L = st.link;
    L.state = "loading"; render();
    try {
      const u = SUBMIT_URL + "?action=" + L.action + "&id=" + encodeURIComponent(L.id) + (yes ? "&yes=1" : "") + "&t=" + Date.now();
      const j = await (await fetch(u)).json();
      if (!j.ok) throw new Error("ng");
      L.state = j.state; L.when = j.when || L.when; L.menuName = j.menuName || L.menuName;
      if (j.lang && T.hello[j.lang]) lang = j.lang;   // 予約したときの言葉で見せる
    } catch (e) { L.state = "fail"; }
    render();
  }
  (function fromEmail() {
    const q = new URLSearchParams(location.search);
    const action = q.get("booking"), id = q.get("id") || "";
    if ((action !== "confirm" && action !== "cancel") || !/^[0-9a-f-]{36}$/i.test(id) || !SUBMIT_URL) return;
    // 同じ画面を開き直したときに二度頼まないよう、アドレスから外しておく
    try { history.replaceState(null, "", location.origin + location.pathname + location.hash); } catch (e) {}
    st.link = { action, id, state: "loading" };
    st.step = "link";
    const go = () => { openHelp(); linkCall(false); };
    if (document.body) go(); else document.addEventListener("DOMContentLoaded", go);
  })();
  if (!document.querySelector(".mobile-cta")) { $("#fab").classList.add("nobar"); $("#panel").classList.add("nobar"); }
  document.addEventListener("click", e => {
    const a = e.target.closest && e.target.closest('a[href*="digikar-smart.jp"]');
    if (!a || !/\/reserve/.test(a.getAttribute("href") || "")) return;
    e.preventDefault(); e.stopPropagation();
    openHelp();
  }, true);
})();

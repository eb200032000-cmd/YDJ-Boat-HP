/* ============================================================
   会社情報 設定 (COMPANY INFO)
   正式な情報が決まったら、下の値を「''」の中に入力してください。
   空欄のままの項目は自動で「準備中」と表示されます。
   このファイル1つを書き換えるだけで、会社概要ページ(company.html)と
   トップページのお問い合わせ(index.html)の両方に反映されます。
============================================================ */
window.YK_COMPANY_INFO = {
  address:        '', // 所在地  例: '茨城県◯◯市◯◯1-2-3'
  founded:        '', // 設立    例: '2020年'
  representative: '', // 代表者  例: '山田 太郎'
  email:          '', // メール  例: 'info@yoshida-kako.co.jp'
  tel:            '', // 電話    例: '029-000-0000'

  // お問い合わせフォームの送信先(Googleフォーム)
  // サイトのフォームに入力された内容を、Googleフォームの回答として送ります。
  // 回答はGoogleフォーム/スプレッドシートにたまり、新着はメールで通知されます。
  // 下の値はGoogleフォームの「事前入力したURL」から取り出して入力します。
  googleForm: {
    action:  'https://docs.google.com/forms/d/e/1FAIpQLSdKosKpQ8znx3YJ00O1JJh0gv09EJDpu-GgOA3q5U5AYHKB1A/formResponse', // 例: 'https://docs.google.com/forms/d/e/1FAIpQL.../formResponse'
    name:    'entry.735661413', // お名前         例: 'entry.1234567890'
    org:     'entry.250494078', // 会社・法人名   例: 'entry.2345678901'
    email:   'entry.688390573', // メールアドレス 例: 'entry.3456789012'
    message: 'entry.1756217865', // お問い合わせ内容 例: 'entry.4567890123'
  },
};

/* 上の値が入力された項目だけ、「準備中」表示を実際の値に差し替える。 */
(function () {
  function applyCompanyInfo() {
    var info = window.YK_COMPANY_INFO || {};
    document.querySelectorAll('[data-field]').forEach(function (el) {
      var value = info[el.getAttribute('data-field')];
      if (value) {
        el.textContent = value;
        el.classList.remove('placeholder');
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCompanyInfo);
  } else {
    applyCompanyInfo();
  }
})();

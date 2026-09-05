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

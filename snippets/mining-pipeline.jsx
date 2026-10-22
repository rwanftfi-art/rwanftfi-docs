import { useState } from 'react';

export const MiningPipeline = ({ lang }) => {
  const [selectedLevel, setSelectedLevel] = useState(5);

  // Interface strings by page language; any other language falls back to English.
  // "{n}" stands for a number; an object holds one form per Intl.PluralRules category.
  /* i18n:begin */
  var STR = {
    en: {
      title: 'Mining Dashboard',
      subtitle: 'Illustrative pipeline overview — from Mining to Farming under current parameters',
      interactive: 'Interactive',
      days: { one: '{n} day', other: '{n} days' },
      totalPipeline: 'Total Pipeline',
      mining: 'Mining',
      farming: 'Farming',
      hours72: '72h',
      critical: '72-hour critical window — miss it and the entire cycle restarts from scratch',
      resultAfter: { one: 'Calculated Result After {n} day', other: 'Calculated Result After {n} days' },
      illustrative: 'Illustrative value at an assumed protocol price of 1.00 USDT — the actual protocol price applies at execution',
      basedOn: 'based on a {price} NFT',
      cycleN: 'cycle {n}',
      nftPrice: 'NFT Price',
      illustrativeValue: 'Illustrative Value',
      pipeline: 'Pipeline',
      oneCycle: 'This NFT tier has 1 mining cycle producing 10% of NFT price in NFTM.',
      future: 'Future protocol prices are not predetermined. After Farming, review the options on {link}.',
      sellingLending: 'Selling & Lending',
    },
    ru: {
      title: 'Панель майнинга',
      subtitle: 'Иллюстративный обзор цикла — от майнинга до фарминга по текущим параметрам',
      interactive: 'Интерактивно',
      days: { one: '{n} день', few: '{n} дня', many: '{n} дней', other: '{n} дня' },
      totalPipeline: 'Весь цикл',
      mining: 'Майнинг',
      farming: 'Фарминг',
      hours72: '72 ч',
      critical: 'Критическое окно 72 часа — если его пропустить, цикл начнётся заново',
      resultAfter: { one: 'Расчётный результат через {n} день', few: 'Расчётный результат через {n} дня', many: 'Расчётный результат через {n} дней', other: 'Расчётный результат через {n} дня' },
      illustrative: 'Иллюстративное значение при условной протокольной цене 1,00 USDT — при исполнении применяется фактическая протокольная цена',
      basedOn: 'для NFT за {price}',
      cycleN: 'цикл {n}',
      nftPrice: 'Цена NFT',
      illustrativeValue: 'Иллюстративное значение',
      pipeline: 'Цикл',
      oneCycle: 'У этого уровня NFT один цикл майнинга, который начисляет 10% от цены NFT в NFTM.',
      future: 'Будущие протокольные цены заранее не определены. После фарминга изучите варианты в разделе {link}.',
      sellingLending: 'Продажа и кредитование',
    },
    tr: {
      title: 'Madencilik Paneli',
      subtitle: 'Temsili süreç özeti — mevcut parametrelerle Madencilikten Farming\'e',
      interactive: 'Etkileşimli',
      days: { one: '{n} gün', other: '{n} gün' },
      totalPipeline: 'Toplam Süreç',
      mining: 'Madencilik',
      farming: 'Farming',
      hours72: '72 sa',
      critical: '72 saatlik kritik pencere — kaçırılırsa tüm döngü baştan başlar',
      resultAfter: { one: '{n} gün sonra hesaplanan sonuç', other: '{n} gün sonra hesaplanan sonuç' },
      illustrative: '1,00 USDT varsayımsal protokol fiyatıyla temsili değer — yürütme anında gerçek protokol fiyatı uygulanır',
      basedOn: '{price} fiyatlı bir NFT için',
      cycleN: '{n}.\u00A0döngü',
      nftPrice: 'NFT Fiyatı',
      illustrativeValue: 'Temsili Değer',
      pipeline: 'Süreç',
      oneCycle: 'Bu NFT seviyesinde, NFT fiyatının %10\'u kadar NFTM üreten 1 madencilik döngüsü vardır.',
      future: 'Gelecekteki protokol fiyatları önceden belirlenmiş değildir. Farming\'den sonra seçenekleri {link} sayfasında inceleyin.',
      sellingLending: 'Satış ve Borç Verme',
    },
    zh: {
      title: '挖矿面板',
      subtitle: '示意性流程概览——按当前参数，从挖矿到农场',
      interactive: '交互式',
      days: '{n} 天',
      totalPipeline: '完整流程',
      mining: '挖矿',
      farming: '农场',
      hours72: '72 小时',
      critical: '72 小时关键窗口——一旦错过，整个周期将从头开始',
      resultAfter: '{n} 天后的计算结果',
      illustrative: '按假定协议价格 1.00 USDT 计算的示意值——执行时适用实际协议价格',
      basedOn: '基于 {price} 的 NFT',
      cycleN: '周期 {n}',
      nftPrice: 'NFT 价格',
      illustrativeValue: '示意价值',
      pipeline: '流程时长',
      oneCycle: '该 NFT 等级有 1 个挖矿周期，产生相当于 NFT 价格 10% 的 NFTM。',
      future: '未来的协议价格并非预先确定。如需了解农场完成后的可选操作，请参阅{link}。',
      sellingLending: '出售与借贷',
    },
    es: {
      title: 'Panel de Minería',
      subtitle: 'Resumen ilustrativo del proceso — de la Minería al Farming según los parámetros actuales',
      interactive: 'Interactivo',
      days: { one: '{n} día', other: '{n} días' },
      totalPipeline: 'Duración total',
      mining: 'Minería',
      farming: 'Farming',
      hours72: '72 h',
      critical: 'Ventana crítica de 72 horas — si se pierde, todo el ciclo se reinicia desde cero',
      resultAfter: { one: 'Resultado calculado tras {n} día', other: 'Resultado calculado tras {n} días' },
      illustrative: 'Valor ilustrativo con un precio supuesto del protocolo de 1,00 USDT — en la ejecución se aplica el precio real del protocolo',
      basedOn: 'basado en un NFT de {price}',
      cycleN: 'ciclo {n}',
      nftPrice: 'Precio del NFT',
      illustrativeValue: 'Valor ilustrativo',
      pipeline: 'Duración',
      oneCycle: 'Este nivel de NFT tiene 1 ciclo de minería, que registra en NFTM el 10% del precio del NFT.',
      future: 'Los precios futuros del protocolo no están predeterminados. Opciones tras el Farming: {link}.',
      sellingLending: 'Venta\u00A0y\u00A0Lending',
    },
    de: {
      title: 'Mining-Dashboard',
      subtitle: 'Beispielhafter Überblick über den Ablauf — vom Mining bis zum Farming nach den aktuellen Parametern',
      interactive: 'Interaktiv',
      days: { one: '{n} Tag', other: '{n} Tage' },
      totalPipeline: 'Gesamtdauer',
      mining: 'Mining',
      farming: 'Farming',
      hours72: '72\u00A0h',
      critical: 'Kritisches 72-Stunden-Fenster — wird es verpasst, beginnt der gesamte Zyklus von vorn',
      resultAfter: { one: 'Berechnetes Ergebnis nach {n} Tag', other: 'Berechnetes Ergebnis nach {n} Tagen' },
      illustrative: 'Beispielwert bei einem angenommenen Protokollpreis von 1,00 USDT — bei der Ausführung gilt der tatsächliche Protokollpreis',
      basedOn: 'bei einem NFT für {price}',
      cycleN: 'Zyklus {n}',
      nftPrice: 'NFT-Preis',
      illustrativeValue: 'Beispielwert',
      pipeline: 'Dauer',
      oneCycle: 'Diese NFT-Stufe hat einen Mining-Zyklus, der 10\u00A0% des NFT-Preises in NFTM generiert.',
      future: 'Künftige Protokollpreise stehen nicht im Voraus fest. Prüfen Sie nach dem Farming die Möglichkeiten auf der Seite {link}.',
      sellingLending: 'Verkauf & Lending',
    },
    pt: {
      title: 'Painel de Mineração',
      subtitle: 'Visão geral ilustrativa do processo — da Mineração ao Farming, com os parâmetros atuais',
      interactive: 'Interativo',
      days: { one: '{n} dia', other: '{n} dias' },
      totalPipeline: 'Processo completo',
      mining: 'Mineração',
      farming: 'Farming',
      hours72: '72 h',
      critical: 'Janela crítica de 72 horas — se ela for perdida, todo o ciclo recomeça do zero',
      resultAfter: { one: 'Resultado calculado após {n} dia', other: 'Resultado calculado após {n} dias' },
      illustrative: 'Valor ilustrativo a um preço de protocolo hipotético de 1,00 USDT — na execução, aplica-se o preço de protocolo vigente',
      basedOn: 'com base em um NFT de {price}',
      cycleN: 'ciclo {n}',
      nftPrice: 'Preço do NFT',
      illustrativeValue: 'Valor ilustrativo',
      pipeline: 'Processo',
      oneCycle: 'Este nível de NFT tem 1 ciclo de mineração, que registra 10% do preço do NFT em NFTM.',
      future: 'Os preços futuros do protocolo não são predeterminados. Após o Farming, confira as opções em {link}.',
      sellingLending: 'Vender e Emprestar',
    },
    hi: {
      title: 'माइनिंग डैशबोर्ड',
      subtitle: 'उदाहरणात्मक पाइपलाइन अवलोकन — वर्तमान पैरामीटर के तहत माइनिंग से फार्मिंग तक',
      interactive: 'इंटरैक्टिव',
      days: { one: '{n} दिन', other: '{n} दिन' },
      totalPipeline: 'कुल पाइपलाइन',
      mining: 'माइनिंग',
      farming: 'फार्मिंग',
      hours72: '72 घं',
      critical: '72 घंटे की महत्वपूर्ण क्लेम विंडो — चूकने पर पूरा चक्र दोबारा शुरू होता है',
      resultAfter: { one: '{n} दिन बाद गणना किया गया परिणाम', other: '{n} दिन बाद गणना किया गया परिणाम' },
      illustrative: '1.00 USDT के कल्पित प्रोटोकॉल मूल्य पर उदाहरणात्मक मान — निष्पादन के समय वास्तविक प्रोटोकॉल मूल्य लागू होता है',
      basedOn: '{price} के NFT के आधार पर',
      cycleN: 'चक्र {n}',
      nftPrice: 'NFT मूल्य',
      illustrativeValue: 'उदाहरणात्मक मान',
      pipeline: 'पाइपलाइन',
      oneCycle: 'इस NFT स्तर में 1 माइनिंग चक्र है, जो NFT मूल्य का 10% NFTM में दर्ज करता है।',
      future: 'भविष्य के प्रोटोकॉल मूल्य पूर्वनिर्धारित नहीं हैं। फार्मिंग के बाद {link} पेज पर विकल्पों की समीक्षा करें।',
      sellingLending: 'बिक्री और लेंडिंग',
    },
    it: {
      title: 'Dashboard del Mining',
      subtitle: 'Panoramica illustrativa del processo — dal Mining al Farming secondo i parametri attuali',
      interactive: 'Interattivo',
      days: { one: '{n} giorno', other: '{n} giorni' },
      totalPipeline: 'Durata totale',
      mining: 'Mining',
      farming: 'Farming',
      hours72: '72\u00A0h',
      critical: 'Finestra critica di 72 ore — se non viene rispettata, l\'intero ciclo riparte da zero',
      resultAfter: { one: 'Risultato calcolato dopo {n} giorno', other: 'Risultato calcolato dopo {n} giorni' },
      illustrative: 'Valore illustrativo a un prezzo di protocollo ipotetico di 1,00 USDT — al momento dell\'esecuzione si applica il prezzo di protocollo effettivo',
      basedOn: 'per un NFT da {price}',
      cycleN: 'ciclo {n}',
      nftPrice: 'Prezzo NFT',
      illustrativeValue: 'Valore illustrativo',
      pipeline: 'Durata',
      oneCycle: 'Questo livello NFT ha 1 ciclo di mining, che registra in NFTM il 10% del prezzo dell\'NFT.',
      future: 'I futuri prezzi di protocollo non sono predeterminati. Dopo il Farming, consulti le opzioni nella pagina {link}.',
      sellingLending: 'Vendita e Lending',
    },
    fr: {
      title: 'Tableau de Bord du Minage',
      subtitle: 'Aperçu illustratif du cycle — du Minage au Farming selon les paramètres actuels',
      interactive: 'Interactif',
      days: { one: '{n} jour', other: '{n} jours' },
      totalPipeline: 'Cycle complet',
      mining: 'Minage',
      farming: 'Farming',
      hours72: '72\u00A0h',
      critical: 'Fenêtre critique de 72 heures — si elle est manquée, le cycle entier recommence depuis le début',
      resultAfter: { one: 'Résultat calculé après {n} jour', other: 'Résultat calculé après {n} jours' },
      illustrative: 'Valeur illustrative à un prix protocolaire supposé de 1,00 USDT — le prix protocolaire réel s\'applique à l\'exécution',
      basedOn: 'pour un NFT à {price}',
      cycleN: 'cycle\u00A0{n}',
      nftPrice: 'Prix du NFT',
      illustrativeValue: 'Valeur illustrative',
      pipeline: 'Cycle',
      oneCycle: 'Ce niveau de NFT dispose d\'un seul cycle de minage, qui enregistre en NFTM 10\u00A0% du prix du NFT.',
      future: 'Les prix protocolaires futurs ne sont pas prédéterminés. Après le Farming, consultez les options sur la page {link}.',
      sellingLending: 'Vente & Prêt',
    },
    id: {
      title: 'Dasbor Mining',
      subtitle: 'Ikhtisar alur ilustratif — dari Mining hingga Farming berdasarkan parameter yang berlaku saat ini',
      interactive: 'Interaktif',
      days: '{n} hari',
      totalPipeline: 'Total durasi',
      mining: 'Mining',
      farming: 'Farming',
      hours72: '72 j',
      critical: 'Jendela kritis 72 jam — jika terlewat, seluruh siklus diatur ulang dari awal',
      resultAfter: 'Hasil perhitungan setelah {n} hari',
      illustrative: 'Nilai ilustratif dengan asumsi harga protokol 1,00 USDT — harga protokol aktual berlaku pada saat eksekusi',
      basedOn: 'berdasarkan NFT seharga {price}',
      cycleN: 'siklus {n}',
      nftPrice: 'Harga NFT',
      illustrativeValue: 'Nilai Ilustratif',
      pipeline: 'Durasi',
      oneCycle: 'Tingkatan NFT ini memiliki 1 siklus mining yang mencatat NFTM sebesar 10% dari harga NFT.',
      future: 'Harga protokol di masa depan tidak ditentukan sebelumnya. Setelah Farming, tinjau opsi yang tersedia di halaman {link}.',
      sellingLending: 'Penjualan & Pinjaman',
    },
    ja: {
      title: 'マイニングダッシュボード',
      subtitle: '例示的なパイプラインの概要 — 現行のパラメータによるマイニングからファーミングまで',
      interactive: 'インタラクティブ',
      days: '{n}日間',
      totalPipeline: 'パイプライン全体',
      mining: 'マイニング',
      farming: 'ファーミング',
      hours72: '72時間',
      critical: '72時間のクレームウィンドウ — 期限を過ぎるとサイクル全体が最初からやり直しになります',
      resultAfter: '{n}日後の計算結果',
      illustrative: 'プロトコル価格を1.00 USDTと仮定した例示値です — 執行時には実際のプロトコル価格が適用されます',
      basedOn: '価格{price}のNFTの場合',
      cycleN: '第{n}サイクル',
      nftPrice: 'NFT価格',
      illustrativeValue: '例示値',
      pipeline: 'パイプライン',
      oneCycle: 'このNFTティアのマイニングサイクルは1回で、NFT価格の10%をNFTMとして生成します。',
      future: '将来のプロトコル価格はあらかじめ決まっていません。ファーミング後の選択肢については、{link}をご覧ください。',
      sellingLending: '売却とレンディング',
    },
    vi: {
      title: 'Bảng Điều Khiển Khai Thác',
      subtitle: 'Minh họa quy trình — từ Khai Thác đến Farming theo các tham số hiện hành',
      interactive: 'Tương\u00A0tác',
      days: '{n} ngày',
      totalPipeline: 'Toàn bộ quy trình',
      mining: 'Khai Thác',
      farming: 'Farming',
      hours72: '72h',
      critical: 'Cửa sổ nhận 72 giờ — nếu bỏ lỡ, toàn bộ chu kỳ sẽ bắt đầu lại từ đầu',
      resultAfter: 'Kết quả tính toán sau {n} ngày',
      illustrative: 'Giá trị minh họa với giá giao thức giả định 1,00 USDT — giá giao thức thực tế được áp dụng tại thời điểm thực hiện',
      basedOn: 'dựa trên NFT giá {price}',
      cycleN: 'chu kỳ {n}',
      nftPrice: 'Giá NFT',
      illustrativeValue: 'Giá trị minh họa',
      pipeline: 'Quy trình',
      oneCycle: 'Cấp NFT này có 1 chu kỳ khai thác, tạo ra lượng NFTM bằng 10% giá NFT.',
      future: 'Giá giao thức trong tương lai không được xác định trước. Sau Farming, hãy xem các lựa chọn tại trang {link}.',
      sellingLending: 'Bán & Cho Vay',
    },
    uk: {
      title: 'Панель майнінгу',
      subtitle: 'Ілюстративний огляд циклу — від Майнінгу до Фармінгу за поточних параметрів',
      interactive: 'Інтерактив',
      days: { one: '{n} день', few: '{n} дні', many: '{n} днів', other: '{n} дні' },
      totalPipeline: 'Увесь цикл',
      mining: 'Майнінг',
      farming: 'Фармінг',
      hours72: '72 год',
      critical: 'Критичне 72-годинне вікно — якщо його пропустити, увесь цикл почнеться спочатку',
      resultAfter: { one: 'Розрахунковий результат через {n} день', few: 'Розрахунковий результат через {n} дні', many: 'Розрахунковий результат через {n} днів', other: 'Розрахунковий результат через {n} дні' },
      illustrative: 'Ілюстративне значення за умовної протокольної ціни 1,00 USDT — під час виконання застосовується фактична протокольна ціна',
      basedOn: 'для NFT за {price}',
      cycleN: 'цикл {n}',
      nftPrice: 'Ціна NFT',
      illustrativeValue: 'Ілюстративна вартість',
      pipeline: 'Цикл',
      oneCycle: 'Цей рівень NFT має один цикл майнінгу, який фіксує в NFTM 10% від ціни NFT.',
      future: 'Майбутні протокольні ціни не визначено заздалегідь. Після Фармінгу ознайомтеся з варіантами в розділі {link}.',
      sellingLending: 'Продаж і Кредитування',
    },
  };
  /* i18n:end */
  var L = STR[lang] ? lang : 'en';
  var T = STR[L];
  var plural = new Intl.PluralRules(L);
  var fmt = function(v, n) { return (typeof v === 'string' ? v : v[plural.select(n)] || v.other).split('{n}').join(n); };

  const LEVELS = {
    5:  { name: 'HYDRO',    price: 550,   days: 45, c1: 0.10, c2: 0, cycles: 1 },
    6:  { name: 'QUANTUM',  price: 1100,  days: 44, c1: 0.10, c2: 0, cycles: 1 },
    7:  { name: 'PULSE',    price: 2200,  days: 43, c1: 0.10, c2: 0, cycles: 1 },
    8:  { name: 'AURORA',   price: 5500,  days: 42, c1: 0.10, c2: 0.15, cycles: 2 },
    9:  { name: 'FLAME',    price: 11000, days: 41, c1: 0.10, c2: 0.15, cycles: 2 },
    10: { name: 'INFINITY', price: 24000, days: 40, c1: 0.10, c2: 0.15, cycles: 2 },
  };

  // Thousands separators match the tables on each language's pages. Every amount here is a whole number.
  var SEP = { ru: '\u00A0', uk: '\u00A0', fr: '\u00A0', tr: '.', es: '.', de: '.', pt: '.', it: '.', id: '.', vi: '.' }[L] || ',';
  var fmtNum = function(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, SEP); };
  var fmtUsd = function(n) { return '$' + fmtNum(n); };

  var lvl = LEVELS[selectedLevel];
  var nftmCycle1 = lvl.price * lvl.c1;
  var nftmCycle2 = lvl.price * lvl.c2;
  var totalNftm = nftmCycle1 + nftmCycle2;
  var totalDays = lvl.days * 2 * lvl.cycles;
  var daPrice = 1.00;
  var daReceived = totalNftm / daPrice;
  return (
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.05)' }} className="p-6 rounded-xl not-prose" lang={L}>

      {/* 1. Header + NFT Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 style={{ color: '#FFFFFF', margin: 0 }} className="text-lg font-serif italic">{T.title}</h3>
          <p style={{ color: 'rgba(255,255,255,0.4)', margin: '4px 0 0 0' }} className="text-xs">{T.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedLevel}
            onChange={function(e) { setSelectedLevel(Number(e.target.value)); }}
            style={{ backgroundColor: '#383838', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', cursor: 'pointer', outline: 'none' }}
          >
            {Object.entries(LEVELS).map(function(entry) {
              var k = entry[0];
              var d = entry[1];
              return <option key={k} value={k}>L{k} — {d.name} ({fmtNum(d.price)} USDT) — {fmt(T.days, d.days)}</option>;
            })}
          </select>
          <span style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '11px', padding: '4px 12px', borderRadius: '9999px', fontWeight: 500 }} className="hidden sm:inline-block">{T.interactive}</span>
        </div>
      </div>

      {/* 2. Timeline Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs font-medium">{T.totalPipeline}</span>
          <span style={{ color: '#FFFFFF' }} className="text-sm font-bold">{fmt(T.days, totalDays)}</span>
        </div>

        <div className="flex items-center gap-0.5" style={{ height: '48px', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.18)', flex: '1 1 0%', minWidth: 0, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: 700 }}>{T.mining}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>
                {lvl.cycles === 1 ? fmt(T.days, lvl.days) : '2 × ' + fmt(T.days, lvl.days)} — {fmtNum(totalNftm)} NFTM
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: '#ef4444', flex: '0 0 auto', padding: '0 6px', whiteSpace: 'nowrap', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#FFFFFF', fontSize: '9px', fontWeight: 900 }}>{T.hours72}</div>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', flex: '1 1 0%', minWidth: 0, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: 700 }}>{T.farming}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px' }}>{lvl.cycles === 1 ? fmt(T.days, lvl.days) : '2 × ' + fmt(T.days, lvl.days)} — {fmtNum(daReceived)} DA</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="relative flex" style={{ height: '8px', width: '8px' }}>
            <span className="animate-ping absolute inline-flex rounded-full" style={{ height: '100%', width: '100%', backgroundColor: '#ef4444', opacity: 0.75 }} />
            <span className="relative inline-flex rounded-full" style={{ height: '8px', width: '8px', backgroundColor: '#ef4444' }} />
          </span>
          <span style={{ color: '#f87171', fontSize: '11px', fontWeight: 500 }}>{T.critical}</span>
        </div>
      </div>

      {/* 3. Your DA Output: Video + Content */}
      <div className="mb-6" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
        {/* Video */}
        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center' }} className="w-[160px] sm:w-[140px] mx-auto sm:mx-0">
          <video autoPlay muted loop playsInline style={{ borderRadius: '12px', objectFit: 'cover' }} className="w-[160px] h-[160px] sm:w-[140px] sm:h-[140px]">
            <source src="/NFTMp.webm" type="video/webm" />
          </video>
        </div>
        {/* Content */}
        <div style={{ flex: '1 1 0%', minWidth: '240px' }}>
          <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }}
               className="rounded-xl p-5 text-center">
            <div style={{ color: 'rgba(255,255,255,0.4)' }}
                 className="text-[10px] uppercase tracking-wider mb-1">
              {fmt(T.resultAfter, totalDays)}
            </div>
            <div style={{ color: '#FFFFFF', fontSize: '36px' }}
                 className="font-black">
              {fmtNum(daReceived)} DA
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)' }}
                 className="text-xs mt-1">
              {T.illustrative}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)' }}
                 className="text-xs mt-2">
              {T.basedOn.split('{price}').join(fmtUsd(lvl.price))} · {lvl.cycles === 1
                ? fmt(T.cycleN, 1) + ': ' + fmtNum(nftmCycle1) + ' NFTM'
                : fmt(T.cycleN, 1) + ': ' + fmtNum(nftmCycle1) + ' + ' + fmt(T.cycleN, 2) + ': ' + fmtNum(nftmCycle2) + ' NFTM'
              }
            </div>
          </div>
        </div>
      </div>
      {/* Three columns from sm up; on phones each tile becomes a label-value row. */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3" style={{ marginTop: '12px' }}>
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }}
             className="rounded-xl p-3 flex items-center justify-between gap-3 sm:block sm:text-center">
          <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-[10px] uppercase tracking-wider sm:mb-1">{T.nftPrice}</div>
          <div style={{ color: '#FFFFFF' }} className="text-base font-bold">{fmtUsd(lvl.price)}</div>
        </div>
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }}
             className="rounded-xl p-3 flex items-center justify-between gap-3 sm:block sm:text-center">
          <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-[10px] uppercase tracking-wider sm:mb-1">{T.illustrativeValue}</div>
          <div style={{ color: '#FFFFFF' }} className="text-base font-bold">{fmtUsd(daReceived * daPrice)}</div>
        </div>
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }}
             className="rounded-xl p-3 flex items-center justify-between gap-3 sm:block sm:text-center">
          <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-[10px] uppercase tracking-wider sm:mb-1">{T.pipeline}</div>
          <div style={{ color: '#FFFFFF' }} className="text-base font-bold">{fmt(T.days, totalDays)}</div>
        </div>
      </div>
      {lvl.cycles === 1 && (
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.15)',
          marginTop: '12px'
        }} className="rounded-xl p-4 text-center">
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
            {T.oneCycle}
          </div>
        </div>
      )}
      <div style={{ color: 'rgba(255,255,255,0.4)' }}
           className="text-xs text-center mt-3">
        {T.future.split('{link}')[0]}
        <a href={'/' + (lang || 'en') + '/da-selling-lending'}
           style={{ color: '#FFFFFF', textDecoration: 'underline' }}>
          {T.sellingLending}
        </a>
        {T.future.split('{link}')[1]}
      </div>

    </div>
  );
};

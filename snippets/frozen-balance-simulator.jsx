import { useState, useEffect, useRef } from 'react';

export const FrozenBalanceSimulator = ({ lang }) => {
  if (typeof window === 'undefined') { return null; }

  // Interface strings by page language; any other language falls back to English.
  // "{n}" stands for a number.
  /* i18n:begin */
  var STR = {
    en: {
      title: 'Frozen Balance Simulator',
      interactive: 'Interactive',
      yourNft: 'Your NFT',
      yourNftHint: 'Your current Protocol Reward Cap',
      inviteeNft: 'Invitee\'s First NFT',
      inviteeNftHint: 'First purchase by direct personal invitee',
      commission: 'Sponsor Bonus',
      commissionHint: 'of NFT price (first purchase)',
      remaining: 'Your Remaining Protocol Reward Cap',
      remainingHint: 'Available room before compression',
      triggerOff: 'No freeze — the bonus fits within your cap',
      triggerOffSub: 'Full amount credited immediately under the standard 75 / 20 / 5 split.',
      triggerOn: 'Frozen Balance triggered',
      triggerOnSub: 'Excess above your cap is held for 72 hours while you decide.',
      immediate: 'Credited immediately',
      now: 'NOW',
      immediateHint: 'Within your Protocol Reward Cap · 75 / 20 / 5 split',
      frozen: 'Frozen for 72 h',
      frozenHint: 'Excess above your Protocol Reward Cap',
      lostHeader: 'Standard split applied to the credited part',
      reg: 'Regular Balance',
      acc: 'Accumulative Balance',
      pool: 'DA Liquidity Pool',
      regHint: 'Withdraw anytime',
      accHint: '180-day lifetime (temporary)',
      poolHint: 'New DA minting',
      timerHeader: '72-hour window',
      timerSub: 'Choose how the freeze resolves',
      tabUpgrade: 'Upgrade NFT',
      tabAutobuy: 'Autobuy fires',
      tabForfeit: 'Miss deadline',
      upgradeTitle: 'You upgrade to a higher tier',
      upgradeBody: 'Frozen funds are released and credited under the same 75 / 20 / 5 split. The released amount is deducted from the new NFT\'s Protocol Reward Cap.',
      upgradeChoose: 'Pick the NFT you upgrade to',
      upgradeReleased: 'Frozen amount released',
      upgradeNewLimit: 'New NFT Reward Cap',
      upgradeRemaining: 'Remaining cap after release',
      upgradeImpossible: 'Pick a tier above your current NFT — and at least the invitee\'s tier — to absorb the frozen amount in full.',
      autobuyTitle: 'Autobuy fires first and refreshes your cap',
      autobuyBody: 'Autobuy renews the same-level NFT before the bonus is applied. The refreshed Protocol Reward Cap absorbs the bonus first; only the leftover (if any) goes into Frozen Balance.',
      autobuyRefreshed: 'Refreshed Reward Cap',
      autobuyAbsorbed: 'Absorbed by autobuy',
      autobuyLeftover: 'Still goes to freeze',
      autobuyNote: 'If your own NFT and refreshed cap are sufficient, Frozen Balance never activates.',
      forfeitTitle: 'You miss the 72-hour window',
      forfeitBody: 'The amount is redistributed under the current protocol parameters: the configured share is routed to the DA Liquidity Pool and the remainder follows the sponsor route.',
      forfeitPool: 'To DA Liquidity Pool',
      forfeitSponsor: 'To upline sponsor',
      forfeitCascade: 'If your upline sponsor has a zero Protocol Reward Cap, the sponsor share cascades upward to the next eligible sponsor. If no upline is eligible, the full amount routes to the DA Liquidity Pool.',
      footerNote: 'Frozen Balance applies to the qualifying first purchase and Autobuy of a direct personal invitee. Manual repeat purchases above your cap follow the standard missed-reward and compression rules.',
      noFreezeFooter: 'Increase the invitee\'s NFT level — or pick a smaller NFT for yourself — to see the freeze trigger.',
      hoursN: '{n}h',
      level: 'L',
    },
    ru: {
      title: 'Симулятор Frozen Balance',
      interactive: 'Интерактивно',
      yourNft: 'Ваш NFT',
      yourNftHint: 'Ваш текущий Лимит вознаграждений протокола',
      inviteeNft: 'Первый NFT приглашённого',
      inviteeNftHint: 'Первая покупка прямого приглашённого',
      commission: 'Спонсорский бонус',
      commissionHint: 'от цены NFT (первая покупка)',
      remaining: 'Ваш оставшийся Лимит вознаграждений',
      remainingHint: 'Запас до компрессии',
      triggerOff: 'Заморозки нет — бонус укладывается в Лимит',
      triggerOffSub: 'Вся сумма зачисляется сразу по стандартному распределению 75 / 20 / 5.',
      triggerOn: 'Frozen Balance активирован',
      triggerOnSub: 'Излишек сверх Лимита удерживается 72 часа, пока вы принимаете решение.',
      immediate: 'Зачисляется сразу',
      now: 'СЕЙЧАС',
      immediateHint: 'В пределах вашего Лимита · распределение 75 / 20 / 5',
      frozen: 'Заморожено на 72 ч',
      frozenHint: 'Излишек сверх вашего Лимита',
      lostHeader: 'Стандартное распределение зачисленной части',
      reg: 'Обычный баланс',
      acc: 'Накопительный баланс',
      pool: 'Пул ликвидности DA',
      regHint: 'Вывод в любой момент',
      accHint: 'Срок жизни 180 дней (временно)',
      poolHint: 'Выпуск нового DA',
      timerHeader: '72-часовое окно',
      timerSub: 'Выберите, чем завершится заморозка',
      tabUpgrade: 'Апгрейд NFT',
      tabAutobuy: 'Срабатывает Autobuy',
      tabForfeit: 'Срок пропущен',
      upgradeTitle: 'Вы апгрейдите NFT на более высокий уровень',
      upgradeBody: 'Замороженные средства высвобождаются и зачисляются по тому же распределению 75 / 20 / 5. Высвобожденная сумма списывается с Лимита вознаграждений протокола нового NFT.',
      upgradeChoose: 'Выберите NFT для апгрейда',
      upgradeReleased: 'Высвобождено из заморозки',
      upgradeNewLimit: 'Лимит нового NFT',
      upgradeRemaining: 'Остаток Лимита после высвобождения',
      upgradeImpossible: 'Выберите уровень выше текущего и не ниже уровня приглашённого, чтобы Лимит вместил всю замороженную сумму.',
      autobuyTitle: 'Сначала срабатывает Autobuy и обновляет Лимит',
      autobuyBody: 'Autobuy продлевает NFT того же уровня до начисления бонуса. Обновлённый Лимит вознаграждений протокола сначала поглощает бонус, и только остаток, если он есть, помещается во Frozen Balance.',
      autobuyRefreshed: 'Обновлённый Лимит вознаграждений',
      autobuyAbsorbed: 'Поглощено через Autobuy',
      autobuyLeftover: 'Уходит в заморозку',
      autobuyNote: 'Если обновлённого Лимита вашего NFT достаточно, Frozen Balance не активируется.',
      forfeitTitle: 'Вы пропустили 72-часовое окно',
      forfeitBody: 'Сумма перераспределяется по текущим параметрам протокола: настроенная доля направляется в Пул ликвидности DA, а остаток следует по спонсорскому маршруту.',
      forfeitPool: 'В Пул ликвидности DA',
      forfeitSponsor: 'Вышестоящему спонсору',
      forfeitCascade: 'Если у вышестоящего спонсора Лимит вознаграждений протокола равен нулю, спонсорская доля передаётся дальше вверх до первого подходящего спонсора. Если подходящих спонсоров выше нет, вся сумма направляется в Пул ликвидности DA.',
      footerNote: 'Frozen Balance действует для квалифицируемой первой покупки и Autobuy прямого приглашённого. Ручные повторные покупки сверх Лимита следуют стандартным правилам пропущенных вознаграждений и компрессии.',
      noFreezeFooter: 'Повысьте уровень NFT приглашённого или выберите для себя NFT меньшего уровня, чтобы увидеть срабатывание заморозки.',
      hoursN: '{n} ч',
      level: 'L',
    },
    tr: {
      title: 'Dondurulmuş Bakiye Simülatörü',
      interactive: 'Etkileşimli',
      yourNft: 'NFT\'niz',
      yourNftHint: 'Mevcut Protokol Ödül Limitiniz',
      inviteeNft: 'Davet Edilenin İlk NFT\'si',
      inviteeNftHint: 'Doğrudan kişisel olarak davet edilen kişinin ilk satın alımı',
      commission: 'Sponsor Bonusu',
      commissionHint: 'NFT fiyatı üzerinden (ilk satın alma)',
      remaining: 'Kalan Limitiniz',
      remainingHint: 'Sıkıştırma öncesi kullanılabilir alan',
      triggerOff: 'Dondurma yok — bonus limitinize sığıyor',
      triggerOffSub: 'Tutarın tamamı standart 75 / 20 / 5 bölünmesi uyarınca hemen yatırılır.',
      triggerOn: 'Dondurulmuş Bakiye tetiklendi',
      triggerOnSub: 'Limitinizi aşan fazlalık, siz karar verirken 72 saat boyunca tutulur.',
      immediate: 'Hemen yatırılır',
      now: 'ŞİMDİ',
      immediateHint: 'Ödül Limitiniz dahilinde · 75 / 20 / 5 bölünmesi',
      frozen: '72 saat dondurulur',
      frozenHint: 'Protokol Ödül Limitinizi aşan fazlalık',
      lostHeader: 'Yatırılan kısma uygulanan standart bölünme',
      reg: 'Normal Bakiye',
      acc: 'Birikim Bakiyesi',
      pool: 'DA Likidite Havuzu',
      regHint: 'İstenen zaman çekilebilir',
      accHint: '180 günlük ömür (geçici)',
      poolHint: 'Yeni DA basımı',
      timerHeader: '72 saatlik pencere',
      timerSub: 'Dondurmanın nasıl sonuçlanacağını seçin',
      tabUpgrade: 'NFT yükseltme',
      tabAutobuy: 'Otomatik Alım',
      tabForfeit: 'Süre kaçırıldı',
      upgradeTitle: 'Daha yüksek bir seviyeye yükseltirsiniz',
      upgradeBody: 'Dondurulan fonlar serbest bırakılır ve aynı 75 / 20 / 5 bölünmesi uyarınca yatırılır. Serbest bırakılan tutar, yeni NFT\'nin Protokol Ödül Limitinden düşülür.',
      upgradeChoose: 'Yükselteceğiniz NFT\'yi seçin',
      upgradeReleased: 'Serbest bırakılan tutar',
      upgradeNewLimit: 'Yeni NFT\'nin Ödül Limiti',
      upgradeRemaining: 'Kalan limit',
      upgradeImpossible: 'Dondurulan tutarın tamamını karşılamak için mevcut NFT\'nizden yüksek ve en az davet edilen kişinin seviyesinde bir seviye seçin.',
      autobuyTitle: 'Önce Otomatik Alım tetiklenir ve limitinizi tazeler',
      autobuyBody: 'Otomatik Alım, bonus uygulanmadan önce aynı seviyedeki NFT\'yi yeniler. Tazelenen Protokol Ödül Limiti önce bonusu karşılar; Dondurulmuş Bakiyeye yalnızca kalan fazlalık (varsa) yerleştirilir.',
      autobuyRefreshed: 'Tazelenen Ödül Limiti',
      autobuyAbsorbed: 'Otomatik Alımla karşılanan',
      autobuyLeftover: 'Yine de dondurulan',
      autobuyNote: 'Kendi NFT\'niz ve tazelenen limit yeterliyse Dondurulmuş Bakiye hiçbir zaman etkinleşmez.',
      forfeitTitle: '72 saatlik pencereyi kaçırırsınız',
      forfeitBody: 'Tutar, mevcut protokol parametreleri uyarınca yeniden dağıtılır: yapılandırılmış pay DA Likidite Havuzuna yönlendirilir, kalan kısım ise sponsor rotasını izler.',
      forfeitPool: 'DA Likidite Havuzuna',
      forfeitSponsor: 'Üst sponsora',
      forfeitCascade: 'Üst sponsorunuzun Protokol Ödül Limiti sıfırsa sponsor payı, yukarıdaki bir sonraki uygun sponsora aktarılır. Yukarıda uygun sponsor yoksa tutarın tamamı DA Likidite Havuzuna yönlendirilir.',
      footerNote: 'Dondurulmuş Bakiye, doğrudan kişisel olarak davet edilen kişinin nitelikli ilk satın alımı ve Otomatik Alımı için geçerlidir. Limitinizi aşan manuel tekrar satın almalar standart kayıp ödül ve sıkıştırma kurallarını izler.',
      noFreezeFooter: 'Dondurmanın tetiklendiğini görmek için davet edilen kişinin NFT seviyesini artırın veya kendiniz için daha düşük bir NFT seçin.',
      hoursN: '{n} sa',
      level: 'L',
    },
    zh: {
      title: '冻结余额模拟器',
      interactive: '交互式',
      yourNft: '您的 NFT',
      yourNftHint: '您当前的协议奖励上限',
      inviteeNft: '受邀人的首个 NFT',
      inviteeNftHint: '直接受邀人的首次购买',
      commission: '推荐人奖金',
      commissionHint: '的首次购买价格',
      remaining: '您剩余的协议奖励上限',
      remainingHint: '压缩前的可用空间',
      triggerOff: '未冻结——奖金在您的上限之内',
      triggerOffSub: '全额按标准 75 / 20 / 5 比例立即记入。',
      triggerOn: '冻结余额已触发',
      triggerOnSub: '超出上限的部分保留 72 小时，供您决定。',
      immediate: '立即记入',
      now: '即时',
      immediateHint: '在您的协议奖励上限之内 · 75 / 20 / 5 分配',
      frozen: '冻结 72 小时',
      frozenHint: '超出您协议奖励上限的部分',
      lostHeader: '记入部分适用标准分配',
      reg: '常规余额',
      acc: '累积余额',
      pool: 'DA 池',
      regHint: '可随时提现',
      accHint: '临时延至 180 天',
      poolHint: '铸造新的 DA',
      timerHeader: '72 小时窗口期',
      timerSub: '选择冻结的处理方式',
      tabUpgrade: '升级 NFT',
      tabAutobuy: '触发 Autobuy',
      tabForfeit: '错过截止时间',
      upgradeTitle: '您升级至更高等级',
      upgradeBody: '冻结资金将被释放，并按相同的 75 / 20 / 5 比例记入。释放的金额将从新 NFT 的协议奖励上限中扣除。',
      upgradeChoose: '选择要升级到的 NFT',
      upgradeReleased: '释放的冻结金额',
      upgradeNewLimit: '新 NFT 奖励上限',
      upgradeRemaining: '释放后剩余上限',
      upgradeImpossible: '请选择高于您当前 NFT 且不低于受邀人等级的 NFT，以便全额吸纳冻结金额。',
      autobuyTitle: 'Autobuy 先行触发并刷新您的上限',
      autobuyBody: 'Autobuy 会在奖金记入前为同等级 NFT 续约。刷新后的协议奖励上限先吸纳奖金；只有剩余部分（如有）才会进入冻结余额。',
      autobuyRefreshed: '刷新后的奖励上限',
      autobuyAbsorbed: '由 Autobuy 吸纳',
      autobuyLeftover: '仍进入冻结',
      autobuyNote: '如果您自己的 NFT 及刷新后的上限足够，冻结余额就不会激活。',
      forfeitTitle: '您错过了 72 小时窗口期',
      forfeitBody: '该金额将按当前协议参数重新分配：配置的份额路由至 DA 流动性池，其余部分按推荐人路由处理。',
      forfeitPool: '路由至 DA 流动性池',
      forfeitSponsor: '归上级推荐人',
      forfeitCascade: '如果您的上级推荐人的协议奖励上限为零，推荐人份额将向上级联至下一位符合条件的推荐人。如果上方没有符合条件的推荐人，全部金额将路由至 DA 流动性池。',
      footerNote: '冻结余额适用于直接受邀人的合格首次购买与 Autobuy。超出您上限的手动重复购买遵循标准的错失奖励与压缩规则。',
      noFreezeFooter: '提高受邀人的 NFT 等级，或为自己选择更低等级的 NFT，即可看到冻结触发。',
      hoursN: '{n} 小时',
      level: 'L',
    },
    es: {
      title: 'Simulador del Saldo Congelado',
      interactive: 'Interactivo',
      yourNft: 'Su NFT',
      yourNftHint: 'Su Límite de Recompensas del Protocolo actual',
      inviteeNft: 'Primer NFT del invitado',
      inviteeNftHint: 'Primera compra de un invitado personal directo',
      commission: 'Bono de Patrocinador',
      commissionHint: 'del precio del NFT (primera compra)',
      remaining: 'Su límite restante',
      remainingHint: 'Margen disponible antes de la compresión',
      triggerOff: 'Sin congelación — el bono cabe en su límite',
      triggerOffSub: 'El importe completo se acredita de inmediato según la división estándar 75\u00A0/\u00A020\u00A0/\u00A05.',
      triggerOn: 'Saldo Congelado activado',
      triggerOnSub: 'El excedente sobre su límite se retiene durante 72 horas mientras usted decide.',
      immediate: 'Acreditado de inmediato',
      now: 'AHORA',
      immediateHint: 'Dentro de su Límite de Recompensas del Protocolo · división 75\u00A0/\u00A020\u00A0/\u00A05',
      frozen: 'Congelado 72 h',
      frozenHint: 'Excedente sobre su Límite de Recompensas del Protocolo',
      lostHeader: 'División estándar aplicada a la parte acreditada',
      reg: 'Saldo Regular',
      acc: 'Saldo Acumulativo',
      pool: 'Pool de Liquidez del DA',
      regHint: 'Retirada en cualquier momento',
      accHint: 'Vida de 180 días (temporal)',
      poolHint: 'Nueva emisión de DA',
      timerHeader: 'Ventana de 72 horas',
      timerSub: 'Elija cómo se resuelve la congelación',
      tabUpgrade: 'Actualizar NFT',
      tabAutobuy: 'Autobuy actúa',
      tabForfeit: 'Plazo vencido',
      upgradeTitle: 'Usted actualiza a un nivel superior',
      upgradeBody: 'Los fondos congelados se liberan y se acreditan según la misma división 75\u00A0/\u00A020\u00A0/\u00A05. El importe liberado se descuenta del Límite de Recompensas del Protocolo del nuevo NFT.',
      upgradeChoose: 'Elija el NFT al que actualiza',
      upgradeReleased: 'Importe congelado liberado',
      upgradeNewLimit: 'Límite del nuevo NFT',
      upgradeRemaining: 'Límite tras la liberación',
      upgradeImpossible: 'Elija un nivel superior a su NFT actual, y como mínimo igual al del invitado, para absorber por completo el importe congelado.',
      autobuyTitle: 'Autobuy se activa primero y restablece su límite',
      autobuyBody: 'Autobuy renueva el NFT del mismo nivel antes de que se aplique el bono. El Límite de Recompensas del Protocolo restablecido absorbe primero el bono; solo el excedente, si lo hay, pasa al Saldo Congelado.',
      autobuyRefreshed: 'Límite restablecido',
      autobuyAbsorbed: 'Absorbido por Autobuy',
      autobuyLeftover: 'Pasa a la congelación',
      autobuyNote: 'Si su NFT y el límite restablecido son suficientes, el Saldo Congelado nunca se activa.',
      forfeitTitle: 'Usted no cumple el plazo de 72 horas',
      forfeitBody: 'El importe se redistribuye según los parámetros actuales del protocolo: la parte configurada se enruta al Pool de Liquidez del DA y el resto sigue la ruta del patrocinador.',
      forfeitPool: 'Al Pool de Liquidez del DA',
      forfeitSponsor: 'Al patrocinador superior',
      forfeitCascade: 'Si su patrocinador superior tiene un Límite de Recompensas del Protocolo igual a cero, la parte del patrocinador pasa en cascada al siguiente patrocinador elegible. Si ningún patrocinador superior es elegible, el importe completo se enruta al Pool de Liquidez del DA.',
      footerNote: 'El Saldo Congelado se aplica a la primera compra calificada y al Autobuy de un invitado personal directo. Las compras repetidas manuales por encima de su límite siguen las reglas estándar de recompensas perdidas y compresión.',
      noFreezeFooter: 'Aumente el nivel del NFT del invitado, o elija un NFT de menor nivel para usted, para ver cómo se activa la congelación.',
      hoursN: '{n} h',
      level: 'L',
    },
    de: {
      title: 'Frozen-Balance-Simulator',
      interactive: 'Interaktiv',
      yourNft: 'Ihr NFT',
      yourNftHint: 'Ihr aktuelles Protokoll-Belohnungslimit',
      inviteeNft: 'Erstes NFT des Eingeladenen',
      inviteeNftHint: 'Erstkauf eines direkt persönlich Eingeladenen',
      commission: 'Sponsor-Bonus',
      commissionHint: 'des NFT-Preises (Erstkauf)',
      remaining: 'Ihr verbleibendes Belohnungslimit',
      remainingHint: 'Verfügbarer Spielraum vor der Kompression',
      triggerOff: 'Kein Einfrieren — der Bonus passt in Ihr Limit',
      triggerOffSub: 'Der volle Betrag wird sofort gemäß der Standardaufteilung 75\u00A0/\u00A020\u00A0/\u00A05 gutgeschrieben.',
      triggerOn: 'Frozen Balance ausgelöst',
      triggerOnSub: 'Der Überschuss oberhalb Ihres Limits wird 72\u00A0Stunden lang zurückgehalten, während Sie entscheiden.',
      immediate: 'Sofort gutgeschrieben',
      now: 'JETZT',
      immediateHint: 'Innerhalb Ihres Protokoll-Belohnungslimits · Aufteilung 75\u00A0/\u00A020\u00A0/\u00A05',
      frozen: 'Für 72\u00A0h eingefroren',
      frozenHint: 'Überschuss oberhalb Ihres Protokoll-Belohnungslimits',
      lostHeader: 'Standardaufteilung des gutgeschriebenen Teils',
      reg: 'Reguläres Guthaben',
      acc: 'Akkumulatives Guthaben',
      pool: 'DA-Liquiditätspool',
      regHint: 'Jederzeit auszahlbar',
      accHint: 'Lebensdauer 180\u00A0Tage (vorübergehend)',
      poolHint: 'Ausgabe von neuem DA',
      timerHeader: '72-Stunden-Fenster',
      timerSub: 'Wählen Sie, wie das Einfrieren endet',
      tabUpgrade: 'NFT upgraden',
      tabAutobuy: 'Autobuy greift',
      tabForfeit: 'Frist verpasst',
      upgradeTitle: 'Sie upgraden auf eine höhere Stufe',
      upgradeBody: 'Die eingefrorenen Mittel werden freigegeben und nach derselben Aufteilung 75\u00A0/\u00A020\u00A0/\u00A05 gutgeschrieben. Der freigegebene Betrag verringert das Protokoll-Belohnungslimit des neuen NFTs.',
      upgradeChoose: 'NFT für das Upgrade wählen',
      upgradeReleased: 'Freigegebener Betrag',
      upgradeNewLimit: 'Limit des neuen NFTs',
      upgradeRemaining: 'Restlimit nach Freigabe',
      upgradeImpossible: 'Wählen Sie eine Stufe über Ihrem aktuellen NFT, mindestens aber die Stufe des Eingeladenen, damit der eingefrorene Betrag vollständig aufgenommen wird.',
      autobuyTitle: 'Autobuy greift zuerst und frischt Ihr Limit auf',
      autobuyBody: 'Autobuy erneuert das NFT derselben Stufe, bevor der Bonus angewendet wird. Das aufgefrischte Protokoll-Belohnungslimit nimmt den Bonus zuerst auf; nur ein gegebenenfalls verbleibender Überschuss geht in Frozen Balance.',
      autobuyRefreshed: 'Aufgefrischtes Limit',
      autobuyAbsorbed: 'Von Autobuy aufgenommen',
      autobuyLeftover: 'Wird dennoch eingefroren',
      autobuyNote: 'Reichen Ihr eigenes NFT und das aufgefrischte Limit aus, wird Frozen Balance nicht aktiviert.',
      forfeitTitle: 'Sie verpassen das 72-Stunden-Fenster',
      forfeitBody: 'Der Betrag wird gemäß den aktuellen Protokollparametern umverteilt: Der konfigurierte Anteil wird an den DA-Liquiditätspool weitergeleitet, und der Rest folgt der Sponsor-Route.',
      forfeitPool: 'An den DA-Liquiditätspool',
      forfeitSponsor: 'An den übergeordneten Sponsor',
      forfeitCascade: 'Hat Ihr übergeordneter Sponsor ein Protokoll-Belohnungslimit von null, geht der Sponsor-Anteil in einer Kaskade weiter nach oben an den nächsten berechtigten Sponsor. Ist kein übergeordneter Sponsor berechtigt, geht der volle Betrag an den DA-Liquiditätspool.',
      footerNote: 'Frozen Balance gilt für den qualifizierenden Erstkauf und das Autobuy eines direkt persönlich Eingeladenen. Manuelle Wiederholungskäufe oberhalb Ihres Limits folgen den Standardregeln für verpasste Belohnungen und Kompression.',
      noFreezeFooter: 'Erhöhen Sie die NFT-Stufe des Eingeladenen oder wählen Sie für sich ein kleineres NFT, um das Einfrieren auszulösen.',
      hoursN: '{n}\u00A0h',
      level: 'L',
    },
    pt: {
      title: 'Simulador do Saldo Congelado',
      interactive: 'Interativo',
      yourNft: 'Seu NFT',
      yourNftHint: 'Seu Limite de Recompensas do Protocolo atual',
      inviteeNft: 'Primeiro NFT do convidado',
      inviteeNftHint: 'Primeira compra do convidado pessoal direto',
      commission: 'Bônus de Patrocinador',
      commissionHint: 'do preço do NFT (primeira compra)',
      remaining: 'Seu Limite Restante',
      remainingHint: 'Espaço disponível antes da compressão',
      triggerOff: 'Sem congelamento — o bônus cabe no seu limite',
      triggerOffSub: 'O valor integral é creditado imediatamente de acordo com a divisão padrão 75\u00A0/\u00A020\u00A0/\u00A05.',
      triggerOn: 'Saldo Congelado acionado',
      triggerOnSub: 'O excedente acima do seu limite fica retido por 72 horas enquanto você decide.',
      immediate: 'Creditado imediatamente',
      now: 'AGORA',
      immediateHint: 'Dentro do seu Limite de Recompensas do Protocolo · divisão 75\u00A0/\u00A020\u00A0/\u00A05',
      frozen: 'Congelado por 72 h',
      frozenHint: 'Excedente acima do seu Limite de Recompensas do Protocolo',
      lostHeader: 'Divisão padrão aplicada à parte creditada',
      reg: 'Saldo Regular',
      acc: 'Saldo Acumulativo',
      pool: 'Pool de Liquidez do DA',
      regHint: 'Retirada a qualquer momento',
      accHint: 'Vida útil de 180 dias (temporária)',
      poolHint: 'Cunhagem de novo DA',
      timerHeader: 'Janela de 72 horas',
      timerSub: 'Escolha como o congelamento será resolvido',
      tabUpgrade: 'Upgrade do NFT',
      tabAutobuy: 'Autobuy ativo',
      tabForfeit: 'Prazo perdido',
      upgradeTitle: 'Você faz upgrade para um nível superior',
      upgradeBody: 'Os fundos congelados são liberados e creditados de acordo com a mesma divisão 75\u00A0/\u00A020\u00A0/\u00A05. O valor liberado é deduzido do Limite de Recompensas do Protocolo do novo NFT.',
      upgradeChoose: 'Escolha o NFT do upgrade',
      upgradeReleased: 'Valor congelado liberado',
      upgradeNewLimit: 'Limite do novo NFT',
      upgradeRemaining: 'Limite após a liberação',
      upgradeImpossible: 'Escolha um nível acima do seu NFT atual — e no mínimo o nível do convidado — para absorver todo o valor congelado.',
      autobuyTitle: 'O Autobuy é acionado primeiro e restabelece o seu limite',
      autobuyBody: 'O Autobuy renova o NFT do mesmo nível antes de o bônus ser aplicado. O Limite de Recompensas do Protocolo restabelecido absorve primeiro o bônus; somente o eventual excedente vai para o Saldo Congelado.',
      autobuyRefreshed: 'Limite restabelecido',
      autobuyAbsorbed: 'Absorvido pelo Autobuy',
      autobuyLeftover: 'Ainda vai para o congelamento',
      autobuyNote: 'Se o seu próprio NFT e o limite restabelecido forem suficientes, o Saldo Congelado nunca é ativado.',
      forfeitTitle: 'Você perde a janela de 72 horas',
      forfeitBody: 'O valor é redistribuído de acordo com os parâmetros atuais do protocolo: a parcela configurada é direcionada ao Pool de Liquidez do DA e o restante segue a rota do patrocinador.',
      forfeitPool: 'Para o Pool de Liquidez do DA',
      forfeitSponsor: 'Para o patrocinador acima',
      forfeitCascade: 'Se o patrocinador acima tiver o Limite de Recompensas do Protocolo zerado, a parcela do patrocinador passa em cascata para o próximo patrocinador elegível acima. Se nenhum patrocinador acima for elegível, o valor integral é direcionado ao Pool de Liquidez do DA.',
      footerNote: 'O Saldo Congelado se aplica à primeira compra qualificada e ao Autobuy de um convidado pessoal direto. Compras repetidas manuais acima do seu limite seguem as regras padrão de recompensas perdidas e de compressão.',
      noFreezeFooter: 'Aumente o nível do NFT do convidado — ou escolha um NFT menor para você — para ver o congelamento ser acionado.',
      hoursN: '{n} h',
      level: 'L',
    },
    hi: {
      title: 'फ्रोजन बैलेंस सिम्युलेटर',
      interactive: 'इंटरैक्टिव',
      yourNft: 'आपका NFT',
      yourNftHint: 'आपकी वर्तमान प्रोटोकॉल रिवॉर्ड सीमा',
      inviteeNft: 'आमंत्रित व्यक्ति का पहला NFT',
      inviteeNftHint: 'प्रत्यक्ष व्यक्तिगत आमंत्रित व्यक्ति की पहली खरीद',
      commission: 'Sponsor Bonus',
      commissionHint: 'NFT मूल्य पर (पहली खरीद)',
      remaining: 'आपकी शेष रिवॉर्ड सीमा',
      remainingHint: 'कम्प्रेशन से पहले उपलब्ध गुंजाइश',
      triggerOff: 'कोई फ्रीज़ नहीं — बोनस आपकी सीमा के भीतर है',
      triggerOffSub: 'पूरी राशि मानक 75 / 20 / 5 विभाजन के तहत तुरंत क्रेडिट की जाती है।',
      triggerOn: 'फ्रोजन बैलेंस ट्रिगर हुआ',
      triggerOnSub: 'आपकी सीमा से अधिक राशि 72 घंटे के लिए रोकी जाती है, ताकि आप निर्णय ले सकें।',
      immediate: 'तुरंत क्रेडिट',
      now: 'अभी',
      immediateHint: 'आपकी प्रोटोकॉल रिवॉर्ड सीमा के भीतर · 75 / 20 / 5 विभाजन',
      frozen: '72 घंटे के लिए फ्रीज़',
      frozenHint: 'आपकी प्रोटोकॉल रिवॉर्ड सीमा से अधिक राशि',
      lostHeader: 'क्रेडिट किए गए हिस्से पर लागू मानक विभाजन',
      reg: 'Regular Balance',
      acc: 'Accumulative Balance',
      pool: 'DA Liquidity Pool',
      regHint: 'किसी भी समय निकासी',
      accHint: '180 दिन का जीवनकाल (अस्थायी)',
      poolHint: 'नए DA की माइंटिंग',
      timerHeader: '72 घंटे की विंडो',
      timerSub: 'चुनें कि फ्रीज़ का समाधान कैसे हो',
      tabUpgrade: 'NFT अपग्रेड',
      tabAutobuy: 'Autobuy ट्रिगर',
      tabForfeit: 'समय-सीमा चूक गई',
      upgradeTitle: 'आप उच्च स्तर पर अपग्रेड करते हैं',
      upgradeBody: 'फ्रीज़ किए गए फंड रिलीज़ होकर उसी 75 / 20 / 5 विभाजन के तहत क्रेडिट किए जाते हैं। रिलीज़ की गई राशि नए NFT की प्रोटोकॉल रिवॉर्ड सीमा से घटाई जाती है।',
      upgradeChoose: 'वह NFT चुनें, जिस पर आप अपग्रेड करते हैं',
      upgradeReleased: 'रिलीज़ की गई फ्रोजन राशि',
      upgradeNewLimit: 'नए NFT की रिवॉर्ड सीमा',
      upgradeRemaining: 'रिलीज़ के बाद शेष सीमा',
      upgradeImpossible: 'फ्रोजन राशि को पूरी तरह समाहित करने के लिए अपने वर्तमान NFT से ऊँचा स्तर चुनें, जो आमंत्रित व्यक्ति के स्तर से कम न हो।',
      autobuyTitle: 'पहले Autobuy ट्रिगर होता है और आपकी सीमा को रिफ्रेश करता है',
      autobuyBody: 'बोनस लागू होने से पहले Autobuy उसी स्तर के NFT का नवीनीकरण करता है। रिफ्रेश की गई प्रोटोकॉल रिवॉर्ड सीमा पहले बोनस को समाहित करती है; केवल शेष राशि, यदि कोई हो, फ्रोजन बैलेंस में जाती है।',
      autobuyRefreshed: 'रिफ्रेश की गई रिवॉर्ड सीमा',
      autobuyAbsorbed: 'Autobuy द्वारा समाहित',
      autobuyLeftover: 'फिर भी फ्रीज़ में जाने वाली राशि',
      autobuyNote: 'यदि आपका NFT और उसकी रिफ्रेश की गई सीमा पर्याप्त हैं, तो फ्रोजन बैलेंस सक्रिय नहीं होता।',
      forfeitTitle: 'आप 72 घंटे की विंडो चूक जाते हैं',
      forfeitBody: 'राशि वर्तमान प्रोटोकॉल पैरामीटर के तहत पुनर्वितरित की जाती है: कॉन्फ़िगर किया गया हिस्सा DA Liquidity Pool में भेजा जाता है, और शेष राशि स्पॉन्सर रूट के अनुसार जाती है।',
      forfeitPool: 'DA Liquidity Pool में',
      forfeitSponsor: 'अपलाइन स्पॉन्सर को',
      forfeitCascade: 'यदि आपके अपलाइन स्पॉन्सर की प्रोटोकॉल रिवॉर्ड सीमा शून्य है, तो स्पॉन्सर का हिस्सा ऊपर की ओर अगले पात्र स्पॉन्सर को जाता है। यदि अपलाइन में कोई भी पात्र नहीं है, तो पूरी राशि DA Liquidity Pool में भेजी जाती है।',
      footerNote: 'फ्रोजन बैलेंस प्रत्यक्ष व्यक्तिगत आमंत्रित व्यक्ति की योग्य पहली खरीद और Autobuy पर लागू होता है। आपकी सीमा से अधिक मैन्युअल बार-बार की खरीद छूटे हुए रिवॉर्ड और कम्प्रेशन के मानक नियमों का पालन करती है।',
      noFreezeFooter: 'फ्रीज़ को ट्रिगर होते देखने के लिए आमंत्रित व्यक्ति का NFT स्तर बढ़ाएँ या अपने लिए छोटा NFT चुनें।',
      hoursN: '{n} घं',
      level: 'L',
    },
    it: {
      title: 'Simulatore del Saldo Congelato',
      interactive: 'Interattivo',
      yourNft: 'Il Suo NFT',
      yourNftHint: 'Il Suo attuale Limite di Ricompensa del Protocollo',
      inviteeNft: 'Primo NFT dell\'invitato',
      inviteeNftHint: 'Primo acquisto di un invitato personale diretto',
      commission: 'Sponsor Bonus',
      commissionHint: 'del prezzo dell\'NFT (primo acquisto)',
      remaining: 'Limite residuo',
      remainingHint: 'Margine disponibile prima della compressione',
      triggerOff: 'Nessun congelamento — il bonus rientra nel Suo limite',
      triggerOffSub: 'L\'intero importo viene accreditato subito secondo la suddivisione standard 75\u00A0/\u00A020\u00A0/\u00A05.',
      triggerOn: 'Saldo Congelato attivato',
      triggerOnSub: 'L\'eccedenza oltre il Suo limite viene trattenuta per 72 ore in attesa della Sua decisione.',
      immediate: 'Accreditato subito',
      now: 'ORA',
      immediateHint: 'Entro il Suo Limite di Ricompensa del Protocollo · suddivisione 75\u00A0/\u00A020\u00A0/\u00A05',
      frozen: 'Congelato per 72\u00A0h',
      frozenHint: 'Eccedenza oltre il Suo Limite di Ricompensa del Protocollo',
      lostHeader: 'Suddivisione standard applicata alla parte accreditata',
      reg: 'Saldo Regolare',
      acc: 'Saldo Cumulativo',
      pool: 'Pool di Liquidità DA',
      regHint: 'Prelievo in qualsiasi momento',
      accHint: 'Durata di 180 giorni (temporanea)',
      poolHint: 'Emissione di nuovo DA',
      timerHeader: 'Finestra di 72 ore',
      timerSub: 'Scelga come si risolve il congelamento',
      tabUpgrade: 'Upgrade dell\'NFT',
      tabAutobuy: 'Scatta l\'Autobuy',
      tabForfeit: 'Scadenza mancata',
      upgradeTitle: 'Upgrade a un livello superiore',
      upgradeBody: 'I fondi congelati vengono rilasciati e accreditati secondo la stessa suddivisione 75\u00A0/\u00A020\u00A0/\u00A05. L\'importo rilasciato viene detratto dal Limite di Ricompensa del Protocollo del nuovo NFT.',
      upgradeChoose: 'NFT per l\'upgrade',
      upgradeReleased: 'Importo congelato rilasciato',
      upgradeNewLimit: 'Limite del nuovo NFT',
      upgradeRemaining: 'Limite residuo dopo il rilascio',
      upgradeImpossible: 'Scelga un livello superiore al Suo NFT attuale, e almeno pari a quello dell\'invitato, per assorbire per intero l\'importo congelato.',
      autobuyTitle: 'L\'Autobuy scatta per primo e ripristina il Suo limite',
      autobuyBody: 'L\'Autobuy rinnova l\'NFT dello stesso livello prima che venga applicato il bonus. Il Limite di Ricompensa del Protocollo ripristinato assorbe per primo il bonus; solo l\'eventuale eccedenza confluisce nel Saldo Congelato.',
      autobuyRefreshed: 'Limite ripristinato',
      autobuyAbsorbed: 'Assorbito dall\'Autobuy',
      autobuyLeftover: 'Comunque congelato',
      autobuyNote: 'Se il limite ripristinato del Suo NFT è sufficiente, il Saldo Congelato non si attiva mai.',
      forfeitTitle: 'Scade la finestra di 72 ore',
      forfeitBody: 'L\'importo viene ridistribuito secondo i parametri attuali del protocollo: la quota configurata viene indirizzata al Pool di Liquidità DA e il resto segue il percorso sponsor.',
      forfeitPool: 'Al Pool di Liquidità DA',
      forfeitSponsor: 'Allo sponsor superiore',
      forfeitCascade: 'Se lo sponsor superiore ha un Limite di Ricompensa del Protocollo pari a zero, la quota sponsor risale a cascata fino al successivo sponsor idoneo. Se nessuno sponsor superiore è idoneo, l\'intero importo viene indirizzato al Pool di Liquidità DA.',
      footerNote: 'Il Saldo Congelato si applica al primo acquisto qualificante e all\'Autobuy di un invitato personale diretto. Gli acquisti ripetuti manuali oltre il Suo limite seguono le regole standard delle ricompense mancate e della compressione.',
      noFreezeFooter: 'Aumenti il livello dell\'NFT dell\'invitato, oppure scelga per sé un NFT di livello inferiore, per vedere attivarsi il congelamento.',
      hoursN: '{n}\u00A0h',
      level: 'L',
    },
    fr: {
      title: 'Simulateur du Solde Gelé',
      interactive: 'Interactif',
      yourNft: 'Votre NFT',
      yourNftHint: 'Votre Plafond de Récompenses du Protocole actuel',
      inviteeNft: 'Premier NFT de l\'invité',
      inviteeNftHint: 'Premier achat d\'un invité personnel direct',
      commission: 'Bonus de Sponsor',
      commissionHint: 'du prix du NFT (premier achat)',
      remaining: 'Votre plafond restant',
      remainingHint: 'Marge disponible avant la compression',
      triggerOff: 'Aucun gel — le bonus tient dans votre plafond',
      triggerOffSub: 'Le montant intégral est crédité immédiatement selon la répartition standard 75 / 20 / 5.',
      triggerOn: 'Solde Gelé déclenché',
      triggerOnSub: 'L\'excédent au-delà de votre plafond est retenu pendant 72 heures, le temps de votre décision.',
      immediate: 'Crédité immédiatement',
      now: 'IMMÉDIAT',
      immediateHint: 'Dans votre Plafond de Récompenses du Protocole · répartition 75 / 20 / 5',
      frozen: 'Gelé pendant 72\u00A0h',
      frozenHint: 'Excédent au-delà de votre Plafond de Récompenses du Protocole',
      lostHeader: 'Répartition standard de la part créditée',
      reg: 'Solde Régulier',
      acc: 'Solde Cumulatif',
      pool: 'Pool de Liquidité du DA',
      regHint: 'Retrait à tout moment',
      accHint: 'Durée de vie de 180 jours (temporaire)',
      poolHint: 'Émission de nouveau DA',
      timerHeader: 'Fenêtre de 72 heures',
      timerSub: 'Choisissez l\'issue du gel',
      tabUpgrade: 'Mise à niveau',
      tabAutobuy: 'Autobuy activé',
      tabForfeit: 'Délai manqué',
      upgradeTitle: 'Vous passez à un niveau supérieur',
      upgradeBody: 'Les fonds gelés sont libérés et crédités selon la même répartition 75 / 20 / 5. Le montant libéré est déduit du Plafond de Récompenses du Protocole du nouveau NFT.',
      upgradeChoose: 'Choisissez le NFT visé par la mise à niveau',
      upgradeReleased: 'Montant gelé libéré',
      upgradeNewLimit: 'Plafond du nouveau NFT',
      upgradeRemaining: 'Plafond après libération',
      upgradeImpossible: 'Choisissez un niveau supérieur à votre NFT actuel — et au moins égal à celui de l\'invité — pour absorber intégralement le montant gelé.',
      autobuyTitle: 'L\'Autobuy s\'active d\'abord et rafraîchit votre plafond',
      autobuyBody: 'L\'Autobuy renouvelle le NFT de même niveau avant l\'application du bonus. Le Plafond de Récompenses du Protocole rafraîchi absorbe d\'abord le bonus\u00A0; seul l\'éventuel excédent est placé dans le Solde Gelé.',
      autobuyRefreshed: 'Plafond rafraîchi',
      autobuyAbsorbed: 'Absorbé par l\'Autobuy',
      autobuyLeftover: 'Placé malgré tout en gel',
      autobuyNote: 'Si votre propre NFT et le plafond rafraîchi suffisent, le Solde Gelé ne s\'active jamais.',
      forfeitTitle: 'Vous manquez la fenêtre de 72 heures',
      forfeitBody: 'Le montant est redistribué selon les paramètres actuels du protocole\u00A0: la part configurée est acheminée vers le Pool de Liquidité du DA et le reste suit l\'acheminement vers le sponsor.',
      forfeitPool: 'Vers le Pool de Liquidité du DA',
      forfeitSponsor: 'Vers le sponsor en amont',
      forfeitCascade: 'Si votre sponsor en amont a un Plafond de Récompenses du Protocole nul, la part du sponsor remonte en cascade jusqu\'au sponsor éligible suivant. Si aucun sponsor en amont n\'est éligible, le montant intégral est acheminé vers le Pool de Liquidité du DA.',
      footerNote: 'Le Solde Gelé s\'applique au premier achat qualifiant et à l\'Autobuy d\'un invité personnel direct. Les achats répétés manuels au-delà de votre plafond suivent les règles standard de récompense manquée et de compression.',
      noFreezeFooter: 'Augmentez le niveau du NFT de l\'invité — ou choisissez un NFT plus modeste pour vous-même — pour voir le gel se déclencher.',
      hoursN: '{n}\u00A0h',
      level: 'L',
    },
    ar: {
      title: 'محاكي الرصيد المجمَّد',
      interactive: 'تفاعلي',
      yourNft: '\u202BNFT الخاص بك\u202C',
      yourNftHint: 'سقف مكافآت البروتوكول الحالي لديك\u200F',
      inviteeNft: '\u202Bأول NFT للمدعوّ\u202C',
      inviteeNftHint: 'أول عملية شراء يُجريها مدعوّ شخصي مباشر',
      commission: 'مكافأة الراعي',
      commissionHint: '\u202Bمن سعر NFT (الشراء الأول)\u202C',
      remaining: 'سقف المكافآت المتبقي لديك',
      remainingHint: 'المتسع المتاح قبل الضغط',
      triggerOff: 'لا تجميد — المكافأة ضمن سقفك',
      triggerOffSub: 'يُضاف المبلغ كاملاً فوراً وفق التقسيم القياسي 75\u00A0/\u00A020\u00A0/\u00A05.\u200F',
      triggerOn: 'فُعِّل الرصيد المجمَّد',
      triggerOnSub: 'يُحتجَز المبلغ الزائد على سقفك لمدة 72 ساعة ريثما تتخذ قرارك.\u200F',
      immediate: 'يُضاف فوراً',
      now: 'الآن',
      immediateHint: 'ضمن سقف مكافآت البروتوكول لديك · تقسيم 75\u00A0/\u00A020\u00A0/\u00A05\u200F',
      frozen: 'مجمَّد لمدة 72 ساعة',
      frozenHint: 'المبلغ الزائد على سقف مكافآت البروتوكول لديك',
      lostHeader: 'التقسيم القياسي المطبَّق على الجزء المضاف',
      reg: 'الرصيد العادي',
      acc: 'الرصيد التراكمي',
      pool: '\u202Bمجمع سيولة DA\u202C',
      regHint: 'للسحب في أي وقت',
      accHint: 'عمره 180 يوماً (مؤقتاً)\u200F',
      poolHint: '\u202Bسكّ DA جديد\u202C',
      timerHeader: 'نافذة الـ 72 ساعة',
      timerSub: 'يُرجى اختيار طريقة تسوية التجميد',
      tabUpgrade: '\u202Bترقية NFT\u202C',
      tabAutobuy: '\u202Bتفعيل Autobuy\u202C',
      tabForfeit: 'فوات المهلة',
      upgradeTitle: 'الترقية إلى مستوى أعلى',
      upgradeBody: '\u202Bتُحرَّر الأموال المجمَّدة وتُضاف وفق التقسيم نفسه 75\u00A0/\u00A020\u00A0/\u00A05. ويُخصَم المبلغ المحرَّر من سقف مكافآت البروتوكول لـ NFT الجديد.\u202C',
      upgradeChoose: '\u202Bيُرجى اختيار NFT الذي تتم الترقية إليه\u202C',
      upgradeReleased: 'المبلغ المحرَّر من التجميد',
      upgradeNewLimit: '\u202Bسقف مكافآت NFT الجديد\u202C',
      upgradeRemaining: 'السقف المتبقي بعد التحرير',
      upgradeImpossible: '\u202Bيُرجى اختيار مستوى أعلى من NFT الحالي — لا يقل عن مستوى المدعوّ — كي يستوعب السقف المبلغ المجمَّد كاملاً.\u202C',
      autobuyTitle: '\u202Bيُفعَّل Autobuy أولاً ويجدّد سقفك\u202C',
      autobuyBody: '\u202Bيجدّد Autobuy رمز NFT من المستوى نفسه قبل احتساب المكافأة. ويستوعب سقف مكافآت البروتوكول المجدَّد المكافأة أولاً؛ ولا يُوضَع في الرصيد المجمَّد إلا ما قد يتبقى منها.\u202C',
      autobuyRefreshed: 'سقف المكافآت المجدَّد',
      autobuyAbsorbed: '\u202Bما استوعبه Autobuy\u202C',
      autobuyLeftover: 'ما يتبقى للتجميد',
      autobuyNote: '\u202Bإذا كان السقف المجدَّد لـ NFT الخاص بك كافياً، فلا يُفعَّل الرصيد المجمَّد.\u202C',
      forfeitTitle: 'فوات نافذة الـ 72 ساعة',
      forfeitBody: '\u202Bيُعاد توزيع المبلغ وفق معايير البروتوكول الحالية: تُوجَّه الحصة المحدَّدة في الإعدادات إلى مجمع سيولة DA، ويخضع الباقي لمسار الراعي.\u202C',
      forfeitPool: '\u202Bإلى مجمع سيولة DA\u202C',
      forfeitSponsor: 'إلى الراعي الأعلى في الشبكة',
      forfeitCascade: '\u202Bإذا كان سقف مكافآت البروتوكول لدى راعيك الأعلى في الشبكة صفراً، تنتقل حصة الراعي صعوداً إلى الراعي المؤهَّل التالي. وإذا لم يوجد راعٍ مؤهَّل في الأعلى، يُوجَّه المبلغ كاملاً إلى مجمع سيولة DA.\u202C',
      footerNote: '\u202Bيشمل الرصيد المجمَّد الشراء الأول المستوفي للشروط وAutobuy لدى مدعوّ شخصي مباشر. أما عمليات الشراء المتكررة اليدوية التي تتجاوز سقفك فتخضع للقواعد القياسية للمكافآت المفقودة والضغط.\u202C',
      noFreezeFooter: '\u202Bيُرجى رفع مستوى NFT للمدعوّ — أو اختيار NFT أصغر لنفسك — لرؤية تفعيل التجميد.\u202C',
      hoursN: '\u200F{n} س',
      level: 'L',
    },
    id: {
      title: 'Simulator Frozen Balance',
      interactive: 'Interaktif',
      yourNft: 'NFT Anda',
      yourNftHint: 'Batas Imbalan Protokol Anda saat ini',
      inviteeNft: 'NFT Pertama Undangan',
      inviteeNftHint: 'Pembelian pertama oleh undangan langsung pribadi',
      commission: 'Sponsor Bonus',
      commissionHint: 'dari harga NFT (pembelian pertama)',
      remaining: 'Sisa Batas Imbalan Anda',
      remainingHint: 'Ruang yang tersedia sebelum kompresi',
      triggerOff: 'Tidak ada pembekuan — bonus masih dalam batas Anda',
      triggerOffSub: 'Seluruh jumlah langsung dikreditkan berdasarkan pembagian standar 75\u00A0/\u00A020\u00A0/\u00A05.',
      triggerOn: 'Frozen Balance terpicu',
      triggerOnSub: 'Kelebihan di atas batas Anda ditahan selama 72 jam selagi Anda mengambil keputusan.',
      immediate: 'Langsung dikreditkan',
      now: 'SEKARANG',
      immediateHint: 'Dalam Batas Imbalan Protokol Anda · pembagian 75\u00A0/\u00A020\u00A0/\u00A05',
      frozen: 'Dibekukan selama 72 jam',
      frozenHint: 'Kelebihan di atas Batas Imbalan Protokol Anda',
      lostHeader: 'Pembagian standar untuk bagian yang dikreditkan',
      reg: 'Saldo Reguler',
      acc: 'Saldo Akumulatif',
      pool: 'DA Liquidity Pool',
      regHint: 'Dapat ditarik kapan saja',
      accHint: 'Masa hidup 180 hari (sementara)',
      poolHint: 'Pencetakan DA baru',
      timerHeader: 'Jendela 72 jam',
      timerSub: 'Pilih cara pembekuan diselesaikan',
      tabUpgrade: 'Tingkatkan NFT',
      tabAutobuy: 'Autobuy aktif',
      tabForfeit: 'Tenggat terlewat',
      upgradeTitle: 'Anda meningkatkan NFT ke tingkatan yang lebih tinggi',
      upgradeBody: 'Dana yang dibekukan dilepaskan dan dikreditkan berdasarkan pembagian 75\u00A0/\u00A020\u00A0/\u00A05 yang sama. Jumlah yang dilepaskan dipotong dari Batas Imbalan Protokol NFT yang baru.',
      upgradeChoose: 'Pilih NFT tujuan peningkatan',
      upgradeReleased: 'Jumlah yang dilepaskan',
      upgradeNewLimit: 'Batas Imbalan NFT baru',
      upgradeRemaining: 'Sisa batas setelah pelepasan',
      upgradeImpossible: 'Pilih tingkatan di atas NFT Anda saat ini — dan setidaknya setara dengan tingkatan undangan — agar seluruh jumlah yang dibekukan dapat tertampung.',
      autobuyTitle: 'Autobuy aktif lebih dahulu dan memperbarui batas Anda',
      autobuyBody: 'Autobuy memperpanjang NFT dengan level yang sama sebelum bonus diterapkan. Batas Imbalan Protokol yang diperbarui menampung bonus terlebih dahulu; hanya sisanya, jika ada, yang masuk ke Frozen Balance.',
      autobuyRefreshed: 'Batas Imbalan yang diperbarui',
      autobuyAbsorbed: 'Ditampung oleh Autobuy',
      autobuyLeftover: 'Tetap dibekukan',
      autobuyNote: 'Jika NFT Anda dan batas yang diperbarui mencukupi, Frozen Balance tidak akan aktif.',
      forfeitTitle: 'Anda melewatkan jendela 72 jam',
      forfeitBody: 'Jumlah tersebut diredistribusikan berdasarkan parameter protokol yang berlaku saat ini: bagian yang dikonfigurasi dialihkan ke DA Liquidity Pool, dan sisanya mengikuti rute sponsor.',
      forfeitPool: 'Ke DA Liquidity Pool',
      forfeitSponsor: 'Ke sponsor upline',
      forfeitCascade: 'Jika Batas Imbalan Protokol sponsor upline Anda bernilai nol, bagian sponsor berpindah ke atas secara kaskade kepada sponsor berikutnya yang memenuhi syarat. Jika tidak ada upline yang memenuhi syarat, seluruh jumlah dialihkan ke DA Liquidity Pool.',
      footerNote: 'Frozen Balance berlaku untuk pembelian pertama dan Autobuy yang memenuhi kualifikasi oleh undangan langsung pribadi. Pembelian berulang secara manual di atas batas Anda mengikuti aturan standar mengenai imbalan yang terlewat dan kompresi.',
      noFreezeFooter: 'Naikkan level NFT undangan — atau pilih NFT yang lebih kecil untuk Anda sendiri — untuk melihat pembekuan terpicu.',
      hoursN: '{n} j',
      level: 'L',
    },
    ja: {
      title: '凍結バランスの試算',
      interactive: 'インタラクティブ',
      yourNft: 'あなたのNFT',
      yourNftHint: '現在のプロトコル報酬上限',
      inviteeNft: '被招待者の初回NFT',
      inviteeNftHint: '直接の被招待者による初回購入',
      commission: 'スポンサーボーナス',
      commissionHint: '初回購入額比',
      remaining: '残りの報酬上限',
      remainingHint: '圧縮までの余裕',
      triggerOff: '凍結なし — ボーナスは上限の範囲内に収まります',
      triggerOffSub: '標準の75 / 20 / 5の分割に基づき、全額が直ちに計上されます。',
      triggerOn: '凍結バランスがトリガーされました',
      triggerOnSub: '上限を超える超過分は、対応を決めるまで72時間保留されます。',
      immediate: '直ちに計上',
      now: '即時',
      immediateHint: 'プロトコル報酬上限の範囲内 · 75 / 20 / 5の分割',
      frozen: '72時間の凍結',
      frozenHint: 'プロトコル報酬上限を超える超過分',
      lostHeader: '計上分に適用される標準の分割',
      reg: '通常バランス',
      acc: 'アキュムレーティブバランス',
      pool: 'DA流動性プール',
      regHint: 'いつでも出金可能',
      accHint: 'ライフタイム180日（暫定）',
      poolHint: '新規DAの発行',
      timerHeader: '72時間のウィンドウ',
      timerSub: '凍結の解決方法を選択してください',
      tabUpgrade: 'アップグレード',
      tabAutobuy: 'Autobuyが作動',
      tabForfeit: '期限を過ぎた場合',
      upgradeTitle: '上位ティアにアップグレードする場合',
      upgradeBody: '凍結された資金は解放され、同じ75 / 20 / 5の分割で計上されます。解放された金額は、新しいNFTのプロトコル報酬上限から差し引かれます。',
      upgradeChoose: 'アップグレード先のNFTを選択',
      upgradeReleased: '解放された凍結額',
      upgradeNewLimit: '新しいNFTの報酬上限',
      upgradeRemaining: '解放後の残りの上限',
      upgradeImpossible: '凍結額を全額吸収するには、現在のNFTより上位で、かつ被招待者のティア以上のティアを選択してください。',
      autobuyTitle: 'Autobuyが先に作動し、上限をリフレッシュします',
      autobuyBody: 'Autobuyは、ボーナスが適用される前に同じレベルのNFTを更新します。リフレッシュされたプロトコル報酬上限がまずボーナスを吸収し、残った超過分がある場合、その分のみが凍結バランスに置かれます。',
      autobuyRefreshed: 'リフレッシュ後の報酬上限',
      autobuyAbsorbed: 'Autobuyで吸収',
      autobuyLeftover: '凍結に回る額',
      autobuyNote: 'あなたのNFTのリフレッシュされた上限で足りる場合、凍結バランスは有効になりません。',
      forfeitTitle: '72時間のウィンドウを過ぎた場合',
      forfeitBody: 'その金額は現行のプロトコルパラメータに基づいて再分配されます：設定された割合はDA流動性プールへ振り向けられ、残りはスポンサールートに従います。',
      forfeitPool: 'DA流動性プールへ',
      forfeitSponsor: '上位のスポンサーへ',
      forfeitCascade: '上位のスポンサーのプロトコル報酬上限がゼロの場合、スポンサー分は次の適格なスポンサーへと順に上位へ引き継がれます。適格な上位のスポンサーがいない場合は、全額がDA流動性プールへ振り向けられます。',
      footerNote: '凍結バランスは、直接の被招待者による対象の初回購入とAutobuyに適用されます。上限を超える手動の再購入は、標準の逸失報酬と圧縮のルールに従います。',
      noFreezeFooter: '被招待者のNFTレベルを上げるか、あなたのNFTに下位のティアを選ぶと、凍結がトリガーされる様子を確認できます。',
      hoursN: '{n}時間',
      level: 'L',
    },
    vi: {
      title: 'Mô Phỏng Số Dư Đóng Băng',
      interactive: 'Tương\u00A0tác',
      yourNft: 'NFT của bạn',
      yourNftHint: 'Giới Hạn Phần Thưởng Giao Thức hiện tại của bạn',
      inviteeNft: 'NFT của người được mời',
      inviteeNftHint: 'Giao dịch mua đầu tiên của người được mời trực tiếp',
      commission: 'Sponsor Bonus',
      commissionHint: 'giá NFT (mua lần đầu)',
      remaining: 'Giới hạn còn lại',
      remainingHint: 'Dư địa còn lại trước khi nén',
      triggerOff: 'Không đóng băng — khoản thưởng nằm trong giới hạn của bạn',
      triggerOffSub: 'Toàn bộ số tiền được ghi có ngay theo tỷ lệ phân chia tiêu chuẩn 75 / 20 / 5.',
      triggerOn: 'Số Dư Đóng Băng được kích hoạt',
      triggerOnSub: 'Phần vượt quá giới hạn của bạn được giữ trong 72 giờ để bạn quyết định.',
      immediate: 'Ghi có ngay',
      now: 'NGAY',
      immediateHint: 'Trong Giới Hạn Phần Thưởng Giao Thức của bạn · phân chia 75 / 20 / 5',
      frozen: 'Đóng băng 72 giờ',
      frozenHint: 'Phần vượt quá Giới Hạn Phần Thưởng Giao Thức của bạn',
      lostHeader: 'Tỷ lệ phân chia tiêu chuẩn cho phần được ghi có',
      reg: 'Số Dư Thông Thường',
      acc: 'Số Dư Tích Lũy',
      pool: 'Pool Thanh khoản DA',
      regHint: 'Rút bất kỳ lúc nào',
      accHint: 'Vòng đời 180 ngày (tạm thời)',
      poolHint: 'Tạo DA mới',
      timerHeader: 'Cửa sổ 72 giờ',
      timerSub: 'Chọn cách giải quyết khoản đóng băng',
      tabUpgrade: 'Nâng cấp NFT',
      tabAutobuy: 'Autobuy gia hạn',
      tabForfeit: 'Bỏ lỡ hạn chót',
      upgradeTitle: 'Bạn nâng cấp lên cấp cao hơn',
      upgradeBody: 'Số tiền bị đóng băng được giải phóng và ghi có theo cùng tỷ lệ phân chia 75 / 20 / 5. Số tiền được giải phóng được khấu trừ vào Giới Hạn Phần Thưởng Giao Thức của NFT mới.',
      upgradeChoose: 'Chọn NFT bạn nâng cấp lên',
      upgradeReleased: 'Số tiền được giải phóng',
      upgradeNewLimit: 'Giới hạn của NFT mới',
      upgradeRemaining: 'Giới hạn còn lại sau giải phóng',
      upgradeImpossible: 'Hãy chọn cấp cao hơn NFT hiện tại của bạn, và không thấp hơn cấp của người được mời, để hấp thụ toàn bộ số tiền bị đóng băng.',
      autobuyTitle: 'Autobuy kích hoạt trước và làm mới giới hạn của bạn',
      autobuyBody: 'Autobuy gia hạn NFT cùng cấp trước khi khoản thưởng được áp dụng. Giới Hạn Phần Thưởng Giao Thức đã được làm mới sẽ hấp thụ khoản thưởng trước; chỉ phần còn lại (nếu có) mới được đưa vào Số Dư Đóng Băng.',
      autobuyRefreshed: 'Giới hạn đã làm mới',
      autobuyAbsorbed: 'Được Autobuy hấp thụ',
      autobuyLeftover: 'Vẫn bị đóng băng',
      autobuyNote: 'Nếu NFT của bạn và giới hạn đã làm mới đủ lớn, Số Dư Đóng Băng sẽ không kích hoạt.',
      forfeitTitle: 'Bạn bỏ lỡ cửa sổ 72 giờ',
      forfeitBody: 'Số tiền được phân phối lại theo tham số giao thức hiện hành: tỷ lệ theo cấu hình được chuyển vào Pool Thanh khoản DA và phần còn lại đi theo tuyến người tài trợ.',
      forfeitPool: 'Vào Pool Thanh khoản DA',
      forfeitSponsor: 'Cho người tài trợ tuyến trên',
      forfeitCascade: 'Nếu Giới Hạn Phần Thưởng Giao Thức của người tài trợ tuyến trên bằng không, phần dành cho người tài trợ được chuyển tiếp lên người tài trợ đủ điều kiện kế tiếp. Nếu không có người tuyến trên nào đủ điều kiện, toàn bộ số tiền được chuyển vào Pool Thanh khoản DA.',
      footerNote: 'Số Dư Đóng Băng áp dụng cho giao dịch mua đầu tiên hợp lệ và Autobuy của người được mời trực tiếp. Các giao dịch mua lặp lại thủ công vượt quá giới hạn của bạn tuân theo các quy tắc tiêu chuẩn về phần thưởng bị bỏ lỡ và nén.',
      noFreezeFooter: 'Hãy tăng cấp NFT của người được mời hoặc chọn NFT cấp thấp hơn cho bạn để xem cơ chế đóng băng được kích hoạt.',
      hoursN: '{n} giờ',
      level: 'L',
    },
    uk: {
      title: 'Симулятор Frozen\u00A0Balance',
      interactive: 'Інтерактив',
      yourNft: 'Ваш NFT',
      yourNftHint: 'Ваш поточний Ліміт винагород протоколу',
      inviteeNft: 'Перший NFT запрошеного',
      inviteeNftHint: 'Перша купівля прямим особисто запрошеним',
      commission: 'Спонсорський бонус',
      commissionHint: 'від ціни NFT (перша купівля)',
      remaining: 'Ваш залишковий Ліміт винагород',
      remainingHint: 'Запас до компресії',
      triggerOff: 'Без заморожування — бонус уміщується у ваш Ліміт',
      triggerOffSub: 'Уся сума зараховується одразу за стандартним розподілом 75 / 20 / 5.',
      triggerOn: 'Frozen Balance активовано',
      triggerOnSub: 'Надлишок понад Ліміт утримується 72 години, поки ви ухвалюєте рішення.',
      immediate: 'Зараховується одразу',
      now: 'ЗАРАЗ',
      immediateHint: 'У межах вашого Ліміту · розподіл 75 / 20 / 5',
      frozen: 'Заморожено на 72 год',
      frozenHint: 'Надлишок понад ваш Ліміт',
      lostHeader: 'Стандартний розподіл зарахованої частини',
      reg: 'Звичайний Баланс',
      acc: 'Накопичу\u00ADвальний Баланс',
      pool: 'Пул Ліквідності DA',
      regHint: 'Виведення завжди доступне',
      accHint: 'Строк дії 180 днів (тимчасово)',
      poolHint: 'Випуск нового DA',
      timerHeader: '72-годинне вікно',
      timerSub: 'Оберіть, чим завершиться заморожування',
      tabUpgrade: 'Апгрейд NFT',
      tabAutobuy: 'Спрацьовує Autobuy',
      tabForfeit: 'Строк пропущено',
      upgradeTitle: 'Ви робите апгрейд до вищого рівня',
      upgradeBody: 'Заморожені кошти вивільняються й зараховуються за тим самим розподілом 75 / 20 / 5. Вивільнена сума зменшує Ліміт винагород протоколу нового NFT.',
      upgradeChoose: 'Оберіть NFT для апгрейду',
      upgradeReleased: 'Вивільнена сума',
      upgradeNewLimit: 'Ліміт нового NFT',
      upgradeRemaining: 'Залишок Ліміту після вивільнення',
      upgradeImpossible: 'Оберіть рівень, вищий за ваш поточний NFT і не нижчий за рівень запрошеного, щоб Ліміт умістив усю заморожену суму.',
      autobuyTitle: 'Спершу спрацьовує Autobuy і оновлює Ліміт',
      autobuyBody: 'Autobuy поновлює NFT того самого рівня до зарахування бонусу. Оновлений Ліміт винагород протоколу спершу поглинає бонус; у Frozen Balance потрапляє лише залишок, якщо він є.',
      autobuyRefreshed: 'Оновлений Ліміт винагород',
      autobuyAbsorbed: 'Поглинуто через Autobuy',
      autobuyLeftover: 'Іде в заморожування',
      autobuyNote: 'Якщо оновленого Ліміту вашого NFT достатньо, Frozen Balance не активується.',
      forfeitTitle: 'Ви пропускаєте 72-годинне вікно',
      forfeitBody: 'Сума перерозподіляється за поточними параметрами протоколу: налаштована частка спрямовується до Пулу Ліквідності DA, а решта — за спонсорським маршрутом.',
      forfeitPool: 'До Пулу Ліквідності DA',
      forfeitSponsor: 'Спонсору вище в структурі',
      forfeitCascade: 'Якщо Ліміт винагород протоколу спонсора, який стоїть вище в структурі, дорівнює нулю, спонсорська частка переходить далі вгору до наступного придатного спонсора. Якщо придатних спонсорів вище немає, уся сума спрямовується до Пулу Ліквідності DA.',
      footerNote: 'Frozen Balance застосовується до кваліфікованої першої купівлі та Autobuy прямого особисто запрошеного. Ручні повторні купівлі понад ваш Ліміт підпадають під стандартні правила пропущених винагород і компресії.',
      noFreezeFooter: 'Підвищте рівень NFT запрошеного або оберіть для себе менший NFT, щоб побачити спрацювання заморожування.',
      hoursN: '{n} год',
      level: 'L',
    },
  };
  /* i18n:end */
  var L = STR[lang] ? lang : 'en';
  var T = STR[L];
  var fill = function(s, n) { return s.split('{n}').join(n); };

  var NFT_DATA = [
    { level: 1,  name: 'GENESIS',  price: 28,    limit: 75,    tier: 'Basic'   },
    { level: 2,  name: 'ADVANCE',  price: 55,    limit: 160,   tier: 'Basic'   },
    { level: 3,  name: 'ASCEND',   price: 140,   limit: 375,   tier: 'Basic'   },
    { level: 4,  name: 'ECLIPSE',  price: 275,   limit: 650,   tier: 'Basic'   },
    { level: 5,  name: 'HYDRO',    price: 550,   limit: 1400,  tier: 'Premium' },
    { level: 6,  name: 'QUANTUM',  price: 1100,  limit: 2700,  tier: 'Premium' },
    { level: 7,  name: 'PULSE',    price: 2200,  limit: 5800,  tier: 'Premium' },
    { level: 8,  name: 'AURORA',   price: 5500,  limit: 12800, tier: 'Premium' },
    { level: 9,  name: 'FLAME',    price: 11000, limit: 28000, tier: 'Elite'   },
    { level: 10, name: 'INFINITY', price: 24000, limit: 70000, tier: 'Elite'   },
  ];

  // Thousands and decimal separators and the percent sign as on each language's pages.
  var SEP = { ru: '\u00A0', uk: '\u00A0', fr: '\u00A0', tr: '.', es: '.', de: '.', pt: '.', it: '.', id: '.', vi: '.' }[L] || ',';
  var DEC = SEP === ',' ? '.' : ',';
  var PCT = { tr: '%{n}', de: '{n}\u00A0%', fr: '{n}\u00A0%' }[L] || '{n}%';
  var fmtUsd = function(n) {
    var parts = Math.abs(n).toFixed(Math.abs(n) >= 1000 ? 0 : 2).split('.');
    return '$' + parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, SEP) + (parts[1] ? DEC + parts[1] : '');
  };

  var [yourLevel, setYourLevel] = useState(2);
  var [inviteeLevel, setInviteeLevel] = useState(7);
  var [scenario, setScenario] = useState('upgrade');
  var [upgradeLevel, setUpgradeLevel] = useState(7);
  var [hour, setHour] = useState(18);
  var hourRef = useRef(null);

  // Animate the 72h clock
  useEffect(function() {
    if (hourRef.current) clearInterval(hourRef.current);
    hourRef.current = setInterval(function() {
      setHour(function(h) {
        var next = h + 1;
        if (next > 72) return 0;
        return next;
      });
    }, 700);
    return function() { if (hourRef.current) clearInterval(hourRef.current); };
  }, []);

  // Current on-chain values (Phase 2, activated by DAO vote in June 2026)
  var SPONSOR_FIRST_PURCHASE = 0.20;
  var FORFEIT_POOL_SHARE = 0.80;
  var FORFEIT_SPONSOR_SHARE = 0.20;
  var pct = function(x) { return Math.round(x * 100) + '%'; };
  var pctText = function(x) { return fill(PCT, Math.round(x * 100)); };

  var yourNft = NFT_DATA[yourLevel - 1];
  var inviteeNft = NFT_DATA[inviteeLevel - 1];
  var commission = inviteeNft.price * SPONSOR_FIRST_PURCHASE;
  var inLimit = Math.min(commission, yourNft.limit);
  var frozen = Math.max(commission - yourNft.limit, 0);
  var triggered = frozen > 0;

  // Keep upgrade selection useful
  useEffect(function() {
    if (upgradeLevel <= yourLevel) {
      var next = Math.min(yourLevel + 1, 10);
      setUpgradeLevel(next);
    }
  }, [yourLevel]);

  var upgradeNft = NFT_DATA[upgradeLevel - 1];
  var upgradeRemaining = Math.max(upgradeNft.limit - frozen, 0);
  var upgradeCovers = upgradeNft.limit >= frozen && upgradeLevel > yourLevel;

  // Autobuy: refresh = same-level limit; absorbs commission first
  var refreshedLimit = yourNft.limit;
  var autobuyAbsorbed = Math.min(commission, refreshedLimit);
  var autobuyLeftover = Math.max(commission - refreshedLimit, 0);

  // Forfeit
  var forfeitPool = frozen * FORFEIT_POOL_SHARE;
  var forfeitSponsor = frozen * FORFEIT_SPONSOR_SHARE;

  // Tier badge color
  var tierColor = function(t) {
    if (t === 'Elite') return { color: '#fbbf24', bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.4)' };
    if (t === 'Premium') return { color: '#FFFFFF', bg: 'rgba(255,255,255,0.12)', border: 'rgba(255,255,255,0.3)' };
    return { color: '#FFFFFF', bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.18)' };
  };

  var nftSelectStyle = {
    backgroundColor: 'rgba(56,56,56,0.7)',
    color: '#FFFFFF',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '8px 28px 8px 10px',
    fontSize: '13px',
    fontWeight: 600,
    width: '100%',
    outline: 'none',
    cursor: 'pointer',
    WebkitAppearance: 'none',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\'%3E%3Cpath d=\'M0 0l5 6 5-6z\' fill=\'%23999\'/%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
  };

  var tabStyle = function(name) {
    var active = scenario === name;
    return {
      flex: '1 1 0%',
      minWidth: '120px',
      padding: '10px 12px',
      borderRadius: '10px',
      fontSize: '12px',
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'all 0.2s',
      backgroundColor: active ? '#FFFFFF' : 'rgba(56,56,56,0.7)',
      color: active ? '#000000' : 'rgba(255,255,255,0.7)',
      border: active ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.05)',
    };
  };

  // Clock geometry
  var clockSize = 140;
  var clockR = 56;
  var clockCx = clockSize / 2;
  var clockCy = clockSize / 2;
  var hourFrac = hour / 72;
  var hourAngle = -Math.PI / 2 + hourFrac * Math.PI * 2;
  var hourX = clockCx + clockR * 0.78 * Math.cos(hourAngle);
  var hourY = clockCy + clockR * 0.78 * Math.sin(hourAngle);

  // Build sweep arc up to current hour
  var sweepEndX = clockCx + clockR * Math.cos(hourAngle);
  var sweepEndY = clockCy + clockR * Math.sin(hourAngle);
  var largeArc = hourFrac > 0.5 ? 1 : 0;
  var sweepPath = 'M ' + clockCx + ' ' + (clockCy - clockR) +
    ' A ' + clockR + ' ' + clockR + ' 0 ' + largeArc + ' 1 ' +
    sweepEndX + ' ' + sweepEndY +
    ' L ' + clockCx + ' ' + clockCy + ' Z';

  var pulseKf = '@keyframes fbPulse{0%,100%{opacity:0.55;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}@keyframes fbFlow{0%{stroke-dashoffset:24}100%{stroke-dashoffset:0}}';

  var youColor = tierColor(yourNft.tier);
  var inviteeColor = tierColor(inviteeNft.tier);

  return (
    <div style={{ backgroundColor: '#000000', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.05)' }} className="p-6 rounded-xl not-prose" lang={L}>
      <style>{pulseKf}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 style={{ color: '#FFFFFF', margin: 0 }} className="text-lg font-serif italic">{T.title}</h3>
        <span style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '11px', padding: '4px 12px', borderRadius: '9999px', fontWeight: 500 }}>{T.interactive}</span>
      </div>

      {/* NFT Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {/* Your NFT */}
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{T.yourNft}</label>
            <span style={{ color: youColor.color, backgroundColor: youColor.bg, border: '1px solid ' + youColor.border, fontSize: '9px', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700, textTransform: 'uppercase' }} lang="en">{yourNft.tier}</span>
          </div>
          <select value={yourLevel} onChange={function(e) { setYourLevel(Number(e.target.value)); }} style={nftSelectStyle}>
            {NFT_DATA.map(function(n) {
              return <option key={n.level} value={n.level}>{T.level + n.level + ' — ' + n.name + ' · ' + fmtUsd(n.limit)}</option>;
            })}
          </select>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '6px' }}>{T.yourNftHint}: <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{fmtUsd(yourNft.limit)}</span></div>
        </div>

        {/* Invitee's First NFT */}
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{T.inviteeNft}</label>
            <span style={{ color: inviteeColor.color, backgroundColor: inviteeColor.bg, border: '1px solid ' + inviteeColor.border, fontSize: '9px', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700, textTransform: 'uppercase' }} lang="en">{inviteeNft.tier}</span>
          </div>
          <select value={inviteeLevel} onChange={function(e) { setInviteeLevel(Number(e.target.value)); }} style={nftSelectStyle}>
            {NFT_DATA.map(function(n) {
              return <option key={n.level} value={n.level}>{T.level + n.level + ' — ' + n.name + ' · ' + fmtUsd(n.price)}</option>;
            })}
          </select>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '6px' }}>{T.inviteeNftHint}</div>
        </div>
      </div>

      {/* KPI strip: commission + remaining */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{T.commission}</div>
          <div style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 900, lineHeight: 1.2, marginTop: '4px' }}>{fmtUsd(commission)}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '4px' }}>{pctText(SPONSOR_FIRST_PURCHASE) + ' ' + T.commissionHint}</div>
        </div>
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)' }} className="rounded-xl p-4">
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{T.remaining}</div>
          <div style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 900, lineHeight: 1.2, marginTop: '4px' }}>{fmtUsd(yourNft.limit)}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '4px' }}>{T.remainingHint}</div>
        </div>
      </div>

      {/* Trigger banner */}
      <div style={{
        backgroundColor: triggered ? 'rgba(96,165,250,0.08)' : 'rgba(74,222,128,0.06)',
        border: '1px solid ' + (triggered ? 'rgba(96,165,250,0.3)' : 'rgba(74,222,128,0.2)'),
        padding: '12px 16px',
        borderRadius: '12px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '32px', height: '32px',
          borderRadius: '50%',
          backgroundColor: triggered ? 'rgba(96,165,250,0.18)' : 'rgba(74,222,128,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          fontSize: '16px',
        }}>
          {triggered ? '❄' : '✓'}
        </div>
        <div>
          <div style={{ color: triggered ? '#60a5fa' : '#4ade80', fontSize: '13px', fontWeight: 700 }}>
            {triggered ? T.triggerOn : T.triggerOff}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '2px' }}>
            {triggered ? T.triggerOnSub : T.triggerOffSub}
          </div>
        </div>
      </div>

      {/* Split visualization */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {/* Immediate */}
        <div style={{
          backgroundColor: 'rgba(74,222,128,0.06)',
          border: '1px solid rgba(74,222,128,0.25)',
          borderRadius: '12px',
          padding: '16px',
        }}>
          <div className="flex items-center justify-between mb-1">
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{T.immediate}</span>
            <span style={{ color: '#4ade80', backgroundColor: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)', fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px' }}>{T.now}</span>
          </div>
          <div style={{ color: '#4ade80', fontSize: '26px', fontWeight: 900 }}>{fmtUsd(inLimit)}</div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', marginTop: '4px' }}>{T.immediateHint}</div>
        </div>

        {/* Frozen */}
        <div style={{
          backgroundColor: triggered ? 'rgba(96,165,250,0.07)' : 'rgba(255,255,255,0.02)',
          border: '1px solid ' + (triggered ? 'rgba(96,165,250,0.3)' : 'rgba(255,255,255,0.08)'),
          borderRadius: '12px',
          padding: '16px',
          opacity: triggered ? 1 : 0.55,
        }}>
          <div className="flex items-center justify-between mb-1">
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{T.frozen}</span>
            <span style={{
              color: triggered ? '#60a5fa' : 'rgba(255,255,255,0.4)',
              backgroundColor: triggered ? 'rgba(96,165,250,0.12)' : 'rgba(255,255,255,0.05)',
              border: '1px solid ' + (triggered ? 'rgba(96,165,250,0.3)' : 'rgba(255,255,255,0.1)'),
              fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px'
            }}>{fill(T.hoursN, 72)}</span>
          </div>
          <div style={{ color: triggered ? '#60a5fa' : 'rgba(255,255,255,0.35)', fontSize: '26px', fontWeight: 900 }}>{fmtUsd(frozen)}</div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', marginTop: '4px' }}>{T.frozenHint}</div>
        </div>
      </div>

      {/* 75/20/5 mini split */}
      {inLimit > 0 && (
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)', padding: '12px 14px', borderRadius: '12px', marginBottom: '20px' }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>{T.lostHeader}</div>
          <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
            <div style={{ width: '75%', backgroundColor: '#4ade80' }} />
            <div style={{ width: '20%', backgroundColor: '#fbbf24' }} />
            <div style={{ width: '5%', backgroundColor: '#60a5fa' }} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#4ade80', display: 'inline-block' }} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 600 }}>{pctText(0.75)} {T.reg}</span>
              </div>
              <div style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 700 }}>{fmtUsd(inLimit * 0.75)}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '9px' }}>{T.regHint}</div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#fbbf24', display: 'inline-block' }} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 600 }}>{pctText(0.20)} {T.acc}</span>
              </div>
              <div style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 700 }}>{fmtUsd(inLimit * 0.20)}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '9px' }}>{T.accHint}</div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#60a5fa', display: 'inline-block' }} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 600 }}>{pctText(0.05)} {T.pool}</span>
              </div>
              <div style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 700 }}>{fmtUsd(inLimit * 0.05)}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '9px' }}>{T.poolHint}</div>
            </div>
          </div>
        </div>
      )}

      {/* 72-hour resolution panel — only when frozen */}
      {triggered && (
        <div style={{ backgroundColor: '#383838', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            {/* Animated 72h clock */}
            <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
              <svg width={clockSize} height={clockSize} viewBox={'0 0 ' + clockSize + ' ' + clockSize}>
                <circle cx={clockCx} cy={clockCy} r={clockR} fill="rgba(96,165,250,0.05)" stroke="rgba(96,165,250,0.2)" strokeWidth="1" />
                <path d={sweepPath} fill="rgba(96,165,250,0.18)" />
                {[0, 18, 36, 54].map(function(t) {
                  var a = -Math.PI / 2 + (t / 72) * Math.PI * 2;
                  var x1 = clockCx + (clockR - 6) * Math.cos(a);
                  var y1 = clockCy + (clockR - 6) * Math.sin(a);
                  var x2 = clockCx + clockR * Math.cos(a);
                  var y2 = clockCy + clockR * Math.sin(a);
                  return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />;
                })}
                <line x1={clockCx} y1={clockCy} x2={hourX} y2={hourY} stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx={clockCx} cy={clockCy} r="3" fill="#60a5fa" />
                <text x={clockCx} y={clockCy - 18} textAnchor="middle" fill="rgba(255,255,255,0.45)" style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{fill(T.hoursN, 72)}</text>
                <text x={clockCx} y={clockCy + 22} textAnchor="middle" fill="#FFFFFF" style={{ fontSize: '15px', fontWeight: 800 }}>{fill(T.hoursN, hour)}</text>
              </svg>
            </div>
            <div style={{ flex: '1 1 0%' }}>
              <div style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>{T.timerHeader}</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', marginBottom: '12px' }}>{T.timerSub}</div>
              <div className="flex flex-wrap gap-2">
                <button onClick={function() { setScenario('upgrade'); }} style={tabStyle('upgrade')}>{T.tabUpgrade}</button>
                <button onClick={function() { setScenario('autobuy'); }} style={tabStyle('autobuy')}>{T.tabAutobuy}</button>
                <button onClick={function() { setScenario('forfeit'); }} style={tabStyle('forfeit')}>{T.tabForfeit}</button>
              </div>
            </div>
          </div>

          {/* Scenario panels */}
          {scenario === 'upgrade' && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
              <div style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>{T.upgradeTitle}</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', lineHeight: 1.5, marginBottom: '12px' }}>{T.upgradeBody}</div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', display: 'block' }}>{T.upgradeChoose}</label>
                <select value={upgradeLevel} onChange={function(e) { setUpgradeLevel(Number(e.target.value)); }} style={nftSelectStyle}>
                  {NFT_DATA.filter(function(n) { return n.level > yourLevel; }).map(function(n) {
                    return <option key={n.level} value={n.level}>{T.level + n.level + ' — ' + n.name + ' · ' + fmtUsd(n.price)}</option>;
                  })}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div style={{ backgroundColor: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{T.upgradeReleased}</div>
                  <div style={{ color: '#4ade80', fontSize: '16px', fontWeight: 800, marginTop: '2px' }}>{fmtUsd(frozen)}</div>
                </div>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{T.upgradeNewLimit}</div>
                  <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 800, marginTop: '2px' }}>{fmtUsd(upgradeNft.limit)}</div>
                </div>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{T.upgradeRemaining}</div>
                  <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 800, marginTop: '2px' }}>{fmtUsd(upgradeRemaining)}</div>
                </div>
              </div>

              {!upgradeCovers && (
                <div style={{ marginTop: '10px', color: 'rgba(251,191,36,0.85)', fontSize: '11px' }}>{T.upgradeImpossible}</div>
              )}
            </div>
          )}

          {scenario === 'autobuy' && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
              <div style={{ color: '#FFFFFF', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>{T.autobuyTitle}</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', lineHeight: 1.5, marginBottom: '12px' }}>{T.autobuyBody}</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{T.autobuyRefreshed}</div>
                  <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 800, marginTop: '2px' }}>{fmtUsd(refreshedLimit)}</div>
                </div>
                <div style={{ backgroundColor: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{T.autobuyAbsorbed}</div>
                  <div style={{ color: '#4ade80', fontSize: '16px', fontWeight: 800, marginTop: '2px' }}>{fmtUsd(autobuyAbsorbed)}</div>
                </div>
                <div style={{ backgroundColor: autobuyLeftover > 0 ? 'rgba(96,165,250,0.06)' : 'rgba(255,255,255,0.04)', border: '1px solid ' + (autobuyLeftover > 0 ? 'rgba(96,165,250,0.25)' : 'rgba(255,255,255,0.08)'), borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{T.autobuyLeftover}</div>
                  <div style={{ color: autobuyLeftover > 0 ? '#60a5fa' : 'rgba(255,255,255,0.6)', fontSize: '16px', fontWeight: 800, marginTop: '2px' }}>{fmtUsd(autobuyLeftover)}</div>
                </div>
              </div>
              <div style={{ marginTop: '10px', color: 'rgba(255,255,255,0.45)', fontSize: '11px', fontStyle: 'italic' }}>{T.autobuyNote}</div>
            </div>
          )}

          {scenario === 'forfeit' && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '14px' }}>
              <div style={{ color: '#f87171', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>{T.forfeitTitle}</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', lineHeight: 1.5, marginBottom: '12px' }}>{T.forfeitBody}</div>

              {/* Forfeit split bar */}
              <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{ width: pct(FORFEIT_POOL_SHARE), backgroundColor: '#60a5fa' }} />
                <div style={{ width: pct(FORFEIT_SPONSOR_SHARE), backgroundColor: '#f87171' }} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div style={{ backgroundColor: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.25)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#60a5fa', display: 'inline-block' }} />
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 600 }}>{pctText(FORFEIT_POOL_SHARE)} — {T.forfeitPool}</span>
                  </div>
                  <div style={{ color: '#60a5fa', fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>{fmtUsd(forfeitPool)}</div>
                </div>
                <div style={{ backgroundColor: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: '#f87171', display: 'inline-block' }} />
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 600 }}>{pctText(FORFEIT_SPONSOR_SHARE)} — {T.forfeitSponsor}</span>
                  </div>
                  <div style={{ color: '#f87171', fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>{fmtUsd(forfeitSponsor)}</div>
                </div>
              </div>
              <div style={{ marginTop: '10px', color: 'rgba(255,255,255,0.45)', fontSize: '11px' }}>{T.forfeitCascade}</div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', lineHeight: 1.6, marginTop: '14px', marginBottom: 0 }}>
        {triggered ? T.footerNote : T.noFreezeFooter}
      </p>
    </div>
  );
};

function createWeeklyReport() {
  // 1. 対象週（先週）の開始・終了日を計算
  var today = new Date();
  var dayOfWeek = today.getDay();
  if (dayOfWeek == 0) dayOfWeek = 7;                     // 日曜を7に置換
  var startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek + 1);  // 月曜日の日付
  startOfWeek.setHours(0, 0, 0, 0); // 時間を0時に揃える
  var endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 5);          // 翌週月曜（endは非包含）

  // 2. カレンダーからイベント取得
  const myCalendar = CalendarApp.getCalendarById('koichi.taka.0818@gmail.com');
  var events = myCalendar.getEvents(startOfWeek, endOfWeek);
  events.sort(function(a, b) {
    return a.getStartTime() - b.getStartTime();
  });

  // 3. イベント情報を日付ごとに要約テキスト化
  var reportLines = [];
  var currentDateStr = "";
  for (var i = 0; i < events.length; i++) {
    var ev = events[i];
    var start = ev.getStartTime();
    var end   = ev.getEndTime();
    var dateStr = Utilities.formatDate(start, Session.getScriptTimeZone(), "yyyy/MM/dd（E）");
    // 日付ヘッダー（新しい日付なら追加）
    if (dateStr !== currentDateStr) {
      reportLines.push("\n" + dateStr + ":");
      currentDateStr = dateStr;
    }
    // 時刻範囲とタイトル・説明要約を組み立て
    var timeStr = Utilities.formatDate(start, Session.getScriptTimeZone(), "HH:mm") + "-" +
                  Utilities.formatDate(end, Session.getScriptTimeZone(), "HH:mm");
    var title = ev.getTitle();
    var description = ev.getDescription();
    var summary = title;
    if (description) {
      var descLine = description.trim().split(/\r?\n/)[0];  // 説明の最初の行を取得
      if (descLine !== "") {
        summary += " – " + descLine;  // タイトルに説明要旨を付加（長文の場合は必要に応じて省略）
      }
    }
    reportLines.push("- " + timeStr + " " + summary);
  }

  var reportText = reportLines.join("\n");
  Logger.log(reportText);
}

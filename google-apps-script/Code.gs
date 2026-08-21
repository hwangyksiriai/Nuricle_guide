/**
 * NURICLE 캠페인 신청 폼 → 구글시트 연동
 *
 * 사용법:
 * 1) 이 스프레드시트에서 확장 프로그램 > Apps Script 를 연다.
 * 2) 기본으로 생긴 Code.gs 내용을 지우고 이 파일 내용을 통째로 붙여넣는다.
 * 3) 저장 후 배포 > 새 배포 > 유형: 웹 앱
 *    - 실행할 계정: 나
 *    - 액세스 권한이 있는 사용자: 전체
 * 4) 배포 후 발급되는 웹 앱 URL(.../exec)을 복사해서 전달한다.
 *    (index.html 등 각 페이지의 GAS_WEB_APP_URL에 채워 넣을 값)
 *
 * A~F 등급 지원자 전체가 같은 시트(첫 번째 탭)에 쌓이고, '등급'/'고료' 컬럼으로 구분된다.
 */

var TARGET_SHEET_NAME = '시트1';
var HEADER = ['제출시각', '등급', '고료', '이름', '인스타그램', '휴대폰', '이메일', '우편번호', '주소', '요청사항'];

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(TARGET_SHEET_NAME) || ss.getSheets()[0];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER);
    sheet.getRange(1, 1, 1, HEADER.length).setFontWeight('bold');
  }

  sheet.appendRow([
    new Date(),
    data.tier || '',
    data.price || '',
    data.name || '',
    data.instagram || '',
    data.phone ? "'" + data.phone : '',
    data.email || '',
    data.zipcode ? "'" + data.zipcode : '',
    data.address || '',
    data.note || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
